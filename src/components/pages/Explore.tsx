import React, { useState, useContext } from "react";
import { NextBrainContext } from "../../context/NextBrainContext.jsx";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";

interface CardProps {
  title: string;
  description: string;
  onUse: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, onUse }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-gray-600 text-lg mb-6">{description}</p>
      <button
        onClick={onUse}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 text-lg"
      >
        Use
      </button>
    </div>
  );
};

const Explore: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isLoading, setIsLoading } = useContext(NextBrainContext);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please upload a file.");
      return;
    }

    const baseUrl = "https://6452-103-215-237-64.ngrok-free.app"; // Base URL
    const endPoint = "/use_model"; // API endpoint

    setIsLoading(true);

    try {
      // Prepare FormData to send the CSV file
      const formData = new FormData();
      formData.append("file", selectedFile);
  
      // Make API call using Axios
      const response = await axios.post(`${baseUrl}${endPoint}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // Expecting a file-like blob response
      });
  
      // Convert the response to a downloadable URL
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
  
      // Create a temporary download link
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "processed_file.csv"); // Set file name
      document.body.appendChild(link);
      link.click(); // Trigger download
      link.remove(); // Clean up the link
      window.URL.revokeObjectURL(url); // Free memory
  
      console.log("File successfully downloaded.");
    } catch (error) {
      console.error("Error processing the file:", error);
      alert("An error occurred while processing the file.");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      setSelectedFile(null);
    }
  };

  const cards = [
    {
      id: 1,
      title: "Ethereum Fraud Detection",
      description:
        "Detects whether a given Ethereum transaction(s) is fradulent or not.",
      onUse: () => setIsModalOpen(true),
    },
    {
      id: 2,
      title: "$BASE Token Price Prediction",
      description:
        "Predicts the $BASE token price over a given amount of time period.",
      onUse: () => setIsModalOpen(true),
    },
  ];

  return (
    <div className="p-12 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-10">Explore</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {cards.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            description={card.description}
            onUse={card.onUse}
          />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <h2 className="text-2xl font-bold mb-4">Upload CSV File</h2>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedFile(null);
                }}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <RotatingLines
                    height={"30"}
                    width={"30"}
                    strokeColor="white"
                  />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
