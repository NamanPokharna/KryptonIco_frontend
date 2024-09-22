import React, { useState } from "react";
import { Button, Tooltip, Modal } from "antd";
import { DisconnectOutlined } from "@ant-design/icons";
import { MetaMaskColorful } from "@ant-design/web3-icons";

interface HeaderProps {
  connected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  account?: string | null;
}

const Header: React.FC<HeaderProps> = ({
  connected,
  connectWallet,
  disconnectWallet,
  account,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [walletSetupModalVisible, setWalletSetupModalVisible] = useState(false);

  const handleConnectClick = async () => {
    // Check if MetaMask (or any Ethereum wallet) is installed
    if (typeof window.ethereum === "undefined") {
      setIsModalVisible(true); // Show modal to install wallet
    } else {
      try {
        // MetaMask is installed, check if user has accounts or is connected
        const accounts = await window.ethereum.request.length

        if (accounts === 0) {
          // No wallet created or unlocked
          setWalletSetupModalVisible(true);  // Show wallet setup modal
        } else {
          // Wallet is created and unlocked, proceed to connect
          connectWallet();
        }
      } catch (error) {
        console.error("Error requesting accounts:", error);
      }
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    // Redirect to Chrome Web Store to install MetaMask or other wallet
    window.open("https://chrome.google.com/webstore/category/extensions", "_blank");
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleWalletSetupModalOk = () => {
    setWalletSetupModalVisible(false); // Close setup modal
  };

  return (
    <>
      <header className="w-full flex justify-between items-center py-6 px-12 bg-gray-900 shadow-lg">
        <div className="text-3xl text-white font-extrabold">Krypton ICO</div>
        <div>
          {!connected ? (
            <Button
              type="primary"
              onClick={handleConnectClick}
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
                className="border-none hover:bg-red-500 text-white font-semibold px-6 py-2 rounded-md flex items-center space-x-2"
              >
                <DisconnectOutlined />
                <span>Disconnect</span>
              </Button>
            </Tooltip>
          )}
        </div>
      </header>

      {/* Modal for wallet not installed */}
      <Modal
        title="Wallet Not Found"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Go to Chrome Web Store"
        cancelText="Cancel"
      >
        <p>No Ethereum wallet detected. Please install a wallet like MetaMask to continue.</p>
      </Modal>

      {/* Modal for wallet setup */}
      <Modal
        title="Set Up MetaMask"
        open={walletSetupModalVisible}
        onOk={handleWalletSetupModalOk}
        cancelButtonProps={{ style: { display: "none" } }} // Remove cancel button
        okText="OK"
      >
          <MetaMaskColorful style={{fontSize:73}} className="relative left-[12.25rem]"/>
        <p className="mt-5 ml-[5rem]">Please set up MetaMask by creating a new wallet.</p>
      </Modal>
    </>
  );
};

export default Header;
