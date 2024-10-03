import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Import toast

// Add a utility function to format the date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
};

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { name: string; priority: number; deadline: string }) => void;
  task: { name: string; priority: number; deadline: string } | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, task }) => {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState<number | ''>(''); // Set initial value as ''
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (task) {
      setName(task.name);
      setPriority(task.priority);
      setDeadline(formatDate(task.deadline));
    } else {
      resetForm();
    }
  }, [task]);

  const resetForm = () => {
    setName('');
    setPriority(''); // Resetting to empty string
    setDeadline('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && priority !== '' && deadline) { 
      onSubmit({ name, priority, deadline });
      toast.success('Task submitted successfully!'); 
      resetForm(); // Reset form after submission
      onClose(); // Close modal after submission
    } else {
      toast.error('Please fill in all fields.'); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 scale-95 hover:scale-100 max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b-2 border-blue-600 pb-2">{task ? 'Edit Task' : 'Add Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">Task Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Enter task name"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">Priority</label>
            <select
              value={priority === '' ? '' : priority} 
              onChange={(e) => setPriority(Number(e.target.value))} 
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
            >
              <option value="">Select Priority</option>
              <option value="0">Low</option>
              <option value="1">Medium</option>
              <option value="2">High</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 text-gray-500 hover:text-gray-800 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
