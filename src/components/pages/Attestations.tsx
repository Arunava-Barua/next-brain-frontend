import React, { useState, useContext } from "react";

import { NextBrainContext } from "../../context/NextBrainContext.jsx";
import { RotatingLines } from "react-loader-spinner"
import { useNavigate } from "react-router-dom"; // Import navigate function

const Attestations: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {isLoading, setIsLoading} = useContext(NextBrainContext);
  const navigate = useNavigate();

  // Mock data for My Attestations
  const myAttestations = [
    {
      id: 1,
      hash: "0x9aCEcAF7e11BCbb9c114724FF8F51930e24f164b",
      category: "Identity",
      signature: "0xabc123",
    },
    {
      id: 2,
      hash: "0x9aCEcAF7e11BCbb9c114724FF8F51930e24f164b",
      category: "Skill",
      signature: "0xdef456",
    },
  ];

  // Mock data for New Contributions
  const newContributions = [
    {
      id: 1,
      title: "Skill Verification",
      address: "0x9aCEcAF7e11BCbb9c114724FF8F51930e24f164b",
      description: "Verify skills for Web3 development.",
      category: "Skill",
    },
    {
      id: 2,
      title: "KYC Verification",
      address: "0x9aCEcAF7e11BCbb9c114724FF8F51930e243456",
      description: "Contribute to identity attestations.",
      category: "Identity",
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      setIsLoading(true);
      console.log("Submitting file:", selectedFile.name);

      // Simulate file submission
      setTimeout(() => {
        setIsLoading(false);
        setSelectedFile(null);
        setIsModalOpen(false);
        navigate("/progress"); // Navigate to the Progress page
      }, 2000);
    } else {
      alert("Please upload a file.");
    }
  };

  return (
    <div className="p-12 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-10">Attestations</h1>

      {/* My Attestations Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">My Attestations</h2>
        <table className="w-full border border-gray-300 text-left text-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-4 px-6">SL No.</th>
              <th className="py-4 px-6">Hash</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Signature</th>
            </tr>
          </thead>
          <tbody>
            {myAttestations.map((attestation, index) => (
              <tr key={attestation.id} className="border-b hover:bg-gray-100">
                <td className="py-4 px-6">{index + 1}</td>
                <td className="py-4 px-6">{attestation.hash}</td>
                <td className="py-4 px-6">{attestation.category}</td>
                <td className="py-4 px-6">{attestation.signature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Contributions Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">New Contributions</h2>
        <table className="w-full border border-gray-300 text-left text-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-4 px-6">Title</th>
              <th className="py-4 px-6">Description</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Owner</th>
              <th className="py-4 px-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {newContributions.map((contribution) => (
              <tr key={contribution.id} className="border-b hover:bg-gray-100">
                <td className="py-4 px-6">{contribution.title}</td>
                <td className="py-4 px-6">{contribution.description}</td>
                <td className="py-4 px-6">{contribution.category}</td>
                <td className="py-4 px-6">{`${contribution.address.slice(
                  0,
                  5
                )}...${contribution.address.slice(-4)}`}</td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                  >
                    Contribute
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isLoading ? (
                  <RotatingLines height={"30"} width={"30"} strokeColor="white" />
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

export default Attestations;
