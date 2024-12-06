import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Progress: React.FC = () => {
  const [progress, setProgress] = useState(33); // Start at "Submitted" (33%)
  const [status, setStatus] = useState<"Submitted" | "Analysing" | "Accepted" | "Rejected">("Submitted");
  const [barColor, setBarColor] = useState("bg-blue-500"); // Default color for progress

  const navigate = useNavigate();

  useEffect(() => {
    // Simulate progression
    const timer = setTimeout(() => {
      if (status === "Submitted") {
        setProgress(66);
        setStatus("Analysing");
      } else if (status === "Analysing") {
        setProgress(100);
        const isAccepted = Math.random() > 0.5; // Random accept/reject
        setStatus(isAccepted ? "Accepted" : "Rejected");
        setBarColor(isAccepted ? "bg-green-500" : "bg-red-500");
      }
    }, 3000); // Change every 3 seconds

    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    // Navigate back after progress completion
    if (progress === 100) {
      setTimeout(() => navigate("/attestations"), 3000); // Redirect to "Attestations" after 3 seconds
    }
  }, [progress, navigate]);

  return (
    <div className="p-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Progress</h1>
      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute h-full ${barColor}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-4 text-xl font-semibold text-center">{status}</p>
    </div>
  );
};

export default Progress;
