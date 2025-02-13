import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import "../styles/InfoModal.css"; // Ensure the styles are applied

const InfoModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="info-modal-container">
      {/* Info Icon to Open Modal */}
      <FaInfoCircle className="info-icon" onClick={() => setIsOpen(true)} />

      {/* Fullscreen Modal */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Game Rules</h2>
            <ul>
              <li>Each game consists of 6 rounds.</li>
              <li>You roll 5 dice per round.</li>
              <li>You can reroll up to 2 times per round.</li>
              <li>Score is based on the total sum or special combinations:</li>
              <ul>
                <li>3 of a Kind: Sum of all dice.</li>
                <li>4 of a Kind: Sum of all dice.</li>
                <li>Full House: 25 points.</li>
                <li>Small Straight: 30 points.</li>
                <li>Large Straight: 40 points.</li>
                <li>Yahtzee (5 of a Kind): 50 points.</li>
                <li>Chance: Sum of all dice.</li>
              </ul>
              <li>Maximize points using strategic rerolls!</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoModal;
