import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, startOfWeek, startOfMonth, format } from "date-fns";

const DropdownDatePicker = ({
  initialStartDate = new Date(),
  initialEndDate = new Date(),
  onDateChange,
  extraClasses,
}) => {
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const today = new Date();
  const storedStartQuery = localStorage?.getItem("startQuery");
  const [day, month, year] = storedStartQuery.split("/").map(Number);
  const parsedDate = new Date(year, month - 1, day);
  const handleCustomRange = (rangeType) => {
    switch (rangeType) {
      case "currentWeek":
        setStartDate(startOfWeek(today));
        setEndDate(today);
        break;
      case "last7Days":
        setStartDate(addDays(today, -7));
        setEndDate(today);
        break;
      case "currentMonth":
        setStartDate(startOfMonth(today));
        setEndDate(today);
        break;
      default:
        break;
    }
    setIsDateDropdownOpen(false);
    if (onDateChange) onDateChange(startDate, endDate);
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    if (onDateChange) onDateChange(date, endDate);
  };

  return (
    <div className="inline-block text-left">
      <button
        type="button"
        onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
        className="inline-flex justify-between items-center gap-[5px] w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
      >
        <span>{`${format(parsedDate, "d MMMM")} — ${format(
          endDate,
          "d MMMM"
        )}`}</span>
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
        <div
          className={`absolute ${extraClasses}  mt-2 max-w-[377px] w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10`}
        >
          <div className="py-1 flex w-full">
            <div className="max-w-[130px] w-full">
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
            </div>
            <DatePicker
              selectsStart
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              maxDate={today}
              inline
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownDatePicker;
