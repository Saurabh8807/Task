import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    name: string;
    priority: number;
    deadline: string;
  }) => void;
  task: { name: string; priority: number; deadline: string } | null;
  formError: string | null;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  formError,
}) => {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState<number | "">("");
  const [deadline, setDeadline] = useState("");
  const [nameError, setNameError] = useState("");
  const [priorityError, setPriorityError] = useState("");
  const [deadlineError, setDeadlineError] = useState("");

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
    setName("");
    setPriority("");
    setDeadline("");
    setNameError("");
    setPriorityError("");
    setDeadlineError("");
  };

  const validateForm = () => {
    let isValid = true;
    setNameError("");
    setPriorityError("");
    setDeadlineError("");

    if (!name.trim()) {
      setNameError("Task name is required.");
      isValid = false;
    } else if (/[^a-zA-Z0-9 ]/.test(name)) {
      setNameError(
        "Task name must be alphanumeric without special characters."
      );
      isValid = false;
    }

    if (priority === "") {
      setPriorityError("Priority is required.");
      isValid = false;
    }
    if(formError){
      setNameError(formError);
      isValid = false;
    
    }
    if (!deadline) {
      setDeadlineError("Deadline is required.");
      isValid = false;
    } else {
      const selectedDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        setDeadlineError("Deadline must be greater than today.");
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && !formError) {
      onSubmit({ name, priority: Number(priority), deadline });
      resetForm();
      onClose();
    } else {
      toast.error(formError || "Failed to add task");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {task ? "Edit Task" : "Add Task"}
        </h2>
        {formError && <p className="text-red-500 mb-2">{formError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Task Name</label>
            <input
              type="text"
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring ${
                nameError ? "border-red-500" : ""
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Priority</label>
            <select
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring ${
                priorityError ? "border-red-500" : ""
              }`}
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
            >
              <option value="">Select priority</option>
              <option value={0}>Low</option>
              <option value={1}>Medium</option>
              <option value={2}>High</option>
            </select>
            {priorityError && (
              <p className="text-red-500 text-sm">{priorityError}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Deadline</label>
            <input
              type="date"
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring ${
                deadlineError ? "border-red-500" : ""
              }`}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            {deadlineError && (
              <p className="text-red-500 text-sm">{deadlineError}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {task ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
