import React from 'react';
import { FaEdit, FaTrash, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

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
  onMoveTask: (id: string, direction: 'forward' | 'backward') => Promise<void>;
}

// Function to get background color based on priority
const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 0:
      return 'bg-green-500'; // Low priority
    case 1:
      return 'bg-yellow-500'; // Medium priority
    case 2:
      return 'bg-red-500'; // High priority
    default:
      return 'bg-gray-400'; // Default color
  }
};

const TaskStageBox: React.FC<TaskStageBoxProps> = ({ title, tasks, onEditTask, onDeleteTask, onMoveTask }) => {
  const sortedTasks = [...tasks].sort((a, b) => b.priority - a.priority);

  return (
    <div className="bg-gray-300 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">{title}</h2>
      {sortedTasks.length ? (
        sortedTasks.map((task) => (
          <div key={task._id} className="flex justify-between items-center mb-3 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center">
              <p className="mr-4 font-medium text-gray-700">{task.name}</p>
              <span className={`text-white px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                {task.priority === 0 ? 'Low' : task.priority === 1 ? 'Medium' : 'High'}
              </span>
              <span className="ml-2 text-gray-500">{new Date(task.deadline).toLocaleDateString()}</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => onMoveTask(task._id, 'backward')}
                disabled={task.stage === 0}
                className="flex items-center bg-yellow-500 text-white px-2 py-1 rounded disabled:opacity-50 hover:bg-yellow-600 transition duration-200"
              >
                <FaArrowLeft className="mr-1" />
                Back
              </button>
              <button
                onClick={() => onMoveTask(task._id, 'forward')}
                disabled={task.stage === 3}
                className="flex items-center bg-green-500 text-white px-2 py-1 rounded disabled:opacity-50 hover:bg-green-600 transition duration-200"
              >
                <FaArrowRight className="mr-1" />
                Forward
              </button>
              <button 
                onClick={() => onEditTask(task)} 
                className="flex items-center bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition duration-200"
              >
                <FaEdit className="mr-1" />
                Edit
              </button>
              <button 
                onClick={() => onDeleteTask(task._id)} 
                className="flex items-center bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-200"
              >
                <FaTrash className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No tasks available.</p>
      )}
    </div>
  );
};

export default TaskStageBox;
