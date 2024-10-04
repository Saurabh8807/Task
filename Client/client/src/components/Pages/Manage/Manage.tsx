import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import TaskModal from './TaskModal';
import TaskStageBox from './TaskStageBox';
import axios from '../../../axios';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import TaskShimmer from '../../Shimmer/Shimmer';
interface Task {
  _id: string;
  name: string;
  stage: number;
  priority: number;
  deadline: string;
}

const Manage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/task/user');
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (formData: { name: string; priority: number; deadline: string }) => {
    if (selectedTask) {
      try {
        const response = await axios.put(`/task/${selectedTask._id}`, formData);
        if (response.status === 200) {
          toast.success('Task updated successfully');
          fetchTasks();
          toggleModal(); 
          setSelectedTask(null); 
        }
      } catch (error: any) {
        console.error('Error updating task:', error);
        toast.error(error.response?.data?.message || 'Failed to update task');
      }
    } else {
      const { name, priority, deadline } = formData;
      try {
        const response = await axios.post('/task', { name, priority, deadline });
        if (response.status === 201) {
          toast.success('Task created successfully');
          fetchTasks();
          toggleModal(); 
        }
      } catch (error: any) {
        console.error('Error:', error);
        toast.error(error.response?.data?.message || 'Failed to create task');
      }
    }
  };

  const handleEditTask = async (task: Task): Promise<void> => {
    setSelectedTask(task); 
    toggleModal();
  };

  const handleAddTask = () => {
    setSelectedTask(null); 
    toggleModal(); 
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await axios.delete(`/task/${id}`);
      if (response.status === 200) {
        toast.success('Task deleted successfully');
        fetchTasks();
      }
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleMoveTask = async (id: string, direction: 'forward' | 'backward') => {
    try {
      const response = await axios.put(`/task/move/${id}/${direction}`);
      if (response.status === 200) {
        toast.success(`Task moved ${direction}`);
        fetchTasks();
      }
    } catch (error: any) {
      console.error('Error moving task:', error);
      toast.error(error.response?.data?.message || `Failed to move task ${direction}`);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const backlogTasks = tasks.filter((task) => task.stage === 0);
  const todoTasks = tasks.filter((task) => task.stage === 1);
  const ongoingTasks = tasks.filter((task) => task.stage === 2);
  const doneTasks = tasks.filter((task) => task.stage === 3);

  return (
    <div className="bg-white p-8 min-h-screen rounded-lg shadow-md">
      <ToastContainer /> 
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Manage Tasks</h1>
        <button
          onClick={handleAddTask}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
        >
          <FaPlus className="mr-2" />
          Add Task
        </button>
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={toggleModal} 
        onSubmit={handleTaskSubmit} 
        task={selectedTask} 
      />

      {loading ? (
        <p className="text-gray-500"><TaskShimmer/></p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <TaskStageBox
            title="Backlog"
            tasks={backlogTasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
          />
          <TaskStageBox
            title="To Do"
            tasks={todoTasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
          />
          <TaskStageBox
            title="Ongoing"
            tasks={ongoingTasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
          />
          <TaskStageBox
            title="Done"
            tasks={doneTasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
          />
        </div>
      )}
    </div>
  );
};

export default Manage;
