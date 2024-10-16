import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("default"); // Tracks the selected card
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/"); // Redirect to the login page if no token is found
        }
    } , [navigate]);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Smart Diary</h1>
        <button className="text-gray-600 hover:text-gray-800" onClick={handleLogout}>Logout</button>
      </nav>

      {/* Dashboard Cards */}
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* View Diaries Card */}
          <div
            onClick={() => setActiveTab("viewDiaries")}
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105"
          >
            <h2 className="text-xl font-bold mb-4">View Diaries</h2>
            <p className="text-gray-600">See all your previous diary entries.</p>
          </div>

          {/* Graphs (Emotional Trends) Card */}
          <div
            onClick={() => setActiveTab("graphs")}
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105"
          >
            <h2 className="text-xl font-bold mb-4">Graphs</h2>
            <p className="text-gray-600">Visualize your emotional trends over time.</p>
          </div>

          {/* New Diary Entry Card */}
          <div
            onClick={() => setActiveTab("newDiary")}
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105"
          >
            <h2 className="text-xl font-bold mb-4">New Diary Entry</h2>
            <p className="text-gray-600">Write a new journal entry for today.</p>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="mt-8">
          {activeTab === "default" && (
            <p className="text-center text-gray-600">Select an option above to get started.</p>
          )}

          {activeTab === "viewDiaries" && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Your Previous Diaries</h2>
              <p className="text-gray-600">[Here we will display a list of all diary entries.]</p>
            </div>
          )}

          {activeTab === "graphs" && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Emotional Trends</h2>
              <p className="text-gray-600">[Here we will display mood graphs and word clouds.]</p>
            </div>
          )}

          {activeTab === "newDiary" && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Write a New Diary Entry</h2>
              <p className="text-gray-600">[Here we will display a rich text editor for writing a new diary entry.]</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
