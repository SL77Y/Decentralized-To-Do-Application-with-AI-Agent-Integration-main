import React, { useState, useEffect } from "react";
import { Task, TaskStatus } from "../../types/task";
import { Button } from "../common/button/Button";
import { toast } from "react-toastify";
import { aiService } from "../../services/ai.service";

interface AISuggestionsProps {
  tasks: Task[];
  onSortTasks: (sortedTaskIds: string[]) => void;
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({
  tasks,
  onSortTasks,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [productivityTip, setProductivityTip] = useState<string | null>(null);
  const [reminders, setReminders] = useState<
    { title: string; message: string }[]
  >([]);
  const [dismissedReminders, setDismissedReminders] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<
    { title: string; reason: string }[] | null
  >(null);

  const updateReminders = async () => {
    try {
      const reminder = await aiService.generateReminders(tasks);
      const parsedReminders = reminder
        .split("\n")
        .map((line: string) => {
          const match = line.match(/Task: (.+?) -> Reminder: (.+)/);
          return match ? { title: match[1], message: match[2] } : null;
        })
        .filter(Boolean);

      setReminders(parsedReminders);
    } catch (error) {
      console.error("Failed to generate reminders:", error);
    }
  };

  const updateProductivityTip = async () => {
    try {
      const completedTasks = tasks.filter(
        (t) => t.status === TaskStatus.COMPLETED
      ).length;
      const tip = await aiService.getProductivityTip(
        completedTasks,
        tasks.length
      );
      setProductivityTip(tip);
    } catch (error) {
      console.error("Failed to get productivity tip:", error);
    }
  };

  useEffect(() => {
    updateReminders();
  }, [tasks]);

  useEffect(() => {
    updateProductivityTip();

    const interval = setInterval(() => {
      updateProductivityTip();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const analyzeTasks = async () => {
    setIsAnalyzing(true);
    try {
      const suggestions = await aiService.suggestPriorities(tasks);
      const { structuredSuggestions, updatedTasks } =
        parseSuggestionsAndSortTasks(suggestions as string, tasks);

      setAiSuggestions(structuredSuggestions);
      onSortTasks(updatedTasks.map((task) => task.id));

      toast.success("Tasks reordered based on AI analysis");
    } catch (error) {
      toast.error("Failed to analyze tasks");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDismissAll = () => {
    if (reminders.length > 0) {
      const dismissedTitles = reminders.map((reminder) => reminder.title);
      setDismissedReminders([...dismissedReminders, ...dismissedTitles]);
      setReminders([]);
      toast.success("All reminders dismissed");
    }
  };

  const handleDismissReminder = (reminderIndex: number) => {
    const updatedReminders = reminders.filter(
      (_, index) => index !== reminderIndex
    );
    setDismissedReminders([
      ...dismissedReminders,
      reminders[reminderIndex].title,
    ]);
    setReminders(updatedReminders);
    toast.success("Reminder dismissed");
  };

  return (
    <div className="space-y-6">
      {/* Priority Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-medium text-lg mb-4 text-gray-900">
          AI Task Analysis
        </h3>

        <Button
          onClick={analyzeTasks}
          className="w-full"
          isLoading={isAnalyzing}
        >
          {isAnalyzing ? "Analyzing Tasks..." : "Analyze & Sort Tasks"}
        </Button>

        <div className="mt-4 text-sm text-gray-600">
          <p>AI will analyze tasks based on:</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Task content and context</li>
            <li>Due dates</li>
            <li>Current priorities</li>
          </ul>
        </div>

        {aiSuggestions && aiSuggestions.length > 0 && (
          <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900">
              AI Suggested Priorities:
            </h4>
            <div className="space-y-4 mt-2">
              {aiSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500"
                >
                  <h5 className="font-medium text-gray-900">
                    {index + 1}. {suggestion.title}
                  </h5>
                  <p className="text-sm text-gray-600 mt-2">
                    {suggestion.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Productivity Tip */}
      {productivityTip && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-medium text-gray-900 mb-2">
            💡 Productivity Tip
          </h3>
          <p className="text-gray-600 text-sm">{productivityTip}</p>
        </div>
      )}

      {/* Overdue Task Reminders */}
      <div className="p-6 bg-gray-50 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900">Task Reminders</h3>
        <p className="text-sm text-gray-600 mt-1">
          Stay on top of your tasks with these reminders.
        </p>

        <div className="mt-4">
          {reminders.length > 0 ? (
            <div className="space-y-4">
              {reminders.map((reminder, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-400"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-md font-medium text-gray-900">
                        {reminder.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {reminder.message}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDismissReminder(index)}
                      className="text-sm text-gray-500 hover:text-gray-800"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={handleDismissAll}
                className="mt-4 text-sm text-red-500 hover:text-red-700"
              >
                Dismiss All
              </button>
            </div>
          ) : (
            <p className="text-gray-500">No reminders available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to parse AI suggestions and sort tasks
const parseSuggestionsAndSortTasks = (
  suggestions: string,
  tasks: Task[]
): {
  updatedTasks: Task[];
  structuredSuggestions: { title: string; reason: string }[];
} => {
  const lines = suggestions.split("\n").filter((line) => line.trim() !== "");
  const structuredSuggestions: { title: string; reason: string }[] = [];
  const priorityMap = new Map<string, number>();

  for (const line of lines) {
    const match = line.match(/Task: (.+?) -> Reason: (.+)/);
    if (match) {
      const title = match[1].trim();
      const reason = match[2].trim();

      structuredSuggestions.push({ title, reason });
      const task = tasks.find((t) => t.title === title);
      if (task) {
        priorityMap.set(title, task.priority || 0);
      }
    }
  }

  const updatedTasks = tasks
    .map((task) => {
      if (priorityMap.has(task.title)) {
        return {
          ...task,
          priority: priorityMap.get(task.title)!, // Assign new or existing priority
        };
      }
      return task;
    })
    .sort((a, b) => {
      if (a.status === TaskStatus.COMPLETED) return 1;
      if (b.status === TaskStatus.COMPLETED) return -1;
      return b.priority - a.priority;
    });

  return { updatedTasks, structuredSuggestions };
};
