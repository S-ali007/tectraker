import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

const SelectProjectsBtn = ({
  projects = [],
  selectedProjects = [],
  toggleProjectSelection,
  handleDeselectSelect,
  extraClasses
}) => {
  const [activeAction, setActiveAction] = useState(false);
  const actionRef = useRef(null);

  const handleActions = () => {
    setActiveAction(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionRef.current && !actionRef.current.contains(event.target)) {
        setActiveAction(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <button
        onClick={() => handleActions()}
        className={`max-w-[193px]  flex w-full px-[16px] py-[11px] ${
          selectedProjects.length ? "opacity-100" : "opacity-[0.6]"
        } hover:bg-[#e7f4ff] bg-[#f0f1f4] rounded-[6px] border-[#f0f1f4] border justify-around items-center`}
      >
        <div>
          <svg
            fill="#000000"
            height="15px"
            width="15px"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M460.2 272.6h-52.3v-15.7c0-11.3-9.1-20.4-20.4-20.4s-20.4 9.1-20.4 20.4v15.7H144.9v-15.7c0-11.3-9.1-20.4-20.4-20.4S104.1 245.6 104.1 257v15.7H51.8V136.3h408.3v136.3zm-408.4 187.6v-146.7h52.3v15.7c0 11.3 9.1 20.4 20.4 20.4s20.4-9.1 20.4-20.4v-15.7h222v15.7c0 11.3 9.1 20.4 20.4 20.4s20.4-9.1 20.4-20.4v-15.7h52.3v146.7H51.8zm130.8-408.4h131.8v41.8H182.6v-41.8zm298 43.6H355.2v-52.1c0-17.8-14.5-32.3-32.3-32.3H174.1c-17.8 0-32.3 14.5-32.3 32.3v52.1H31.3c-11.3 0-20.4 9.1-20.4 20.4v364.7c0 11.3 9.1 20.4 20.4 20.4h449.2c11.3 0 20.4-9.1 20.4-20.4V95.2c0-11.2-9.1-20.4-20.4-20.4z"></path>
          </svg>
        </div>
        <div className="text-[14px] text-[#000] opacity-100">
          {selectedProjects.length
            ? `${selectedProjects.length} Projects Selected`
            : "Select Project"}
        </div>
        <svg
          fill="#000000"
          height="10px"
          width="10px"
          viewBox="0 0 330 330"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M325.607 79.393c-5.857-5.857-15.355-5.858-21.213 0.001l-139.39 139.393L25.607 79.393c-5.857-5.857-15.355-5.858-21.213 0.001-5.858 5.858-5.858 15.355 0 21.213l150.004 150c2.813 2.813 6.628 4.393 10.606 4.393s7.794-1.581 10.606-4.394l149.996-150c5.858-5.858 5.858-15.355 0-21.213z"></path>
        </svg>
      </button>
      {activeAction && (
        <div
          className={`absolute ${extraClasses}  max-w-[240px] w-full p-[8px] bg-white rounded-md shadow-lg z-20`}
          ref={actionRef}
        >
          <button
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-[14px] font-[600]"
            onClick={() => handleDeselectSelect()}
          >
            {selectedProjects.length === projects.length
              ? "Deselect All Projects"
              : "Select All Projects"}
          </button>
          {projects.map((project) => (
            <div key={project._id} className="flex items-center px-4 py-2">
              <input
                type="checkbox"
                checked={selectedProjects.includes(project._id)}
                onChange={() => toggleProjectSelection(project._id)}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">{project.name}</label>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SelectProjectsBtn;
