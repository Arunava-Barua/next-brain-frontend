import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Attestations from "./components/pages/Attestations";
import Create from "./components/pages/Create";
import Explore from "./components/pages/Explore";
import Progress from "./components/pages/Progress";

const App: React.FC = () => {
  const handleConnectWallet = () => {
    console.log("Connect Wallet clicked");
    // Add wallet connection logic here
  };

  return (
    <Router>
      <div className="flex">
        <Sidebar onConnectWallet={handleConnectWallet} />
        <div className="flex-1">
          <Routes>
            <Route path="/attestations" element={<Attestations />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/create" element={<Create />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
