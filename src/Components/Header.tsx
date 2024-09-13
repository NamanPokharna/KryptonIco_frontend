import React from "react";
import { Button } from "antd";
import { DisconnectOutlined } from "@ant-design/icons";

interface HeaderProps {
  connected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const Header: React.FC<HeaderProps> = ({ connected, connectWallet, disconnectWallet }) => {
  return (
    <header className="w-full flex justify-between items-center py-4 px-8 bg-gray-800 ">
      <div className="text-2xl text-white font-bold">Krypton ICO</div>
      <div>
        {!connected ? (
          <Button type="primary" onClick={connectWallet}>
            Connect Wallet
          </Button>
        ) : (
          <Button danger onClick={disconnectWallet}>
            <DisconnectOutlined />
            Disconnect
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
