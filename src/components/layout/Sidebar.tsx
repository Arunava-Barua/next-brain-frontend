import React from "react";
import { NavLink } from "react-router-dom";
import { WalletDefault } from "@coinbase/onchainkit/wallet";

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-70 bg-gray-800 text-white flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Next Brains</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/create"
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              Create New
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              Explore
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/attestations"
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              Attestations
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <WalletDefault />
      </div>
    </div>
  );
};

export default Sidebar;
