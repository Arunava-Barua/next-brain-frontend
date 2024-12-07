import React from "react";
import { NavLink } from "react-router-dom";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename, 
  WalletDropdownFundLink, 
  WalletDropdownLink, 
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance, 
} from '@coinbase/onchainkit/identity';

const Sidebar = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
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
      </div>

      {/* Wallet on the Right */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-50">
        <Wallet>
          <ConnectWallet>
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address />
              <EthBalance />
            </Identity>
            <WalletDropdownBasename />
            <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com">
              Wallet
            </WalletDropdownLink>
            <WalletDropdownFundLink />
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </div>
    </div>
  );
};

export default Sidebar;
