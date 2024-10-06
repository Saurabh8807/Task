import React, { useState } from "react";
import { FaEdit, FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModal "; // Import the modal

interface Task {
  _id: string;
  name: string;
  stage: number;
  priority: number;
  deadline: string;
}

interface TaskStageBoxProps {
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onMoveTask: (id: string, direction: "forward" | "backward") => Promise<void>;
}

const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 0:
      return "bg-green-500";
    case 1:
      return "bg-yellow-500";
    case 2:
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
};

const TaskStageBox: React.FC<TaskStageBoxProps> = ({
  title,
  tasks,
  onEditTask,
  onDeleteTask,
  onMoveTask,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const sortedTasks = [...tasks].sort((a, b) => b.priority - a.priority);

  const handleDeleteTask = async () => {
    if (taskToDelete) {
      await onDeleteTask(taskToDelete);
      setModalVisible(false);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="flex flex-col bg-gray-300 p-4 rounded-lg shadow-lg transition-transform w-full transform hover:scale-105">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 w-full border-blue-600 pb-2">
        {title}
      </h2>
      <div className="flex flex-col space-y-3 w-full overflow-x-auto">
        {sortedTasks.length ? (
          sortedTasks.map((task) => (
            <div
              key={task._id}
              className="flex justify-between items-center p-4 bg-white w-[160%] sm:w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center">
                <p className="mr-4 font-medium text-gray-700">{task.name}</p>
                <span
                  className={`text-white px-2 py-1 rounded ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority === 0
                    ? "Low"
                    : task.priority === 1
                    ? "Medium"
                    : "High"}
                </span>
                <span className="ml-2 text-gray-500">
                  {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => onMoveTask(task._id, "backward")}
                  disabled={task.stage === 0}
                  className="flex items-center bg-yellow-500 text-white px-2 py-1 rounded disabled:opacity-50"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={() => onEditTask(task)}
                  className="flex items-center bg-blue-600 text-white px-2 py-1 rounded"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => {
                    setTaskToDelete(task._id);
                    setModalVisible(true);
                  }}
                  className="flex items-center bg-red-500 text-white px-2 py-1 rounded"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => onMoveTask(task._id, "forward")}
                  disabled={task.stage === 3}
                  className="flex items-center bg-green-500 text-white px-2 py-1 rounded disabled:opacity-50"
                >
                  <FaArrowRight />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No tasks available</p>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isVisible={isModalVisible}
        message="Are you sure you want to delete this task?"
        onConfirm={handleDeleteTask}
        onCancel={() => setModalVisible(false)}
      />
    </div>
  );
};

export default TaskStageBox;
