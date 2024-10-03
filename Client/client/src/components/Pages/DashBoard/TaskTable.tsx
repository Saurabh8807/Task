// TaskTable.tsx
import React from 'react';

interface Task {
  _id: string;
  name: string;
  stage: number;
  priority: number;
  deadline: string;
  createdAt: string; // Add createdAt property
}

interface TaskTableProps {
  tasks: Task[];
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Task Name</th>
            <th className="py-2 px-4 border-b">Stage</th>
            <th className="py-2 px-4 border-b">Priority</th>
            <th className="py-2 px-4 border-b">Deadline</th>
            <th className="py-2 px-4 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task._id}>
                <td className="py-2 px-4 border-b">{task.name}</td>
                <td className="py-2 px-4 border-b">{['Pending', 'To Do', 'Ongoing', 'Done'][task.stage]}</td>
                <td className="py-2 px-4 border-b">{task.priority}</td>
                <td className="py-2 px-4 border-b">{new Date(task.deadline).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{new Date(task.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-2 px-4 text-center">No tasks available for this timeframe.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
