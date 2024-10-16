"use client";
import { login } from "@/app/features/authSlice";
import { useDispatch, useSelector } from "react-redux";

import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../ThemeProvider";

function LandingPage() {
  const dispatch = useDispatch();
  const [storedStartQuery, setStoredStartQuery] = useState(null);
  const [storedEndQuery, setStoredEndQuery] = useState(null);
  const [storedrunningProjectId, setRunningProjectId] = useState(null);
  const [storedToken, setStoredToken] = useState(null);
  const { runningProjectId } = useSelector((state) => state.time);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const [currentRole, setCurrentRole] = useState("Freelancer");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleRoleSelect = (role) => {
    setCurrentRole(role);
    setIsDropdownOpen(false);
    localStorage.setItem("userId", role);
    toast.success(`${role} profile has been activated`);
  };

  const availableRoles = [
    { label: "Freelancer", bgColor: "bg-[#3096ff]" },
    { label: "Client", bgColor: "bg-[#00c386]" },
  ].filter((role) => role.label !== currentRole);

  const token = Cookies.get("accessToken");
  const path = usePathname();
  const today = Date.now();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const startQuery = localStorage.getItem("startQuery");
      const endQuery = localStorage.getItem("endQuery");
      const storedProject = localStorage.getItem("runningProjectId");
      const user = localStorage.getItem("user");
      dispatch(login({ user }));
      const token = Cookies.get("accessToken");
      const userId = localStorage.getItem("userId");

      setCurrentRole(userId);
      setStoredStartQuery(startQuery);
      setStoredEndQuery(endQuery);
      setRunningProjectId(storedProject);
      setStoredToken(token);
    }
  }, [
    storedrunningProjectId,
    runningProjectId,
    storedToken,
    currentRole,
    user,
  ]);
  if (!token && !storedToken) {
    return null;
  }
  if (["/login", "/signup", "/verifyemail"].includes(path)) {
    return null;
  }
  const maindata = [
    {
      id: 0,
      title: "Projects",
      userId: "Client",
      link: "/projects?tab=active&sortBy=name&sortOrder=asc",
      svg: (
        <svg width="25" height="23" viewBox="0 0 28 23" fill="none">
          <g clip-path="url(#clip0_201_84216)">
            <path
              d="M3.64843 22.7529H23.5351C25.9609 22.7529 27.1562 21.5811 27.1562 19.1787V7.77637C27.1562 5.37402 25.9609 4.20215 23.5351 4.20215H3.64843C1.23437 4.20215 0.0273438 5.37402 0.0273438 7.77637V19.1787C0.0273438 21.5811 1.23437 22.7529 3.64843 22.7529ZM3.67187 20.8779C2.52343 20.8779 1.91406 20.292 1.91406 19.085V7.87011C1.91406 6.6748 2.52343 6.07715 3.67187 6.07715H23.5117C24.6601 6.07715 25.2695 6.6748 25.2695 7.87011V19.085C25.2695 20.292 24.6601 20.8779 23.5117 20.8779H3.67187ZM7.64453 5.22168H9.46093V3.14746C9.46093 2.25683 9.98828 1.75293 10.9023 1.75293H16.2812C17.1953 1.75293 17.7109 2.25683 17.7109 3.14746V5.19824H19.5273V3.27637C19.5273 1.07324 18.3671 0.0419922 16.2461 0.0419922H10.9257C8.92187 0.0419922 7.64453 1.07324 7.64453 3.27637V5.22168Z"
              className="fill-[#4c92e3] group-hover:fill-[#fff] transition-all duration-300"
              fillOpacity="0.85"
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
      ),
    },
    {
      id: 1,
      title: "Reports",
      userId: "Client",

      link: `/reports?start=${storedStartQuery ? storedEndQuery : today}&end=${
        storedEndQuery ? storedEndQuery : today
      }&projects=all&chart=projects&table=work-summary&grouping=projects`,
      svg: (
        <svg
          width="25"
          height="22"
          viewBox="0 0 27 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.00634766 20.7505C0.00634766 21.2779 0.439942 21.688 0.943848 21.688H25.2016C25.7172 21.688 26.1508 21.2779 26.1508 20.7505C26.1508 20.2349 25.7172 19.813 25.2016 19.813H0.943848C0.439942 19.813 0.00634766 20.2349 0.00634766 20.7505Z"
            className="fill-[#4c92e3] group-hover:fill-[#fff] transition-all duration-300"
            fillOpacity="0.85"
          />
          <path
            d="M20.1509 16.8365C20.1509 17.4927 20.5611 17.8794 21.2408 17.8794H23.9478C24.6158 17.8794 25.0376 17.4927 25.0376 16.8365V9.09033C25.0376 8.43407 24.6158 8.03564 23.9478 8.03564H21.2408C20.5611 8.03564 20.1509 8.43407 20.1509 9.09033V16.8365Z"
            className="fill-[#4c92e3] group-hover:fill-[#fff] transition-all duration-300"
            fillOpacity="0.85"
          />
          <path
            d="M13.7993 16.8365C13.7993 17.4927 14.2211 17.8794 14.8891 17.8794H17.5961C18.2758 17.8794 18.6977 17.4927 18.6977 16.8365V3.75829C18.6977 3.10204 18.2758 2.71533 17.5961 2.71533H14.8891C14.2211 2.71533 13.7993 3.10204 13.7993 3.75829V16.8365Z"
            className="fill-[#4c92e3] group-hover:fill-[#fff] transition-all duration-300"
            fillOpacity="0.85"
          />
          <path
            d="M7.45947 16.8365C7.45947 17.4927 7.86963 17.8794 8.5376 17.8794H11.2564C11.9244 17.8794 12.3462 17.4927 12.3462 16.8365V1.08643C12.3462 0.430176 11.9244 0.043457 11.2564 0.043457H8.5376C7.86963 0.043457 7.45947 0.430176 7.45947 1.08643V16.8365Z"
            className="fill-[#4c92e3] group-hover:fill-[#fff] transition-all duration-300"
            fillOpacity="0.85"
          />
          <path
            d="M1.10791 16.8365C1.10791 17.4927 1.52979 17.8794 2.19776 17.8794H4.90479C5.58447 17.8794 6.00635 17.4927 6.00635 16.8365V6.46533C6.00635 5.82079 5.58447 5.42236 4.90479 5.42236H2.19776C1.52979 5.42236 1.10791 5.82079 1.10791 6.46533V16.8365Z"
            className="fill-[#4c92e3] group-hover:fill-[#fff] transition-all duration-300"
            fillOpacity="0.85"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "My Activites",
      link: `/my-activites?start=${
        storedStartQuery ? storedEndQuery : today
      }&end=${storedEndQuery ? storedEndQuery : today}&projects=all`,
      svg: (
        <svg
          width="25"
          height="26"
          viewBox="0 0 24 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_201_97178)">
            <path
              d="M0.938232 15.0405H6.12964C6.65698 15.0405 6.97339 14.8062 7.09057 14.3374L9.35229 3.93118H8.46167L11.9304 24.7671C12.0711 25.6109 13.3718 25.5991 13.5359 24.7671L16.8992 8.98196L16.1609 8.97024L17.2156 14.2437C17.3211 14.7827 17.6257 15.0405 18.1765 15.0405H22.7234C23.1922 15.0405 23.5672 14.6773 23.5672 14.2202C23.5672 13.7515 23.2039 13.3882 22.7234 13.3882H17.1922L18.8797 14.7593L17.2273 7.42337C17.0515 6.61477 15.8445 6.61477 15.6453 7.45852L12.2234 22.7515H13.0554L9.62182 1.92727C9.49292 1.10697 8.2976 1.08353 8.1101 1.92727L5.33276 14.7593L7.02026 13.3882H0.938232C0.457763 13.3882 0.0944824 13.7632 0.0944824 14.2202C0.0944824 14.6773 0.457763 15.0405 0.938232 15.0405Z"
              className="fill-[#4c92e3] group-hover:fill-[#fff] transition-all duration-300"
              fillOpacity="0.85"
            />
          </g>
          <defs>
            <clipPath id="clip0_201_97178">
              <rect
                width="23.4727"
                height="25.2451"
                fill="white"
                transform="translate(0.0944824 0.150391)"
              />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      id: 3,
      title: "Web Tracker",
      link: "/web-tracker?sort-by=recently-tracked&sort-order=asc",
      svg: (
        <>
          <svg
            width="25"
            height="24"
            viewBox="0 0 29 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_201_95641)">
              <path
                d="M14.3121 0.0476074C8.5465 0.0476074 3.64806 4.25464 2.58165 9.73902H0.917596C0.0738468 9.73902 -0.137091 10.3132 0.31994 10.9695L2.94494 14.696C3.33165 15.2351 3.89415 15.2234 4.26915 14.696L6.89415 10.9578C7.33947 10.3132 7.12853 9.73902 6.2965 9.73902H4.609C5.61681 5.30933 9.55431 2.05152 14.3121 2.05152C17.652 2.06323 20.5817 3.6687 22.3746 6.1648C22.7262 6.64527 23.2887 6.79761 23.7692 6.49292C24.2496 6.21167 24.3785 5.56714 23.9801 5.05152C21.7535 2.06323 18.2614 0.0476074 14.3121 0.0476074ZM14.3121 23.9538C20.0778 23.9538 24.9762 19.7351 26.0426 14.2624H27.695C28.5387 14.2624 28.7614 13.6882 28.2926 13.032L25.6793 9.30542C25.2926 8.76636 24.7301 8.77808 24.3551 9.30542L21.7301 13.0437C21.2731 13.6882 21.4957 14.2624 22.3278 14.2624H24.027C23.0075 18.6804 19.0582 21.9617 14.3121 21.9617C10.9723 21.9499 8.04259 20.3328 6.24962 17.8367C5.88634 17.3562 5.33556 17.2038 4.84337 17.4968C4.37462 17.7898 4.24572 18.4343 4.64415 18.9499C6.87072 21.9382 10.3629 23.9538 14.3121 23.9538Z"
                className="fill-[#4c92e3] group-hover:fill-[#fff] transition-all duration-300"
                fillOpacity="0.85"
              />
              <path
                d="M13.8668 5.13354C13.3512 5.13354 12.9293 5.5437 12.9293 6.05933V12.5984C12.9293 12.8679 13.0114 13.1023 13.2106 13.3601L16.1051 17.1804C16.4918 17.6843 17.0309 17.7664 17.5114 17.4382C17.945 17.1335 17.9801 16.5828 17.6285 16.1023L13.7262 10.8406L14.7926 14.1218V6.05933C14.7926 5.5437 14.3825 5.13354 13.8668 5.13354Z"
                className="fill-[#4c92e3] group-hover:fill-[#fff] transition-all duration-300"
                fillOpacity="0.85"
              />
            </g>
            <defs>
              <clipPath id="clip0_201_95641">
                <rect
                  width="28.4498"
                  height="23.918"
                  fill="white"
                  transform="translate(0.0839844 0.0476074)"
                />
              </clipPath>
            </defs>
          </svg>
          {(storedrunningProjectId || runningProjectId) && (
            <div className="max-w-[10px] min-h-[10px] w-full bg-[#35bf8a] rounded-[50%] absolute ml-[20px] mt-[-5px] animate-plus		"></div>
          )}
        </>
      ),
    },
    {
      id: 4,
      title: "Invoices",
      link: "/invoices",
      userId: "Client",
      svg: (
        <svg
          width="25"
          height="30"
          viewBox="0 0 31 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.75952 25.5068H19.7673C22.2165 25.5068 23.4353 24.2881 23.4353 21.874V7.56543C23.4353 5.15137 22.2165 3.93262 19.7673 3.93262H3.75952C1.3103 3.93262 0.079834 5.13965 0.079834 7.56543V21.874C0.079834 24.2998 1.3103 25.5068 3.75952 25.5068ZM3.58374 23.6201C2.54077 23.6201 1.96655 23.0694 1.96655 21.9795V10.9287C1.96655 9.85059 2.54077 9.28809 3.58374 9.28809H19.9196C20.9626 9.28809 21.5486 9.85059 21.5486 10.9287V21.9795C21.5486 23.0694 20.9626 23.6201 19.9196 23.6201H3.58374Z"
            className="fill-[#4c92e3] group-hover:fill-[#fff] transition-all duration-300"
            fillOpacity="0.85"
          />
          <path
            d="M5.6228 20.7021H13.4392C13.8493 20.7021 14.1657 20.3974 14.1657 19.9989C14.1657 19.5888 13.8493 19.2607 13.4392 19.2607H5.6228C5.18921 19.2607 4.88452 19.5888 4.88452 19.9989C4.88452 20.3974 5.18921 20.7021 5.6228 20.7021Z"
            className="fill-[#4c92e3] group-hover:fill-[#fff] transition-all duration-300"
            fillOpacity="0.85"
          />
          <path
            d="M5.6228 17.1748H17.9275C18.3376 17.1748 18.654 16.8701 18.654 16.4717C18.654 16.0498 18.3376 15.7334 17.9275 15.7334H5.6228C5.18921 15.7334 4.88452 16.0498 4.88452 16.4717C4.88452 16.8701 5.18921 17.1748 5.6228 17.1748Z"
            className="fill-[#4c92e3] group-hover:fill-[#fff] transition-all duration-300"
            fillOpacity="0.85"
          />
          <path
            d="M5.6228 13.6475H17.9275C18.3376 13.6475 18.654 13.3194 18.654 12.9092C18.654 12.5108 18.3376 12.2061 17.9275 12.2061H5.6228C5.18921 12.2061 4.88452 12.5108 4.88452 12.9092C4.88452 13.3194 5.18921 13.6475 5.6228 13.6475Z"
            className="fill-[#4c92e3] group-hover:fill-[#fff] transition-all duration-300"
            fillOpacity="0.85"
          />
          <path
            d="M22.5095 29.3153C26.6228 29.3153 30.0564 25.8817 30.0564 21.7567C30.0564 17.6083 26.6579 14.1982 22.5095 14.1982C18.361 14.1982 14.9509 17.62 14.9509 21.7567C14.9509 25.9169 18.3493 29.3153 22.5095 29.3153Z"
            className="fill-[#4c92e3] group-hover:fill-[#fff] transition-all duration-300"
          />
          <path
            d="M22.5096 27.71C25.7322 27.71 28.4627 25.0147 28.4627 21.7568C28.4627 18.4873 25.7674 15.8037 22.5096 15.8037C19.2401 15.8037 16.5565 18.499 16.5565 21.7568C16.5565 25.0381 19.2401 27.71 22.5096 27.71Z"
            fill="green"
            fillOpacity="0.85"
          />
          <path
            d="M22.5096 25.4834C22.076 25.4834 21.7947 25.2022 21.7947 24.7686V22.4717H19.4979C19.076 22.4717 18.783 22.1904 18.783 21.7568C18.783 21.3233 19.076 21.042 19.4979 21.042H21.7947V18.7451C21.7947 18.3233 22.076 18.0303 22.5096 18.0303C22.9432 18.0303 23.2244 18.3233 23.2244 18.7451V21.042H25.5096C25.9432 21.042 26.2361 21.3233 26.2361 21.7568C26.2361 22.1904 25.9432 22.4717 25.5096 22.4717H23.2244V24.7686C23.2244 25.2022 22.9432 25.4834 22.5096 25.4834Z"
            className="fill-[#4c92e3] group-hover:fill-[#fff] transition-all duration-300"
          />
        </svg>
      ),
    },
  ];
  const handleLogout = () => {
    localStorage?.removeItem("userData");
    localStorage?.removeItem("userId");
    localStorage?.removeItem("user");
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    router.push("/login");
  };

  const filteredData =
    currentRole === "Client"
      ? maindata.filter((item) => item.userId === "Client")
      : maindata;
  const firstLetter = user ? user.charAt(0).toUpperCase() : "";
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <div className="pl-[230px]"></div>
      <div
        className={`  fixed flex max-w-[230px] w-full bg-[] pt-[22px] h-screen flex-col justify-around  `}
        style={{
          background: theme === "light" ? "#3863a3" : "#333",
          color: theme === "light" ? "#000" : "#fff",
        }}
      > 
      <div className="max-w-[180px] w-full flex flex-col items-center justify-center mx-auto">
        <Link
          href={"/"}
          className="max-w-[180px] w-full flex items-center gap-[5px] mx-auto mb-[32px]"
        >
          <div className="max-w-[30px] w-full">
            <img src="/stop-watch/stop-watch-logo.png" alt="stop-watch" />
          </div>
          <h1 className="text-[#fff] font-proximaNova text-[15px] leading-[18px] uppercase">
            TechTracker
          </h1>
        </Link>
        <button
          onClick={toggleTheme}
          className={`max-w-[40px] w-full h-[40px] flex  justify-end ${
            theme === "dark" ? "bg-[#2f5489]" : "bg-[#fff]"
          } rounded-[20px] p-2 `}
        >
          {theme === "light" && (
            <svg fill="none">
              <g id="SVGRepo_iconCarrier">
                <path
                  fill="#2f5489"
                  d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"
                ></path>
              </g>{" "}
            </svg>
          )}
          {theme === "dark" && (
            <svg fill="none">
              <g id="SVGRepo_iconCarrier">
                <path
                  fill="#fff"
                  d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"
                ></path>{" "}
              </g>{" "}
            </svg>
          )}
        </button>
      </div>
        
        <div className="flex flex-col gap-[10px] mt-[50px]">
          {filteredData.map((item) => {
            const currentPath = path.split("t")[0];
            const linkPath = item.link.split("t")[0];

            const isActive = currentPath === linkPath;

            const linkClass = ` flex items-center text-white group gap-[10px] py-[15px] pl-[32px] pr-[20px] w-full transition-colors border-l-[5px] ${
              isActive
                ? "bg-[#30558d] border-l-[5px] border-l-[#35bf8a]"
                : "border-l-transparent"
            }`;

            return (
              <>
                <Link key={item.id} href={item.link} className={linkClass}>
                  <div>{item.svg}</div>
                  <h1 className="text-white text-[13px] leading-[15px] capitalize">
                    {item.title}
                  </h1>
                </Link>
              </>
            );
          })}
        </div>

        <div className="flex justify-center flex-col mt-auto ">
          <div
            className={`max-w-[182px] w-full mx-auto text-[#fff] p-[16px] leading-[1.32] bg-[#2f5489]  ${
              isDropdownOpen
                ? "max-h-0 opacity-0 scale-0 transition-all duration-300 ease-linear"
                : "transition-all duration-300 ease-linear  scale-[100%] "
            }`}
          >
            <h3 className="text-[14px]">Connect HireGlobal Payments</h3>
            <p className="text-[12px] my-[16px]">
              HireGlobal by Toptal is a secure payroll, compliance, and HRIS
              offering that is built upon Toptal’s robust payroll and payments
              infrastructure – which has been refined over a decade.
            </p>
          </div>

          <div
            className={` px-[22px]  transition-all overflow-hidden ${
              isDropdownOpen
                ? "bg-[#30558d] border-l-[5px] border-l-[#35bf8a] transition-[border-left-width,border-left-color] duration-200 "
                : "border-l-[0px] border-l-transparent transition-[border-left-width,border-left-color,background-left-height] ease-linear duration-200"
            }`}
          >
            {/* User Info */}
            <div className="mb-4 mt-[16px]">
              {/* Dropdown Content */}
              <div
                className="flex items-center pb-2 space-x-3 cursor-pointer"
                onClick={toggleDropdown}
              >
                <div className="w-[38px] h-10 bg-gray-200 rounded-full items-center flex justify-center font-[900] text-[22px] text-[#5782af]">
                  {firstLetter}
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-[13px]">{user}</span>
                  <span
                    className={`text-[#fff] px-[18px] py-[.106rem] rounded-[.312rem]   w-full text-[11px] flex items-center justify-center ${
                      currentRole === "Freelancer"
                        ? "bg-[#3096ff] max-w-[61px]"
                        : "bg-[#00c386]  max-w-[46px]"
                    }`}
                  >
                    {currentRole}
                  </span>
                </div>
                <div
                  className={`text-white ml-auto transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▾
                </div>
              </div>

              <div
                className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-linear ${
                  isDropdownOpen
                    ? "max-h-[300px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {/* Dropdown Options */}
                {availableRoles.map((role) => {
                  return (
                    <div
                      key={role.label}
                      className="py-2 border-y-gray-400 border-y-[1px] cursor-pointer opacity-[0.30]"
                      onClick={() => handleRoleSelect(role.label)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full items-center flex justify-center font-[900] text-[22px] text-[#5782af]">
                          {firstLetter}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white text-[13px]">{user}</span>
                          <span
                            className={`text-[#fff] py-[.106rem] rounded-[.312rem] px-[.31rem]  w-full ${
                              role.bgColor
                            } ${
                              currentRole === "Freelancer"
                                ? "max-w-[31px] px-[20px] "
                                : "max-w-[61px] "
                            } text-[11px]  flex items-center justify-center`}
                          >
                            {role.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Navigation Links */}
                <ul className="space-y-4 text-white text-[13px] mt-[26px]">
                  <li className="hover:text-blue-300 cursor-pointer">
                    Account Settings
                  </li>
                  <li className="hover:text-blue-300 cursor-pointer">FAQ</li>
                  <li
                    className="hover:text-blue-300 cursor-pointer"
                    onClick={() => handleLogout()}
                  >
                    Sign Out
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* Download Button */}
          {currentRole === "Freelancer" && (
            <button className="text-[#fff] text-[13px] mt-[10px] mb-3 rounded-[4px] border-[#00c386] bg-[#00c386] hover:scale-105 font-proximaNova hover:opacity-90 transition-all duration-100 ease-linear max-w-[182px] py-[10px] w-full mx-auto">
              Download Free App
            </button>
          )}
        </div>

        <ToastContainer
          position="top-center"
          autoClose={500}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </>
  );
}

export default LandingPage;
