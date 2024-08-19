"use client";
import api from "@/api";
import WebTracker from "@/assets/icons/WebTracker";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
function page() {
  const [taskName, setTaskName] = useState("Working on xddd");
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const { projects, currentProjectId, archiveProjects } = useSelector(
    (state) => state.project
  );
  const userId = "66b4ae28c38cc474c45f1159";
  const startTimer = async () => {
    setStartTime(new Date());
    setIsRunning(true);

    const intervalId = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);

    setTimerId(intervalId);
  };
  const stopTimer = async () => {
    clearInterval(timerId);
    setEndTime(new Date());
    const response = await api.post("/api/v1/project/:id/time-entries", {
      user_id: userId,
      task_name: taskName,
      start_time: startTime,
      end_time: endTime,
    });
    console.log(response);
    // const endTime = new Date();
    // await api.put(`/api/time/stop/${entryId}`, { end_time: endTime });
    setIsRunning(false);
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const orderByName = () => handleSort("name");
  const orderByCreation = () => handleSort("created_at");
  return (
    <div className="max-w-[1440px] w-full px-[50px] py-[32px]">
      <h1 className="text-[21px] leading-[24px] font-[700] text-[#404040]">
        Web Tracker
      </h1>
      {/* <div className="w-full flex flex-col items-center justify-center h-[75vh]">
        <WebTracker />

        <div className="max-w-[448px] w-full text-center">
          <p className="mt-[20px]">
            You don’t have any tracking projects yet..
          </p>
        </div>
      </div> */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="block w-full">
          {/* orders-ALL */}
          <ul class=" flex justify-between text-[14px] pl-[10px] text-gray-400 mt-[40px] pb-[15px]   border-[#e6e9ed]">
            <div className="flex items-center  w-full gap-[30px]">
              {/* name */}

              <button
                title="Ascending ordering by Name"
                type="button"
                value="projectname"
                className="flex items-center gap-[10px]"
                onClick={orderByName}
              >
                Name
                <div className="max-w-[8px] w-full ">
                  {" "}
                  <svg viewBox="0 0 256 256">
                    <defs></defs>
                    <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                      <path
                        d="M 90 65.75 c 0 0.896 -0.342 1.792 -1.025 2.475 c -1.366 1.367 -3.583 1.367 -4.949 0 L 45 29.2 L 5.975 68.225 c -1.367 1.367 -3.583 1.367 -4.95 0 c -1.366 -1.367 -1.366 -3.583 0 -4.95 l 41.5 -41.5 c 1.366 -1.367 3.583 -1.367 4.949 0 l 41.5 41.5 C 89.658 63.958 90 64.854 90 65.75 z"
                        transform=" matrix(1 0 0 1 0 0) "
                        stroke-linecap="round"
                      />
                    </g>
                  </svg>{" "}
                  <svg width="6px" height="3px"></svg>
                  <svg viewBox="0 0 256 256">
                    <defs></defs>
                    <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                      <path
                        d="M 90 24.25 c 0 -0.896 -0.342 -1.792 -1.025 -2.475 c -1.366 -1.367 -3.583 -1.367 -4.949 0 L 45 60.8 L 5.975 21.775 c -1.367 -1.367 -3.583 -1.367 -4.95 0 c -1.366 1.367 -1.366 3.583 0 4.95 l 41.5 41.5 c 1.366 1.367 3.583 1.367 4.949 0 l 41.5 -41.5 C 89.658 26.042 90 25.146 90 24.25 z"
                        transform=" matrix(1 0 0 1 0 0) "
                        stroke-linecap="round"
                      />
                    </g>
                  </svg>
                  <svg width="6px" height="3px"></svg>
                </div>
              </button>

              {/* created date */}
              <button
                title="Ascending ordering by Creation Date"
                type="button"
                value="creationdate"
                onClick={orderByCreation}
                className="flex items-center gap-[10px] max-w-[105px] w-full"
              >
                Creation Date
                <div className="max-w-[5px] w-full ">
                  <svg viewBox="0 0 256 256">
                    <defs></defs>
                    <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                      <path
                        d="M 90 65.75 c 0 0.896 -0.342 1.792 -1.025 2.475 c -1.366 1.367 -3.583 1.367 -4.949 0 L 45 29.2 L 5.975 68.225 c -1.367 1.367 -3.583 1.367 -4.95 0 c -1.366 -1.367 -1.366 -3.583 0 -4.95 l 41.5 -41.5 c 1.366 -1.367 3.583 -1.367 4.949 0 l 41.5 41.5 C 89.658 63.958 90 64.854 90 65.75 z"
                        transform=" matrix(1 0 0 1 0 0) "
                        stroke-linecap="round"
                      />
                    </g>
                  </svg>{" "}
                  <svg width="6px" height="3px"></svg>
                  <svg viewBox="0 0 256 256">
                    <defs></defs>
                    <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                      <path
                        d="M 90 24.25 c 0 -0.896 -0.342 -1.792 -1.025 -2.475 c -1.366 -1.367 -3.583 -1.367 -4.949 0 L 45 60.8 L 5.975 21.775 c -1.367 -1.367 -3.583 -1.367 -4.95 0 c -1.366 1.367 -1.366 3.583 0 4.95 l 41.5 41.5 c 1.366 1.367 3.583 1.367 4.949 0 l 41.5 -41.5 C 89.658 26.042 90 25.146 90 24.25 z"
                        transform=" matrix(1 0 0 1 0 0) "
                        stroke-linecap="round"
                      />
                    </g>
                  </svg>
                  <svg width="6px" height="3px"></svg>
                </div>
              </button>
            </div>
            <div className="flex items-center gap-[150px] pr-[25px]">
              {/* actions */}
              <li>
                <span>Actions</span>
                <div></div>
              </li>
            </div>
          </ul>
          {projects.map((item, id) => (
            <div
              key={id}
              className="max-w-[1354px] w-full p-[10px] border-t border-[#e6e9ed]  flex"
            >
              <Link
                href={`/projects/edit?id=${item._id}`}
                className="flex items-center gap-[30px] w-full"
              >
                <div class="project_icon bg-[#c2c7cd] max-w-[40px] w-full flex justify-center items-center p-2 rounded-[50%]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 28 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_201_84216)">
                      <path
                        d="M3.64843 22.7529H23.5351C25.9609 22.7529 27.1562 21.5811 27.1562 19.1787V7.77637C27.1562 5.37402 25.9609 4.20215 23.5351 4.20215H3.64843C1.23437 4.20215 0.0273438 5.37402 0.0273438 7.77637V19.1787C0.0273438 21.5811 1.23437 22.7529 3.64843 22.7529ZM3.67187 20.8779C2.52343 20.8779 1.91406 20.292 1.91406 19.085V7.87011C1.91406 6.6748 2.52343 6.07715 3.67187 6.07715H23.5117C24.6601 6.07715 25.2695 6.6748 25.2695 7.87011V19.085C25.2695 20.292 24.6601 20.8779 23.5117 20.8779H3.67187ZM7.64453 5.22168H9.46093V3.14746C9.46093 2.25683 9.98828 1.75293 10.9023 1.75293H16.2812C17.1953 1.75293 17.7109 2.25683 17.7109 3.14746V5.19824H19.5273V3.27637C19.5273 1.07324 18.3671 0.0419922 16.2461 0.0419922H10.9257C8.92187 0.0419922 7.64453 1.07324 7.64453 3.27637V5.22168Z"
                        fill="white"
                        fill-opacity="0.85"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_201_84216">
                        <rect
                          width="27.1289"
                          height="22.7227"
                          fill="white"
                          transform="translate(0.0273438 0.0419922)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div>
                  <h1 className="text-[17px] text-[#404040]">{item.name}</h1>

                  <p className="text-[11px] text-[#acb3bb]">
                    created on {formatTime(item.createdAt)}
                  </p>
                </div>
              </Link>

              <div className="max-w-[250px] w-full flex justify-between ">
                {/* team members */}

                <div className="max-w-[80px] w-full flex justify-center">
                  <button
                    class="abstract_link web_tracker_item_action-button is-play is-button is-icon_only is-border_radius_round is-button_size_medium is-style_primary"
                    title="Start"
                    type="button"
                    value="start/1152739"
                  >
                    <svg
                      class="icon abstract_link-icon web_tracker_item_action-button is-play-icon icon-play"
                      width="15px"
                      height="18px"
                    >
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default page;
