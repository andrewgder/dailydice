import { useState, useEffect } from "react";
import "../styles/Dice.css";

export default function Dice({ value, isRolling, isSelected, onClick }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let rollInterval;
    if (isRolling) {
      rollInterval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 100);
    } else {
      setDisplayValue(value);
    }

    return () => clearInterval(rollInterval);
  }, [isRolling, value]);

  return (
    <button
      className={`dice ${isRolling ? "rolling" : ""} ${
        isSelected ? "selected" : ""
      }`}
      onClick={onClick}
    >
      {displayValue}
    </button>
  );
}
