"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

const ProjectAndDateSelector = ({ projects }) => {
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  const toggleProjectSelection = (projectId) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter((id) => id !== projectId));
    } else {
      setSelectedProjects([...selectedProjects, projectId]);
    }
  };

  const handleCustomRange = (rangeType) => {
    switch (rangeType) {
      case "currentWeek":
        setStartDate(startOfWeek(new Date()));
        setEndDate(endOfWeek(new Date()));
        break;
      case "last7Days":
        setStartDate(addDays(new Date(), -7));
        setEndDate(new Date());
        break;
      case "currentMonth":
        setStartDate(startOfMonth(new Date()));
        setEndDate(endOfMonth(new Date()));
        break;
      default:
        break;
    }
    setIsDateDropdownOpen(false);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Project Selection Dropdown */}
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
          className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        >
          {selectedProjects.length > 0
            ? `Selected Projects (${selectedProjects.length})`
            : "All Projects"}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isProjectDropdownOpen && (
          <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="py-1">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() =>
                  setSelectedProjects(
                    selectedProjects.length === projects.length
                      ? []
                      : projects.map((project) => project.id)
                  )
                }
              >
                {selectedProjects.length === projects.length
                  ? "Deselect All Projects"
                  : "Select All Projects"}
              </button>
              {projects.map((project) => (
                <div key={project.id} className="flex items-center px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes(project.id)}
                    onChange={() => toggleProjectSelection(project.id)}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">
                    {project.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Date Range Picker Dropdown */}
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
          className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        >
          {`${startDate.toLocaleDateString()} — ${endDate.toLocaleDateString()}`}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isDateDropdownOpen && (
          <div className="origin-top-right absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="py-1">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleCustomRange("currentWeek")}
              >
                Current week
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleCustomRange("last7Days")}
              >
                Last 7 days
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleCustomRange("currentMonth")}
              >
                Current month
              </button>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                inline
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                inline
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => (
  <div className="p-4">
    <h1 className="text-lg font-bold mb-4">My Activities</h1>
    <ProjectAndDateSelector
      projects={[
        { id: 1, name: "asasa" },
        { id: 2, name: "Project B" },
      ]}
    />
  </div>
);

export default App;
