import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../axios";
import {
  FaTasks,
  FaClipboardList,
  FaPlay,
  FaCheckCircle,
} from "react-icons/fa";
import Card from "./Card"; 
import PieChart from "./PieChart"; 
import TaskShimmer from "../../Shimmer/Shimmer";

interface Task {
  _id: string;
  name: string;
  stage: number;
  priority: number;
  deadline: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState<"weekly" | "monthly" | "yearly">(
    "weekly"
  );
  const [chartData, setChartData] = useState<any>({});

  const handleclick = () => {
    navigate("../manage");
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/task/user");
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  
  const getTodayTasks = () => {
    const today = new Date().toLocaleDateString();
  
    return tasks.filter((task) => {
      const taskDate = new Date(task.deadline).toLocaleDateString();
      return taskDate === today;
    });
  };
  
  const getFilteredTasks = () => {
    const now = new Date();
    let start: Date;
    let end: Date;

    if (timeFrame === "weekly") {
      const dayOfWeek = now.getDay();
      start = new Date(now.setDate(now.getDate() - dayOfWeek));
      end = new Date(now.setDate(start.getDate() + 6));
    } else if (timeFrame === "monthly") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (timeFrame === "yearly") {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear() + 1, 0, 0);
    }

    return tasks.filter((task) => {
      const taskDate = new Date(task.deadline);
      return taskDate >= start && taskDate <= end;
    });
  };

  const countTasksByStage = (timeFrame: string) => {
    const now = new Date();
    let start: Date;
    let end: Date;

    if (timeFrame === "weekly") {
      const dayOfWeek = now.getDay();
      console.log(now)
      console.log(dayOfWeek)
      start = new Date(now.setDate(now.getDate() - dayOfWeek));
      console.log(start)
      end = new Date(now.setDate(start.getDate() + 6));
      console.log(end)

    } else if (timeFrame === "monthly") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (timeFrame === "yearly") {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear() + 1, 0, 0);
    } 

    const filteredTasks = tasks.filter((task) => {
      const taskDate = new Date(task.deadline);
      return taskDate >= start && taskDate <= end;
    });

    const doneTasks = filteredTasks.filter((task) => task.stage === 3).length;
    const pendingTasks = filteredTasks.filter(
      (task) => task.stage === 0
    ).length;
    const todoTasks = filteredTasks.filter((task) => task.stage === 1).length;
    const ongoingTasks = filteredTasks.filter(
      (task) => task.stage === 2
    ).length;

    return {
      labels: ["Done", "Pending", "To Do", "Ongoing"],
      data: [doneTasks, pendingTasks, todoTasks, ongoingTasks],
    };
  };

  useEffect(() => {
    const { labels, data } = countTasksByStage(timeFrame);
    setChartData({
      labels,
      datasets: [
        {
          label: "Task Count",
          data,
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(54, 162, 235, 0.6)",
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [tasks, timeFrame]);


  if (loading) {
    return <p className="text-center text-gray-600"><TaskShimmer/></p>;
  }

  const completeTask = async (taskId: string) => {
    try {
    await axios.put(`/task/${taskId}/complete`);
      alert("Task completed successfully!");
  
      fetchTasks();
    } catch (error) {
      console.error("Error completing task:", error);
      alert("Failed to complete task. Please try again.");
    }
  };
  
  const filteredTasks = getFilteredTasks();

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">Dashboard</h1>
        <div className="mt-4 md:mt-0">
          <button
            onClick={handleclick}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300"
          >
            Manage Tasks
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <Card
          title="Pending Tasks"
          count={tasks.filter((task) => task.stage === 0).length}
          color="bg-blue-500 text-white"
          Icon={FaClipboardList}
        />
        <Card
          title="To Do Tasks"
          count={tasks.filter((task) => task.stage === 1).length}
          color="bg-green-500 text-white"
          Icon={FaTasks}
        />
        <Card
          title="Ongoing Tasks"
          count={tasks.filter((task) => task.stage === 2).length}
          color="bg-yellow-500 text-white"
          Icon={FaPlay}
        />
        <Card
          title="Done Tasks"
          count={tasks.filter((task) => task.stage === 3).length}
          color="bg-gray-500 text-white"
          Icon={FaCheckCircle}
        />
        <Card
          title="Total Tasks"
          count={tasks.length}
          color="bg-purple-500 text-white"
          Icon={FaTasks}
        />
      </div>
      <div className="mt-8">
  <div className="mt-8">
  <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Tasks Due Today</h2>
 {getTodayTasks().length > 0 ? (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
      <thead>
        <tr className="bg-gray-200">
          <th className="py-3 px-4 border-b text-left">Task Name</th>
          <th className="py-3 px-4 border-b text-left">Stage</th>
          <th className="py-3 px-4 border-b text-left">Priority</th>
          <th className="py-3 px-4 border-b text-left">Deadline</th>
          <th className="py-3 px-4 border-b text-left">Created At</th>
          <th className="py-3 px-4 border-b text-left">Actions</th> 
        </tr>
      </thead>
      <tbody>
        {getTodayTasks()
          .filter(task => task.stage !== 3) 
          .map((task) => (
            <tr
              key={task._id}
              className="hover:bg-gray-100 transition-colors duration-200"
            >
              <td className="py-2 px-4 border-b">{task.name}</td>
              <td className="py-2 px-4 border-b">
                <span
                  className={`inline-block px-3 py-1 text-white rounded-full text-sm ${
                    task.stage === 0
                      ? "bg-blue-500"
                      : task.stage === 1
                      ? "bg-yellow-500"
                      : task.stage === 2
                      ? "bg-orange-500"
                      : "bg-green-500"
                  }`}
                >
                  {["Pending", "To Do", "Ongoing", "Done"][task.stage]}
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                <span
                  className={`inline-block px-3 py-1 text-white rounded-full text-sm ${
                    task.priority === 0
                      ? "bg-green-500"
                      : task.priority === 1
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {task.priority === 0 ? "Low" : task.priority === 1 ? "Medium" : "High"}
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                {new Date(task.deadline).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b">
                {new Date(task.createdAt).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b">
                {task.stage !== 3 && (
                  <button
                    onClick={() => completeTask(task._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
                  >
                    Complete Task
                  </button>
                )}
              </td>
            </tr>
          ))}

        {getTodayTasks()
          .filter(task => task.stage === 3) 
          .map((task) => (
            <tr
              key={task._id}
              className="bg-gray-100"
            >
              <td className="py-2 px-4 border-b line-through text-gray-400">{task.name}</td>
              <td className="py-2 px-4 border-b">
                <span className="inline-block px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                  Done
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                <span className="inline-block px-3 py-1 text-white rounded-full text-sm bg-green-500">
                  {task.priority === 0 ? "Low" : task.priority === 1 ? "Medium" : "High"}
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                {new Date(task.deadline).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b">
                {new Date(task.createdAt).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  disabled
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow cursor-not-allowed"
                >
                  Task Completed
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
) : (
  <p className="text-gray-600 text-center">No tasks are due today.</p>
)}

</div>

</div>

      <div className="m-6 flex justify-end">
        <select
          value={timeFrame}
          onChange={(e) =>
            setTimeFrame(e.target.value as "weekly" | "monthly" | "yearly")
          }
          className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <div className="col-span-1">
          <PieChart chartData={chartData} />
        </div>

        <div className="col-span-2">
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
                    <tr
                      key={task._id}
                      className="hover:bg-gray-100 transition-colors duration-200"
                    >
                      <td className="py-2 px-4 border-b">{task.name}</td>
                      <td className="py-2 px-4 border-b">
                        <span
                          className={`inline-block px-3 py-1 text-white rounded-full text-sm ${
                            task.stage === 0
                              ? "bg-blue-500"
                              : task.stage === 1
                              ? "bg-yellow-500"
                              : task.stage === 2
                              ? "bg-orange-500"
                              : "bg-green-500"
                          }`}
                        >
                          {["Pending", "To Do", "Ongoing", "Done"][task.stage]}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <span
                          className={`inline-block px-3 py-1 text-white rounded-full text-sm ${
                            task.priority === 0
                              ? "bg-green-500"
                              : task.priority === 1
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        >
                          {task.priority === 0
                            ? "Low"
                            : task.priority === 1
                            ? "Medium"
                            : "High"}
                        </span>
                      </td>{" "}
                      <td className="py-2 px-4 border-b">
                        {new Date(task.deadline).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center">
                      No tasks available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
