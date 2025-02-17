import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { TodoList } from "../typechain-types";

describe("TodoList", function () {
  async function deployTodoListFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = (await TodoList.deploy()) as TodoList;

    return { todoList, owner, addr1, addr2 };
  }

  describe("Task Creation", function () {
    it("Should create a new task", async function () {
      const { todoList, owner } = await loadFixture(deployTodoListFixture);
      const taskId = ethers.keccak256(ethers.toUtf8Bytes("Test Task"));

      await todoList.createTask(taskId);
      const task = await todoList.getTask(taskId);

      expect(task.owner).to.equal(owner.address);
      expect(task.isCompleted).to.equal(false);
      expect(task.isDeleted).to.equal(false);
    });

    it("Should emit TaskCreated event", async function () {
      const { todoList, owner } = await loadFixture(deployTodoListFixture);
      const taskId = ethers.keccak256(ethers.toUtf8Bytes("Test Task"));

      const currentTime = await time.latest();
      await time.setNextBlockTimestamp(currentTime);

      await expect(todoList.createTask(taskId))
        .to.emit(todoList, "TaskCreated")
        .withArgs(taskId, owner.address, currentTime);
    });

    it("Should not allow duplicate task IDs", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);
      const taskId = ethers.keccak256(ethers.toUtf8Bytes("Test Task"));

      await todoList.createTask(taskId);
      await expect(todoList.createTask(taskId)).to.be.revertedWith(
        "Task already exists"
      );
    });
  });

  describe("Task Completion", function () {
    async function createTaskFixture() {
      const { todoList, owner, addr1 } = await loadFixture(
        deployTodoListFixture
      );
      const taskId = ethers.keccak256(ethers.toUtf8Bytes("Test Task"));
      await todoList.createTask(taskId);
      return { todoList, owner, addr1, taskId };
    }

    it("Should complete a task", async function () {
      const { todoList, taskId } = await createTaskFixture();
      await todoList.completeTask(taskId);
      const task = await todoList.getTask(taskId);
      expect(task.isCompleted).to.equal(true);
    });

    it("Should emit TaskCompleted event", async function () {
      const { todoList, taskId } = await createTaskFixture();

      const currentTime = await time.latest();
      await time.setNextBlockTimestamp(currentTime);

      await expect(todoList.completeTask(taskId))
        .to.emit(todoList, "TaskCompleted")
        .withArgs(taskId, currentTime);
    });

    it("Should not complete a non-existent task", async function () {
      const { todoList } = await createTaskFixture();
      const fakeTaskId = ethers.keccak256(ethers.toUtf8Bytes("Fake Task"));
      await expect(todoList.completeTask(fakeTaskId)).to.be.revertedWith(
        "Task does not exist"
      );
    });

    it("Should not allow non-owner to complete task", async function () {
      const { todoList, addr1, taskId } = await createTaskFixture();
      await expect(
        todoList.connect(addr1).completeTask(taskId)
      ).to.be.revertedWith("Not task owner");
    });

    it("Should not complete already completed task", async function () {
      const { todoList, taskId } = await createTaskFixture();
      await todoList.completeTask(taskId);
      await expect(todoList.completeTask(taskId)).to.be.revertedWith(
        "Task already completed"
      );
    });
  });

  describe("Task Filtering", function () {
    async function setupTasksFixture() {
      const { todoList, owner, addr1 } = await loadFixture(
        deployTodoListFixture
      );

      // Create three tasks
      const taskId1 = ethers.keccak256(ethers.toUtf8Bytes("Task 1"));
      const taskId2 = ethers.keccak256(ethers.toUtf8Bytes("Task 2"));
      const taskId3 = ethers.keccak256(ethers.toUtf8Bytes("Task 3"));

      await todoList.createTask(taskId1);
      await todoList.createTask(taskId2);
      await todoList.createTask(taskId3);

      // Complete task 2
      await todoList.completeTask(taskId2);
      // Delete task 3
      await todoList.deleteTask(taskId3);

      return { todoList, owner, addr1, taskId1, taskId2, taskId3 };
    }

    it("Should return all active tasks", async function () {
      const { todoList, owner } = await setupTasksFixture();
      const tasks = await todoList.getFilteredTasks(owner.address, true, false);
      expect(tasks.length).to.equal(2);
    });

    it("Should return only incomplete tasks", async function () {
      const { todoList, owner } = await setupTasksFixture();
      const tasks = await todoList.getFilteredTasks(
        owner.address,
        false,
        false
      );
      expect(tasks.length).to.equal(1);
    });

    it("Should return all tasks including deleted", async function () {
      const { todoList, owner } = await setupTasksFixture();
      const tasks = await todoList.getFilteredTasks(owner.address, true, true);
      expect(tasks.length).to.equal(3);
    });

    it("Should return empty array for user with no tasks", async function () {
      const { todoList, addr1 } = await setupTasksFixture();
      const tasks = await todoList.getFilteredTasks(addr1.address, true, true);
      expect(tasks.length).to.equal(0);
    });
  });
});
