import React, { createContext, useState } from "react";

// Create the context
export const NextBrainContext = createContext();

// Provider component
export const NextBrainProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <NextBrainContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </NextBrainContext.Provider>
  );
};
