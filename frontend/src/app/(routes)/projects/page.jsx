"use client";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";

function ProjectListPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const projects = useSelector((state) => state.project.projects);

  return (
    <div className="max-w-[1440px] w-full px-[50px] py-[32px]">
      <div className="w-full flex">
        <h1 className="w-full text-[21px] leading-[28px]">Projects</h1>
        <Link
          href={`/projects/create?step=general`}
          className="w-full bg-[#00C386] text-[#fff] text-center max-w-[104px] px-[10px] text-[13px] leading-[16px] py-[10px] rounded-[5px]"
        >
          New Project
        </Link>
      </div>

      <div className="w-full py-[32px]">
        <div className="max-w-[694px] w-full flex gap-[30px] text-[#404040] text-[15px] leading-[15px] font-[600]">
          <Link
            href={"/projects?tab=active"}
            className={`pb-[5px] ${
              tab === "active" && "border-b-[#004F98] border-b-[2px]"
            }`}
          >
            Active
          </Link>
          <Link
            href={"/projects?tab=archive"}
            className={`pb-[5px] ${
              tab === "archive" && "border-b-[#004F98] border-b-[2px]"
            }`}
          >
            Archive
          </Link>
        </div>
        {projects.length != 0 && tab == "active" && (
          <div className="block w-full">
            <ul class=" flex justify-between text-[14px] text-gray-400 mt-[40px] pb-[15px]  border-b border-[#e6e9ed]">
              <div className="flex items-center  gap-[50px]  ">
                <li className="flex items-center gap-[10px]">
                  <button
                    title="Ascending ordering by Name"
                    type="button"
                    value="project-name/asc"
                  >
                    Name
                  </button>
                  <button
                    title="Ascending ordering by Name"
                    type="button"
                    value="project-name/asc"
                  >
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
                  </button>
                </li>

                <li className="flex items-center gap-[10px]">
                  <button
                    title="Ascending ordering by Creation Date"
                    type="button"
                    value="creation-date/asc"
                  >
                    Creation Date
                  </button>
                  <button
                    title="Ascending ordering by Creation Date"
                    type="button"
                    value="creation-date/asc"
                  >
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
                  </button>
                </li>
              </div>

              <div className="flex items-center gap-[150px] ">
                <li className="flex items-center gap-[10px]">
                  <button
                    title="Ascending ordering by Team"
                    type="button"
                    value="team-size/asc"
                  >
                    Team
                  </button>
                  <button
                    title="Ascending ordering by Team"
                    type="button"
                    value="team-size/asc"
                  >
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
                  </button>
                </li>
                <li>
                  <span>Actions</span>
                  <div></div>
                </li>
              </div>
            </ul>
            {projects.map((item, id) => (
              <div
                key={id}
                className="max-w-[1354px] w-full p-[10px] border-b border-[#e6e9ed] "
              >
                <Link
                  href={`/projects/${item.id}`}
                  className="flex items-center gap-[30px]"
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
                    <h1 className="text-[17px] text-[#404040]">
                      {item.projectName}
                    </h1>

                    <p className="text-[11px] text-[#acb3bb]">created on</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
        {projects.length === 0 && tab == "active" && (
          <div className="w-full flex flex-col items-center justify-center h-[75vh]">
            <svg width="224px" height="181px" class="empty-illustration">
              <g transform="translate(1 1)" fill="none" fill-rule="evenodd">
                <path
                  d="M155 158H10.9c-5.5 0-9.9-4.9-9.9-10.4V119m183.7-88.8c0-5.5-4.5-10.2-10-10.2H127v-9.6C127 4.9 122.4 0 116.8 0H68.7c-5.5 0-9.8 4.9-9.8 10.4V20H10.8c-5.5 0-10 4.6-10 10.1"
                  stroke="#67727a"
                  stroke-width="2"
                ></path>
                <path
                  d="M138 109H10.9C5.4 109 1 104.5 1 99V30m183.7.4v40.4"
                  stroke="#67727a"
                  stroke-width="2"
                ></path>
                <circle
                  cx="184.9"
                  cy="119"
                  r="38.2"
                  fill="#37aa7c"
                  fill-rule="nonzero"
                ></circle>
                <path
                  d="M184.9 106.3v25.4m12.7-12.7h-25.4"
                  stroke="#fff"
                  stroke-width="2"
                ></path>
                <path
                  d="M97.8 124h-10c-2.8 0-5-2.2-5-5V99c0-2.8 2.2-5 5-5h10c2.8 0 5 2.2 5 5v20c0 2.8-2.2 5-5 5z"
                  fill="#fff"
                  fill-rule="nonzero"
                  stroke="#67727a"
                  stroke-width="2"
                ></path>
                <path
                  d="M54.9 178s1.2-.2 3.3-.4c2.1-.2 5-.5 8.6-.7 1.8-.1 3.7-.3 5.7-.3 2-.1 4.2-.2 6.4-.3 2.2-.1 4.5-.2 6.8-.2s4.7-.1 7.1-.1c2.4 0 4.7 0 7.1.1 2.3 0 4.6.1 6.8.2 2.2 0 4.4.2 6.4.3 2 .1 4 .2 5.7.3 3.6.2 6.5.5 8.6.8 2.1.2 3.3.4 3.3.4s-1.2.2-3.3.4c-2.1.2-5 .5-8.6.8-1.8.1-3.7.3-5.7.3-2 .1-4.2.2-6.4.3-2.2.1-4.5.2-6.8.2s-4.7 0-7.1.1c-2.4 0-4.7 0-7.1-.1-2.3 0-4.6-.1-6.8-.2-2.2 0-4.4-.2-6.4-.3-2-.1-4-.2-5.7-.3-3.6-.2-6.5-.5-8.6-.7-2.1-.4-3.3-.6-3.3-.6z"
                  fill="#e3eef7"
                  fill-rule="nonzero"
                ></path>
                <path d="M59 20h68" stroke="#67727a" stroke-width="2"></path>
              </g>
            </svg>

            <div className="max-w-[448px] w-full text-center">
              <h1 className="mt-[80px] text-[16px] leading-[24px] font-[700] text-[#575757]">
                Welcome to TechTracker!
              </h1>
              <p className="mt-[20px]">
                To get started, the desktop application and to start tracking
                your work. If you have any questions, don't hesitate.
              </p>
            </div>
          </div>
        )}
        {tab == "archive" && (
          <div className="w-full flex flex-col items-center justify-center h-[75vh]">
            <div className="w-full flex flex-col items-center justify-center h-[75vh]">
              <svg width="204.6px" height="181px" class="empty-illustration">
                <g transform="translate(.4 .1)" fill="none" fill-rule="evenodd">
                  <path
                    d="M154.6 46.5l10 14.1m-164 0l10-14.1"
                    stroke="#67727a"
                    stroke-width="2"
                  ></path>
                  <path
                    d="M154.6 60.6V25.9c0-2.8-2.2-5-5-5h-134c-2.8 0-5 2.2-5 5v34.7m134-39.7v-5c0-2.8-2.2-5-5-5h-114c-2.8 0-5 2.2-5 5v5"
                    stroke="#4d92de"
                    stroke-width="2"
                  ></path>
                  <path
                    d="M134.6 10.9v-5c0-2.8-2.2-5-5-5h-94c-2.8 0-5 2.2-5 5v5"
                    stroke="#4d92de"
                    stroke-width="2"
                  ></path>
                  <path
                    d="M57.6 123v-10c0-2.8 2.2-5 5-5h40c2.8 0 5 2.2 5 5v10c0 2.8-2.2 5-5 5h-40c-2.7 0-5-2.2-5-5z"
                    fill="#fff"
                    fill-rule="nonzero"
                    stroke="#67727a"
                    stroke-width="2"
                  ></path>
                  <circle
                    cx="164.6"
                    cy="122.7"
                    r="38.2"
                    fill="#4d92de"
                    fill-rule="nonzero"
                  ></circle>
                  <path
                    d="M44.7 179.1s1.2-.2 3.3-.4c2.1-.2 5-.5 8.6-.7 1.8-.1 3.7-.3 5.7-.3 2-.1 4.2-.2 6.4-.3 2.2-.1 4.5-.2 6.8-.2s4.7-.1 7.1-.1c2.4 0 4.7 0 7.1.1 2.3 0 4.6.1 6.8.2 2.2 0 4.4.2 6.4.3 2 .1 4 .2 5.7.3 3.6.2 6.5.5 8.6.8 2.1.2 3.3.4 3.3.4s-1.2.2-3.3.4c-2.1.2-5 .5-8.6.8-1.8.1-3.7.3-5.7.3-2 .1-4.2.2-6.4.3-2.2.1-4.5.2-6.8.2s-4.7 0-7.1.1c-2.4 0-4.7 0-7.1-.1-2.3 0-4.6-.1-6.8-.2-2.2 0-4.4-.2-6.4-.3-2-.1-4-.2-5.7-.3-3.6-.2-6.5-.5-8.6-.7-2.1-.4-3.3-.6-3.3-.6z"
                    fill="#e3eef7"
                    fill-rule="nonzero"
                  ></path>
                  <text font-size="36" font-family="Helvetica" fill="#fff">
                    <tspan x="153.627" y="135">
                      0
                    </tspan>
                  </text>
                  <path
                    d="M134.6 160.9h-124c-5.5 0-10-4.5-10-10V60.6h43.9c1.9 0 3.6 1.1 4.5 2.8l5.9 11.7c1.7 3.4 5.2 5.5 8.9 5.5h37.6c3.8 0 7.3-2.1 8.9-5.5l5.9-11.7c.8-1.7 2.6-2.8 4.5-2.8h43.9v15.2"
                    stroke="#67727a"
                    stroke-width="2"
                  ></path>
                </g>
              </svg>

              <div className="max-w-[408px] w-full text-center">
                <p className="mt-[20px]">
                  You don’t have any archived projects yet
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectListPage;
