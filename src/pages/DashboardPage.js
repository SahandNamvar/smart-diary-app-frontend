import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { FaEye, FaChartBar, FaPenFancy } from "react-icons/fa";
import Lottie from "lottie-react";
import LoadingAnimation from "../assets/LoadingAnimation.json";
import LineChart from "../components/LineChart";
import WordCloud from "react-d3-cloud";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("newDiary");
  const [entryText, setEntryText] = useState("");
  const [gptResponse, setGptResponse] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }

    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }

    if (gptResponse) {
      const timer = setTimeout(() => {
        setGptResponse("");
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, error, gptResponse]);

  // Handle diary entry submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setGptResponse("");
    setLoading(true);

    // Prevent submission if the entry text is empty
    if (!entryText.trim()) {
      setError("Cannot submit an empty diary entry");
      setLoading(false);
      return;
    }

    // Check if the entry text is too short or too long
    if (entryText.length < 10 || entryText.length > 500) {
      setError("Diary entry must be between 10 and 500 characters");
      setLoading(false);
      return;
    }

    if (editMode) {
      // Update existing diary entry
      try {
        const response = await api.put(`/entries/:id=${editId}`, {
          text_entry: entryText,
        });
        if (response.data.entry.auto_response) {
          setGptResponse(response.data.entry.auto_response);
          setSuccess(true);
          setEditMode(false);
          setEntryText("");
          setSelectedEntry(null);
          setEditId("");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error updating entry");
        //console.error("Error updating entry:", err);
      } finally {
        setLoading(false);
      }
    } else {
      // Save new diary entry
      try {
        const response = await api.post("/entries", { text_entry: entryText });
        if (response.data.entry.auto_response) {
          setGptResponse(response.data.entry.auto_response);
          setSuccess(true);
          setEntryText("");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error submitting entry");
        //console.error("Error submitting entry:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Fetch entries from backend
  const fetchEntries = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await api.get("/entries");
      setEntries(response.data.entries);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching entries");
      //console.error("Error fetching entries:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete diary entry
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (!confirmDelete) return;

    setError("");
    setLoading(true);

    try {
      await api.delete(`/entries/:id=${id}`);

      fetchEntries();

      setSelectedEntry(null);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting entry");
      console.error("Error deleting entry:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to process the fetched data for Mood Trends & Word Frequencies
  const getMoodTrends = (entries) => {
    return entries.map((entry) => ({
      date: new Date(entry.createdAt).toLocaleDateString(),
      sentiment_score: entry.sentiment_score,
    }));
  };

  const getWordFrequencies = (entries) => {
    const stopWords = [
      "and",
      "or",
      "the",
      "a",
      "an",
      "is",
      "to",
      "in",
      "of",
      "on",
      "at",
      "for",
      "with",
      "by",
      "from",
      "that",
      "this",
      "it",
      "as",
      "be",
      "was",
      "were",
      "are",
      "am",
      "will",
      "has",
      "just",
      "but",
      "not",
      "so",
      "no",
      "yes",
      "if",
      "else",
      "then",
      "there",
      "here",
      "today",
      "its",
    ];
    const wordCounts = {};

    entries.forEach((entry) => {
      const words = entry.text_entry
        .toLowerCase()
        .replace(/[^a-z\s]/g, "") // Removes non-alphabetic characters
        .split(/\s+/) // Splits into words
        .filter((word) => !stopWords.includes(word) && word.length > 2); // Exclude stop words and short words

      words.forEach((word) => {
        wordCounts[word] = (wordCounts[word] || 0) + 1; // Count occurrences
      });
    });

    console.log("Total entries:", entries.length); // Logs total entries processed
    console.log("Unique words count:", Object.keys(wordCounts).length); // Logs the number of unique words

    return Object.entries(wordCounts)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value) // Sort by frequency
      .slice(0, 50); // Get top 50
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-100">
      {/* Top Message Banner (Error & Success) */}
      <div
        className={`fixed top-0 left-0 right-0 py-4 px-6 z-50 
            transition-transform duration-500 ease-in-out transform 
            ${
              success ? "bg-green-600" : error ? "bg-red-600" : "hidden"
            } translate-y-0`}
      >
        <div className="container mx-auto flex justify-center items-center">
          {success ? (
            <p className="text-white font-medium">
              Changes saved successfully!
            </p>
          ) : (
            <p className="text-white font-medium">{error}</p>
          )}
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg p-4 flex justify-between items-center">
        <h1
          className="text-3xl font-bold text-gray-800 font-serif cursor-pointer hover:text-gray-600"
          onClick={() => setActiveTab("newDiary")}
        >
          📔 My Smart Diary
        </h1>
        <button
          className="text-gray-600 hover:text-gray-800 hover:underline font-semibold
        "
          onClick={handleLogout}
        >
          🗝️ Logout
        </button>
      </nav>

      {/* Dashboard Cards */}
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* View Diaries Card */}
          <div
            onClick={() => {
              setActiveTab("viewDiaries");
              fetchEntries();
            }}
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105 bg-opacity-70 backdrop-blur-md hover:bg-opacity-90"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FaEye className="mr-2 text-blue-500" />
              View Diaries
            </h2>
            <p className="text-gray-600">
              Explore your past entries and reflect on your journey.
            </p>
          </div>

          {/* New Diary Entry Card */}
          <div
            onClick={() => setActiveTab("newDiary")}
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105 bg-opacity-70 backdrop-blur-md hover:bg-opacity-90"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FaPenFancy className="mr-2 text-purple-500" />
              New Diary Entry
            </h2>
            <p className="text-gray-600">
              Pen down your thoughts and experiences today.
            </p>
          </div>

          {/* Graphs (Emotional Trends) Card */}
          <div
            onClick={() => setActiveTab("graphs")}
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105 bg-opacity-70 backdrop-blur-md hover:bg-opacity-90"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FaChartBar className="mr-2 text-green-500" />
              Graphs
            </h2>
            <p className="text-gray-600">
              Analyze emotional trends and insights with visual graphs.
            </p>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="mt-8">
          {activeTab === "default" && (
            <p className="text-center text-gray-600">
              Select an option above to get started.
            </p>
          )}

          {/* View Diaries */}
          {activeTab === "viewDiaries" && (
            <div className="bg-white p-6 rounded-xl shadow-lg bg-opacity-70 backdrop-blur-md overflow-y-auto max-h-full">
              <h2 className="text-xl font-bold mb-4">
                Your Previous Diaries {`(${entries.length})`}
              </h2>

              {error && <p className="text-red-600">{error}</p>}

              <div>
                {entries.length > 0 ? (
                  entries.map((entry) => (
                    <div
                      key={entry._id}
                      onClick={() => setSelectedEntry(entry)}
                      className="p-4 mb-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition"
                    >
                      <p className="text-gray-800 font-semibold">
                        {new Date(entry.createdAt).toLocaleString()}
                      </p>
                      <p className="text-gray-600 truncate">
                        {entry.text_entry}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">
                    No diary entries found - Write your first diary entry!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* View Diary Entry Modal */}
          {selectedEntry && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg p-4">
                <h3 className="text-md font-semibold text-gray-800 mb-4">
                  <span
                    className="text-gray-400 text-sm italic mr-2 font-normal
                  "
                  >
                    Entry from{" "}
                  </span>{" "}
                  {new Date(selectedEntry.createdAt).toLocaleString()}
                </h3>

                <p className="text-gray-700">{selectedEntry.text_entry}</p>
                <hr className="my-4 border-gray-200" />

                {selectedEntry.auto_response && (
                  <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <h4 className="text-gray-400 text-sm italic">
                      Auto response
                    </h4>
                    <p className="text-gray-700 mt-2">
                      {selectedEntry.auto_response}
                    </p>
                  </div>
                )}

                {/* 3 buttons for modal: Close, edit, edit */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      handleDelete(selectedEntry._id);
                    }}
                    className="text-red-500 hover:text-red-700 mr-4"
                  >
                    {" "}
                    Delete{" "}
                  </button>

                  <button
                    onClick={() => {
                      setEditMode(true);
                      setEntryText(selectedEntry.text_entry);
                      setEditId(selectedEntry._id);
                      setActiveTab("newDiary");
                      setSelectedEntry(null);
                    }}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    {" "}
                    Edit{" "}
                  </button>

                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    {" "}
                    Close{" "}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Graphs */}
          {activeTab === "graphs" && (
            <div className="bg-white p-6 rounded-xl shadow-lg bg-opacity-70 backdrop-blur-md">
              <h2 className="text-xl font-bold mb-4">Emotional Trends</h2>

              {error && <p className="text-red-600">{error}</p>}
              {loading && (
                <div className="flex justify-center items-center">
                  <Lottie
                    animationData={LoadingAnimation}
                    loop={true}
                    className="w-40 h-40"
                  />
                </div>
              )}

              {!loading && entries.length > 0 ? (
                <>
                  {/* Mood Trends */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">
                      Mood Trends Over Time
                    </h3>
                    <LineChart moodTrends={getMoodTrends(entries)} />
                  </div>

                  {/* Frequent Words */}
                  <div className="border border-gray-200 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">
                      Word Frequencies
                    </h3>
                    <WordCloud
                      data={getWordFrequencies(entries)}
                      font="serif"
                      fontWeight="bold"
                      fontSize={(word) =>
                        Math.max(Math.log2(word.value) * 20, 12)
                      } // Ensures minimum size
                      rotate={(word) => word.value % 90} // Random rotation
                      padding={8}
                      spiral="archimedean"
                      fill={(d) => `hsl(${Math.random() * 360}, 80%, 70%)`} // Colorful words
                      width={600}
                      height={300}
                    />

                    {/* Pin the following to the right side */}
                    <p className="text-sm text-gray-600 mt-4 italic flex justify-end">
                      {" "}
                      {`Top 50 words`}{" "}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-600">
                  Not enough data to generate graphs. Write more diary entries
                  to see insights!
                </p>
              )}
            </div>
          )}

          {/* New Diary Entry Form */}
          {activeTab === "newDiary" && (
            <div className="bg-white p-6 rounded-xl shadow-lg bg-opacity-70 backdrop-blur-md">
              <h2 className="text-xl font-bold mb-4">
                {editMode
                  ? "My Personal Space - edit mode"
                  : "My Personal Space"}
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Diary Entry Textarea with Loading animation while submitting form */}
                <div className="relative">
                  <textarea
                    className={`w-full p-4 mb-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    placeholder="Share your thoughts..."
                    rows={
                      window.innerWidth >= 1024
                        ? 16
                        : window.innerWidth >= 768
                        ? 8
                        : 4
                    } // Default 16 rows for desktop, 8 for tablet, 4 for mobile
                    value={entryText}
                    onChange={(e) => setEntryText(e.target.value)}
                    disabled={loading} // Disable textarea when loading
                  />

                  {/* Loading Animation */}
                  {loading && (
                    <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 backdrop-blur-md">
                      <Lottie
                        animationData={LoadingAnimation}
                        loop={true}
                        className="w-80 h-80"
                      />
                    </div>
                  )}

                  {/* Character Count */}
                  <p className="text-sm text-gray-600 text-right">
                    {entryText.length}/500
                  </p>
                </div>

                {editMode ? (
                  // If edit mode is enabled, show 2 buttons: Save Changes and Cancel
                  <div className="flex justify-center items-center">
                    <div className="inline-flex rounded-md shadow-sm role='group' space-x-2">
                      <button
                        type="submit"
                        className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold p-3 rounded-lg shadow-md hover:shadow-lg 
                        transition-transform transform hover:bg-gradient-to-l ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={loading} // Disable button when loading
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setEntryText("");
                        }}
                        className="bg-red-500 text-white font-bold p-3 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Otherwise, show a single button: Save Diary (main form submission button)
                  <button
                    type="submit"
                    className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold p-3 rounded-lg shadow-md hover:shadow-lg 
                    transition-transform transform hover:bg-gradient-to-l ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading} // Disable button when loading
                  >
                    Save Diary
                  </button>
                )}
              </form>

              {/* Display GPT-3 Response */}
              {gptResponse && (
                <div className="mt-6 bg-blue-100 p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold text-gray-800">
                    Your Friendly AI Assistant:
                  </h3>
                  <p className="text-gray-700 mt-2">{gptResponse}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
