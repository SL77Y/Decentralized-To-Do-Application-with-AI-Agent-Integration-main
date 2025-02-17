import React, { useState, useEffect } from "react";
import { Header } from "../components/header/Header";
import { TaskList } from "../components/tasks/TaskList";
import { Button } from "../components/common/button/Button";
import { taskService } from "../services/task.service";
import { toast } from "react-toastify";
import { Task, TaskStatus } from "../types/task";
import { CreateTaskModal } from "../components/tasks/CreateTaskModal";
import { ethers } from "ethers";
import { CONTRACT_CONFIG } from "../config/contract.config";
import { useWallet } from "../hooks/useWallet";
import { AISuggestions } from "../components/suggestion/AISuggestion";

export const Dashboard: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const { address } = useWallet();
  const [isContractLoading, setIsContractLoading] = useState(true);
  const [sortedTaskIds, setSortedTaskIds] = useState<string[]>([]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await taskService.getTasks({
        page,
        limit: 10,
      });
      setTasks(response.tasks);
      setTotal(response.total);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortTasks = (newSortOrder: string[]) => {
    setSortedTaskIds(newSortOrder);
  };

  const initializeContract = async () => {
    setIsContractLoading(true);
    if (window.ethereum && address) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(
          CONTRACT_CONFIG.address,
          CONTRACT_CONFIG.abi,
          signer
        );
        setContract(contractInstance);
        toast.success("Connected to smart contract");
      } catch (error) {
        console.error("Failed to initialize contract:", error);
        toast.error("Failed to connect to smart contract");
      }
    }
    setIsContractLoading(false);
  };

  useEffect(() => {
    fetchTasks();
    initializeContract();
  }, [page, address]);

  const taskStats = {
    inProgress: tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS)
      .length,
    completed: tasks.filter((task) => task.status === TaskStatus.COMPLETED)
      .length,
    total: tasks.length,
  };

  const handleComplete = async (taskHash: string) => {
    const waitingToastId = toast.loading(
      "Please confirm the transaction in your wallet"
    );
    if (isContractLoading) {
      toast.info("Please wait while we connect to the contract");
      return;
    }
    if (!contract) {
      toast.error("Contract not initialized");
      return;
    }
    try {
      const tx = await contract.completeTask(taskHash);

      toast.update(waitingToastId, {
        render: "Transaction submitted! Waiting for confirmation...",
        type: "info",
        isLoading: true,
      });

      await tx.wait();

      await taskService.verifyUpdate(taskHash, { isCompleted: true });

      toast.dismiss(waitingToastId);
      toast.success("Task completed successfully!");
      fetchTasks();
    } catch (error: any) {
      console.error("Error completing task:", error);

      if (error.code === "ACTION_REJECTED") {
        toast.error("Transaction was rejected. Please try again.");
      } else if (error.code === "CALL_EXCEPTION") {
        toast.error("Failed to complete task. It might already be completed.");
      } else {
        toast.error(error.reason || error.message || "Failed to complete task");
      }
    }
  };

  const handleDelete = async (taskHash: string) => {
    const waitingToastId = toast.loading(
      "Please confirm the transaction in your wallet"
    );
    if (isContractLoading) {
      toast.info("Please wait while we connect to the contract");
      return;
    }
    if (!contract) {
      toast.error("Contract not initialized");
      return;
    }
    try {
      const tx = await contract.deleteTask(taskHash);

      toast.update(waitingToastId, {
        render: "Transaction submitted! Waiting for confirmation...",
        type: "info",
        isLoading: true,
      });

      await tx.wait();

      await taskService.verifyUpdate(taskHash, { isDeleted: true });

      toast.dismiss(waitingToastId);
      toast.success("Task deleted successfully!");
      fetchTasks();
    } catch (error: any) {
      console.error("Error deleting task:", error);

      if (error.code === "ACTION_REJECTED") {
        toast.error("Transaction was rejected. Please try again.");
      } else if (error.code === "CALL_EXCEPTION") {
        toast.error("Failed to delete task. It might already be deleted.");
      } else {
        toast.error(error.reason || error.message || "Failed to delete task");
      }
    }
  };

  // Update your Dashboard layout to include AI suggestions
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Tasks</h1>
            <p className="text-gray-600">Manage and track your tasks</p>
          </div>

          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create New Task
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Your existing stats cards */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main task list - takes up 3 columns */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <TaskList
                  tasks={
                    sortedTaskIds.length > 0
                      ? [...tasks].sort((a, b) => {
                          const aIndex = sortedTaskIds.indexOf(a.id);
                          const bIndex = sortedTaskIds.indexOf(b.id);
                          return aIndex - bIndex;
                        })
                      : tasks
                  }
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                  onPageChange={setPage}
                  currentPage={page}
                  totalTasks={total}
                  contract={contract}
                  isContractLoading={isContractLoading}
                />
              )}
            </div>
          </div>

          {/* AI Suggestions sidebar - takes up 1 column */}
          <div>
            <AISuggestions tasks={tasks} onSortTasks={handleSortTasks} />
          </div>
        </div>

        {isCreateModalOpen && (
          <CreateTaskModal
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={() => {
              fetchTasks();
            }}
          />
        )}
      </main>
    </div>
  );
};
