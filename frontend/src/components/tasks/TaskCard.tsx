import { TaskStatus } from "../../types/task";
import { Button } from "../common/button/Button";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    status: TaskStatus;
    priority: number;
    due_date?: Date;
  };
  onComplete: (taskHash: string) => Promise<void>;
  onDelete: (taskHash: string) => Promise<void>;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onComplete,
  onDelete,
}) => {
  const isCompleted = task.status === TaskStatus.COMPLETED;

  return (
    <div
      className={`
        bg-white rounded-lg shadow p-4 transition-all
        ${isCompleted ? "opacity-75" : ""}
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3
            className={`font-medium ${
              isCompleted ? "line-through text-gray-500" : "text-gray-900"
            }`}
          >
            {task.title}
          </h3>
          <p className="text-sm text-gray-500">Priority: {task.priority}</p>
          {task.due_date && (
            <p className="text-sm text-gray-500">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </p>
          )}
          {isCompleted && (
            <span className="text-sm text-green-600 mt-1 inline-block">
              ✓ Completed
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          {!isCompleted && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onComplete(task.id)}
            >
              Complete
            </Button>
          )}
          {!isCompleted && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
