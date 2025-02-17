import React, { useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "../../hooks/useWallet";
import { taskService } from "../../services/task.service";
import { Button } from "../common/button/Button";
import { toast } from "react-toastify";
import { CONTRACT_CONFIG } from "../../config/contract.config";

interface CreateTaskModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const { address } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    priority: 0,
    dueDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const waitingToastId = toast.loading(
        "Please confirm the transaction in your wallet"
      );
      const { timestamp } = await taskService.getTimestamp();

      const taskHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["string", "address", "uint256"],
          [formData.title, address, timestamp]
        )
      );

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        signer
      );

      const tx = await contract.createTask(taskHash);

      toast.update(waitingToastId, {
        render: "Transaction submitted! Waiting for confirmation...",
        type: "info",
        isLoading: true,
      });

      await tx.wait();

      await taskService.createTask({
        title: formData.title,
        priority: Number(formData.priority),
        due_date: formData.dueDate ? new Date(formData.dueDate) : undefined,
        task_hash: taskHash,
        user_address: address || "",
        timestamp,
      });

      toast.dismiss(waitingToastId);
      toast.success("Task completed successfully!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error details:", error);

      // More specific error handling
      if (error.code === "ACTION_REJECTED") {
        toast.error("Transaction was rejected. Please try again.");
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        toast.error("Insufficient funds to complete transaction.");
      } else if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
        toast.error("Error estimating gas. Please try again.");
      } else if (error.code === "CALL_EXCEPTION") {
        toast.error("Contract call failed. The task might already exist.");
      } else {
        toast.error(
          error.reason ||
            error.message ||
            "Failed to create task. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Create New Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority (0-5)
            </label>
            <input
              type="number"
              min="0"
              max="5"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isLoading}>
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
