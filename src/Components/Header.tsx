import React from "react";
import { Button, Tooltip } from "antd";
import { DisconnectOutlined } from "@ant-design/icons";

interface HeaderProps {
  connected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  account?: string | null; // Added account prop
}

const Header: React.FC<HeaderProps> = ({
  connected,
  connectWallet,
  disconnectWallet,
  account,
}) => {
  return (
    <header className="w-full flex justify-between items-center py-6 px-12 bg-gray-900 shadow-lg">
      <div className="text-3xl text-white font-extrabold">Krypton ICO</div>
      <div>
        {!connected ? (
          <Button
            type="primary"
            onClick={connectWallet}
            className="bg-blue-500 border-none hover:bg-blue-400 text-white font-semibold px-6 py-2 rounded-md"
          >
            Connect Wallet
          </Button>
        ) : (
          <Tooltip
            title={account ? `Connected Account: ${account}` : "No account connected"}
            placement="left"
            color="blue"
          >
            <Button
              danger
              onClick={disconnectWallet}
              className="border-none  hover:bg-red-500 text-white font-semibold px-6 py-2 rounded-md flex items-center space-x-2"
            >
              <DisconnectOutlined />
              <span>Disconnect</span>
            </Button>
          </Tooltip>
        )}
      </div>
    </header>
  );
};

export default Header;
