import React, { useState, useContext } from "react";
import { NextBrainContext } from "../../context/NextBrainContext.jsx";
import { RotatingLines } from "react-loader-spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Create = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    neuralSchema: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const { isLoading, setIsLoading } = useContext(NextBrainContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);
    console.log("Form Data Submitted:", formData);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log("Model created successfully!");
      setShowAlert(true);

      // Trigger alert after 5 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }, 2000);
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Create New Model</h1>

      {/* Success Alert */}
      {showAlert && (
        <div
          className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center space-x-3 w-80"
          style={{ zIndex: 1000 }}
        >
          <div className="flex flex-col">
            <AlertTitle className="text-lg font-bold">Success🎉</AlertTitle>
            <AlertDescription className="text-sm">
              Your model has successfully been created!⭐
            </AlertDescription>
          </div>
          <button
            onClick={() => setShowAlert(false)}
            className="text-white hover:text-gray-300 text-xl"
          >
            &times;
          </button>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white shadow-lg rounded-lg p-10"
      >
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-xl font-medium mb-3">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the name"
          />
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-xl font-medium mb-3">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the description"
          />
        </div>

        {/* Category Field */}
        <div>
          <label htmlFor="category" className="block text-xl font-medium mb-3">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="Fraud Detection">Fraud Detection</option>
            <option value="Price Prediction">Price Prediction</option>
            <option value="Fine Tuning">Fine Tuning</option>
          </select>
        </div>

        {/* Neural Schema Field */}
        <div>
          <label
            htmlFor="neuralSchema"
            className="block text-xl font-medium mb-3"
          >
            Neural Schema (Optional)
          </label>
          <input
            type="text"
            id="neuralSchema"
            name="neuralSchema"
            value={formData.neuralSchema}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the neural schema"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
          >
            {isLoading ? (
              <RotatingLines height={"30"} width={"30"} strokeColor="white" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default Create;
