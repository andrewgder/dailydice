import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import "../styles/InfoModal.css";

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

            <p>Each game consists of 6 rounds</p>
            <p>
              <>You roll 5 dice per round</>
            </p>
            <p>
              <>
                You can select dice to save and reroll up to 2 times per round
              </>
            </p>

            <h5>🎲 Scoring System</h5>

            <div className="scoring-rules">
              <p>
                <strong>Five of a Kind:</strong> 100 points
              </p>
              <p>
                <strong>Large Straight:</strong> 50 points (1-2-3-4-5 or
                2-3-4-5-6)
              </p>
              <p>
                <strong>Small Straight:</strong> 30 points (Any 4 consecutive
                numbers)
              </p>
              <p>
                <strong>Full House:</strong> 35 points (Three of a kind + a
                pair)
              </p>
              <p>
                <strong>Four of a Kind:</strong> Sum of dice + 10 bonus
              </p>
              <p>
                <strong>Three of a Kind:</strong> Sum of dice
              </p>
              <p>
                <strong>No Match:</strong> 0 points
              </p>
            </div>

            <p className="modal-footer">
              Roll the dice, strategize, and aim for the high score! 🚀🔥
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoModal;
