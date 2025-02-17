import { Task, TaskStatus } from "../../types/task";
import { TaskCard } from "./TaskCard";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

interface TaskListProps {
  tasks: Task[];
  onComplete: (taskHash: string) => Promise<void>;
  onDelete: (taskHash: string) => Promise<void>;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalTasks: number;
  contract: ethers.Contract | null;
  isContractLoading: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onComplete,
  onDelete,
  onPageChange,
  currentPage,
  totalTasks,
  contract,
  isContractLoading,
}) => {
  const [view, setView] = useState<"all" | "active" | "completed">("all");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    const filterTasks = () => {
      const filtered = tasks.filter((task) => {
        if (task.status === TaskStatus.ARCHIVED) return false;

        if (view === "active") return task.status === TaskStatus.IN_PROGRESS;
        if (view === "completed") return task.status === TaskStatus.COMPLETED;
        return true;
      });

      setFilteredTasks(filtered);
    };

    filterTasks();
  }, [tasks, view]);

  // Show loading state while contract initializes
  if (isContractLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Connecting to smart contract...</p>
      </div>
    );
  }

  // Show error if contract failed to initialize
  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500 mb-2">Failed to connect to smart contract</p>
        <p className="text-gray-500">
          Please refresh the page or try again later
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={() => setView("all")}
          className={`px-4 py-2 rounded-md transition-colors ${
            view === "all"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All Tasks
        </button>
        <button
          onClick={() => setView("active")}
          className={`px-4 py-2 rounded-md transition-colors ${
            view === "active"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setView("completed")}
          className={`px-4 py-2 rounded-md transition-colors ${
            view === "completed"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Completed
        </button>
      </div>

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {view === "all" && "No tasks found. Create your first task!"}
            {view === "active" && "No active tasks"}
            {view === "completed" && "No completed tasks"}
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={() => onComplete(task.task_hash)}
                  onDelete={() => onDelete(task.task_hash)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalTasks > 10 && (
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 
                    hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage * 10 >= totalTasks}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 
                    hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
