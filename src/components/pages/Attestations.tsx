import React, { useState, useContext } from "react";

import { NextBrainContext } from "../../context/NextBrainContext.jsx";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom"; // Import navigate function

import * as base32 from "hi-base32"; // For base32 encoding
import { read, utils } from "xlsx"; // To read CSV content

const Attestations: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isLoading, setIsLoading } = useContext(NextBrainContext);
  const navigate = useNavigate();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [owner, setOwner] = useState("");
  const [category, setCategory] = useState("Identity");
  const [fileBase32, setFileBase32] = useState<string | null>(null);

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

  const handleFileConversion = async () => {
    if (selectedFile) {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const fileContent = e.target?.result as string;
          const workbook = read(fileContent, { type: "string" });
          const csvData = utils.sheet_to_csv(
            workbook.Sheets[workbook.SheetNames[0]]
          );
          const encoded = base32.encode(csvData);
          console.log(encoded);
          if (encoded.length > 32) {
            alert(
              "Base32 encoded file exceeds 32 bytes. Please reduce file size."
            );
          } else {
            setFileBase32(encoded);
            console.log("Base32 Encoded File:", encoded);
          }
        };
        reader.readAsBinaryString(selectedFile);
      } catch (error) {
        console.error("File conversion error:", error);
      }
    }
  };

  const handleSubmit = () => {
    if (!owner || !selectedFile || !category) {
      alert("All fields are required!");
      return;
    }
    setIsLoading(true);

    handleFileConversion();
    setTimeout(() => {
      setIsLoading(false);
      setIsFormOpen(false);
      setSelectedFile(null);
      setOwner("");
      setCategory("Identity");
      console.log("Form Submitted:", { owner, category, fileBase32 });
    }, 2000);
  };

  return (
    <div className="p-12 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">My Attestations</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Generate new attestation
        </button>
      </div>

      {/* My Attestations Section */}
      <table className="w-full border border-gray-300 text-left text-lg mb-12">
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

      {/* Generate New Attestation Form */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <h2 className="text-2xl font-bold mb-6">
              Generate New Attestation
            </h2>
            <div className="space-y-4">
              {/* Owner Input */}
              <div>
                <label className="block text-gray-700 mb-1">Owner</label>
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter owner address"
                />
              </div>

              {/* Upload CSV */}
              <div>
                <label className="block text-gray-700 mb-1">
                  Upload CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Identity">Identity</option>
                  <option value="Skill">Skill</option>
                  <option value="Achievement">Achievement</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
        </div>
      )}

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

export default Attestations;
