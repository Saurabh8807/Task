import React, { memo, useState } from "react";

interface Task {
  _id: string;
  name: string;
  stage: number;
  priority: number;
  deadline: string;
  createdAt: string;
}

interface DateRangeFilterProps {
  tasks: Task[];
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ tasks }) => {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const handleFilter = () => {
    const filteredTasks = tasks.filter((task) => {
      const taskDate = new Date(task.deadline);
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      return taskDate >= startDate && taskDate <= endDate;
    });
    return filteredTasks;
  };

  const filteredTasks = handleFilter();

  return (
    <div className="my-12 ">
      <h2 className="text-2xl font-semibold text-center  text-gray-800 mb-4">Filter Tasks by Deadline</h2>
        <div className="flex flex-col items-end">
        <div className="flex space-x-4  mb-4">
        <label htmlFor="fromDate" className="block mb-1 text-gray-700">From Date</label>

            <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded px-4 py-2"
            />
                        <label htmlFor="toDate" className="block mb-1 text-gray-700">To Date</label>

            <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded px-4 py-2"
            />
        </div>
      </div>
      {/* </div> */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 border-b text-left">Task Name</th>
              <th className="py-3 px-4 border-b text-left">Stage</th>
              <th className="py-3 px-4 border-b text-left">Priority</th>
              <th className="py-3 px-4 border-b text-left">Deadline</th>
              <th className="py-3 px-4 border-b text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-100 transition-colors duration-200">
                  <td className="py-2 px-4 border-b">{task.name}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`inline-block px-3 py-1 rounded-full text-white text-sm ${task.stage === 0 ? 'bg-blue-500' : task.stage === 1 ? 'bg-yellow-500' : task.stage === 2 ? 'bg-orange-500' : 'bg-green-500'}`}>
                      {['Pending', 'To Do', 'Ongoing', 'Done'][task.stage]}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span className={`inline-block px-3 py-1 rounded-full text-white text-sm ${task.priority === 0 ? 'bg-green-500' : task.priority === 1 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                      {['Low', 'Medium', 'High'][task.priority]}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">{new Date(task.deadline).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{new Date(task.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-2 px-4 border-b text-center">No tasks found for the selected date range.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(DateRangeFilter);
