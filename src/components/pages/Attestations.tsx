import React, { useState, useContext, useEffect } from "react";

import { NextBrainContext } from "../../context/NextBrainContext.jsx";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom"; // Import navigate function
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

import { ethers } from "ethers";
import * as base32 from "hi-base32"; // For base32 encoding
import { read, utils } from "xlsx"; // To read CSV content
import SHA256 from "crypto-js/sha256";
import EncHex from "crypto-js/enc-hex";

import axios from "axios";

const EAS_SUBGRAPH_URL = "https://base-sepolia.easscan.org/graphql";

const Attestations: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isLoading, setIsLoading } = useContext(NextBrainContext);
  const navigate = useNavigate();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [owner, setOwner] = useState("");
  const [category, setCategory] = useState("Identity");
  const [fileBase32, setFileBase32] = useState<string | null>(null);
  const [allAttestations, setAllAttestations] = useState([]);

  // Mock data for New Contributions
  const newContributions = [
    {
      id: 1,
      title: "Ethereum Fraud Detection",
      address: "0x482149a56D6BEd44e8452B7958519246eecaCd8E",
      description: "Detects whether a given Ethereum transaction(s) is fradulent or not.",
      category: "Fraud Detection",
    }
  ];

  const fetchAttestationsByRecipient = async (
    recipient = "0x482149a56D6BEd44e8452B7958519246eecaCd8E"
  ) => {
    const query = `
      query GetAttestationsByRecipient($recipient: String!) {
        attestations(where: { recipient: { equals: $recipient } }) {
          id
          attester
          recipient
          schemaId
          data
          timeCreated
          revoked
        }
      }
    `;

    const variables = { recipient };

    try {
      const response = await axios.post(
        EAS_SUBGRAPH_URL,
        { query, variables },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(response.data.data.attestations);
      return response.data.data.attestations || [];
    } catch (error) {
      console.error("Error fetching attestations:", error);
      return [];
    }
  };

  useEffect(() => {
    const run = async () => {
      const attestations = await fetchAttestationsByRecipient();
      setAllAttestations(attestations);
    }
    run();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
    const day = String(date.getDate()).padStart(2, "0"); // Ensure two-digit day
    const month = date.toLocaleString("default", { month: "short" }); // Get short month name
    const year = date.getFullYear(); // Get the year
  
    return `${day} ${month} ${year}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileConversion = async () => {
    if (selectedFile) {
      try {
        const reader = new FileReader();

        return new Promise<string>((resolve, reject) => {
          reader.onload = (e) => {
            try {
              const fileContent = e.target?.result as string;

              const workbook = read(fileContent, { type: "string" });
              const csvData = utils.sheet_to_csv(
                workbook.Sheets[workbook.SheetNames[0]]
              );

              // Hash CSV content using SHA-256
              const hash = SHA256(csvData).toString(EncHex);

              // Encode and trim to 32 bytes
              const encoded = base32.encode(hash);
              const trimmedEncoded = encoded.slice(0, 31);

              console.log("Trimmed Encoded: ", trimmedEncoded.length);
              resolve(trimmedEncoded);
            } catch (error) {
              console.error("Error processing file:", error);
              reject(error);
            }
          };

          reader.onerror = (err) => {
            reject(err);
          };

          reader.readAsBinaryString(selectedFile);
        });
      } catch (error) {
        console.error("File conversion error:", error);
        throw error;
      }
    } else {
      throw new Error("No file selected");
    }
  };

  const handleAttestationSubmit = async () => {
    if (!owner || !selectedFile || !category) {
      alert("All fields are required!");
      return;
    }
    setIsLoading(true);

    try {
      // 1. Get bytes32 string synchronously
      const convertedFile = await handleFileConversion();

      // 2. Prepare EAS payload
      const easPayload = [
        {
          name: "owner",
          value: owner, // wallet address
          type: "address",
        },
        {
          name: "hash",
          value: convertedFile, // Use directly from handleFileConversion
          type: "bytes32",
        },
        { name: "category", value: category, type: "string" },
      ];

      console.log("EAS Payload:", easPayload);

      // 3. Upload to EAS
      await uploadToEas(easPayload);

      // 4. Generate a JSON file

      setTimeout(() => {
        setIsLoading(false);
        setIsFormOpen(false);
        setSelectedFile(null);
        setOwner("");
        setCategory("Identity");
        console.log("Form Submitted:", { owner, category, convertedFile });
      }, 2000);
    } catch (error) {
      console.error("Error during attestation submit:", error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("All fields are required!");
      return;
    }
    const baseUrl = "https://6452-103-215-237-64.ngrok-free.app"; // Replace with your actual base URL
    setIsLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
  
      const response = await axios.post(`${baseUrl}/train-submit-model`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      const { status, accuracy_value } = response.data;
      const accuracyPercentage = (accuracy_value * 100).toFixed(2);
  
      console.log("Response:", response.data);
  
      // Navigate to Progress page with response details
      navigate("/progress", { state: { status, accuracy: accuracyPercentage } });
    } catch (error) {
      console.error("Error submitting file:", error);
      alert("An error occurred while submitting the file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const uploadToEas = async (attestationData) => {
    // Initialize provider and wallet for Base Sepolia
    const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
    const wallet = new ethers.Wallet(
      "79d99e77724cdbc0e41c46f5a4e62ece4cd0d97e0b184370fa7dfc347920019e",
      provider
    );

    // Connect to EAS contract on Base Sepolia
    const eas = new EAS("0x4200000000000000000000000000000000000021");
    eas.connect(wallet);

    console.log("EAS SDK Initialized on Base Sepolia");

    // Replace this with your schema UID (from EAS platform)
    const SCHEMA_UID =
      "0x82569fc8f1d4b2e103ecfb59953fb0f725bc17fbbe2174538c3bdcdc0d44a411";

    // Encode data based on schema format
    const schemaEncoder = new SchemaEncoder(
      "address owner,bytes32 hash,string category"
    );

    const encodedData = schemaEncoder.encodeData(attestationData);

    // Create attestation
    const tx = await eas.attest({
      schema: SCHEMA_UID,
      data: {
        recipient: owner,
        expirationTime: 0, // No expiration
        revocable: true,
        data: encodedData,
      },
    });

    console.log("Transaction sent. Hash:", tx);

    const attestationUID = await tx.wait();
    console.log("Attestation UID:", attestationUID);
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
            <th className="py-4 px-6">Attestation UID</th>
            <th className="py-4 px-6">Schema ID</th>
            <th className="py-4 px-6">Created On</th>
            <th className="py-4 px-6">Revoked</th>
          </tr>
        </thead>
        <tbody>
          {allAttestations && allAttestations.map((attestation, index) => (
            <tr key={attestation?.id} className="border-b hover:bg-gray-100">
              <td className="py-4 px-6">{index + 1}</td>
              <td className="py-4 px-6">{attestation.id.slice(0, 5)}...{attestation.id.slice(-4)}</td>
              <td className="py-4 px-6">{attestation.schemaId.slice(0, 5)}...{attestation.schemaId.slice(-4)}</td>
              <td className="py-4 px-6">{formatDate(attestation.timeCreated)}</td>
              <td className="py-4 px-6">{attestation.revoked ? "True" : "False"}</td>
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
                  onClick={handleAttestationSubmit}
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
