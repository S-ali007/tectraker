import { useState } from "react";
import { useSelector } from "react-redux";

const SelectButton = ({
  onButtonClick,
  isActive = false,
  buttonText = "Select Project",
  selectedCount = 0,
  icon = null,
}) => {
  const [activeAction, setActiveAction] = useState(isActive);

  const handleActions = () => {
    setActiveAction(true);
    if (onButtonClick) onButtonClick(); // Callback function for external handling
  };

  return (
    <button
      onClick={handleActions}
      className={`max-w-[193px] flex w-full px-[16px] py-[11px] ${
        selectedCount ? "opacity-100" : "opacity-[0.6]"
      } hover:bg-[#e7f4ff] bg-[#f0f1f4] rounded-[6px] border-[#f0f1f4] border justify-around items-center`}
    >
      {/* Customizable Icon */}
      {icon && <div>{icon}</div>}
      
      {/* Dynamic Text */}
      <div
        className={`text-[14px] text-[#000] 
          opacity-100`}
      >
        {selectedCount ? `${selectedCount} Projects Selected` : buttonText}
      </div>

      {/* Arrow Icon */}
      <svg
        fill="#000000"
        height="10px"
        width="10px"
        version="1.1"
        viewBox="0 0 330 330"
      >
        <g strokeLinecap="round" strokeLinejoin="round"></g>
        <g>
          <path
            d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
             c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150
             c2.813,2.813,6.628,4.393,10.606,4.393s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
          />
        </g>
      </svg>
    </button>
  );
};

export default SelectButton;
