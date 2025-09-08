import React, { useEffect, useState } from "react";
import axios from "../api/Api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
      if(!token) {
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingId) {
        await axios.patch(`/api/task/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/tasks", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({ title: "", description: "" });
      setEditingId(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setFormData({ title: task.title, description: task.description });
    setEditingId(task._id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/deltask/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (task) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(`/api/task/${task._id}`, {
        completed: !task.completed,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
<div className="p-6 max-w-4xl mx-auto">
  <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900">
    My Tasks
  </h1>

  {/* Task Form */}
  <form
    onSubmit={handleSubmit}
    className="bg-white shadow-md rounded-lg p-6 mb-8"
  >
    <input
      type="text"
      name="title"
      placeholder="Task Title"
      value={formData.title}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded-md p-3 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      required
    />
    <textarea
      name="description"
      placeholder="Task Description"
      value={formData.description}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded-md p-3 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    />
    <button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md shadow-sm transition"
    >
      {editingId ? "Update Task" : "Add Task"}
    </button>
  </form>

  {/* Task List */}
  <div className="grid gap-6">
    {tasks.map((task) => (
      <div
        key={task._id}
        className={`flex justify-between items-center bg-white border border-gray-200 shadow-sm p-5 rounded-md transition ${
          task.completed ? "opacity-60" : "hover:shadow-md"
        }`}
      >
        <div>
          <h2
            className={`text-lg font-semibold ${
              task.completed ? "line-through text-gray-400" : "text-gray-900"
            }`}
          >
            {task.title}
          </h2>
          <p className={`text-gray-600 ${task.completed ? "italic" : ""}`}>
            {task.description}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Created: {new Date(task.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => toggleComplete(task)}
            className={`px-4 py-2 rounded-md font-medium transition ${
              task.completed
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {task.completed ? "Done" : "Mark Done"}
          </button>
          <button
            onClick={() => handleEdit(task)}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md font-medium transition shadow-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(task._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
</div>


  );
}

export default Dashboard;
