import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Progress: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract passed data from API response
  const { status: apiStatus, accuracy } = location.state || {
    status: null, // Status as boolean
    accuracy: null,
  };

  const [progress, setProgress] = useState(66); // Start at 66% "Analysing"
  const [status, setStatus] = useState("Analysing");
  const [barColor, setBarColor] = useState("bg-yellow-500");

  useEffect(() => {
    if (apiStatus !== null) {
      setTimeout(() => {
        if (apiStatus) {
          // Status is true -> Accepted
          setProgress(100);
          setStatus("Accepted");
          setBarColor("bg-green-500");
        } else {
          // Status is false -> Rejected
          setProgress(100);
          setStatus("Rejected");
          setBarColor("bg-red-500");
        }
      }, 3000); // Transition after 3 seconds
    }
  }, [apiStatus]);

  useEffect(() => {
    // Automatically navigate after a delay when progress reaches 100%
    if (progress === 100) {
      setTimeout(() => navigate("/attestations"), 3000);
    }
  }, [progress, navigate]);

  return (
    <div className="p-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Training Progress</h1>

      {/* Accuracy Header */}
      {accuracy && (
        <p className="text-xl font-semibold text-center mb-4">
          Accuracy Achieved: {accuracy}%
        </p>
      )}

      {/* Progress Bar */}
      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute h-full ${barColor} flex items-center justify-center text-white font-bold`}
          style={{ width: `${progress}%` }}
        >
          {/* Show Accuracy only at 100% */}
          {progress === 100 && accuracy && (
            <span>Accuracy: {accuracy}%</span>
          )}
        </div>
      </div>

      {/* Status */}
      <p className="mt-4 text-xl font-semibold text-center">{status}</p>
    </div>
  );
};

export default Progress;
