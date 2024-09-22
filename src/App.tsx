/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { Form, Input, message, Progress, Card, Row, Col, Avatar } from "antd";
import "./App.css";
import KryptoAbi from "./Kryptoabi.json";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { InfoCircleOutlined } from "@ant-design/icons";

const contractAddress = "0x3F75dA12899634Ad91E16D230B5a55C576103F10";
const abi = KryptoAbi;

function App() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [connected, setConnected] = useState(false);
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [totalRaised, setTotalRaised] = useState<string>("0");
  const [tokenPrice, setTokenPrice] = useState<string>("0");
  const [hardCap, setHardCap] = useState<string>("0");
  const [maxInvestment, setMaxInvestment] = useState<string>("0");
  const [minInvestment, setMinInvestment] = useState<string>("0");
  const [icostate, setIcoState] = useState<string>("");

  // Fetch ICO details and set state
  const fetchIcoDetails = useCallback(async (contract: ethers.Contract) => {
    try {
      const totalSupply = await contract.totalSupply();
      const totalRaised = await contract.raisedAmount();
      const tokenPrice = await contract.tokenPrice();
      const hardCap = await contract.hardCap();
      const maxInvestment = await contract.maxInvestment();
      const minInvestment = await contract.minInvestment();
      const stateDescription = await getCurrentState(contract); // Fetch ICO state

      setTotalSupply(Number(totalSupply));
      setTotalRaised(ethers.formatEther(totalRaised));
      setTokenPrice(ethers.formatEther(tokenPrice));
      setHardCap(ethers.formatEther(hardCap));
      setMaxInvestment(ethers.formatEther(maxInvestment));
      setMinInvestment(ethers.formatEther(minInvestment));
      setIcoState(stateDescription); // Set the ICO state
    } catch (error) {
      console.error("Failed to fetch ICO details", error);
    }
  }, []);

  // Get current ICO state
  const getCurrentState = async (contract: ethers.Contract) => {
    try {
      const state = Number(await contract.getCurrentState());

      let stateDescription = "";

      switch (state) {
        case 0:
          stateDescription = "Before Start";
          break;
        case 1:
          stateDescription = "Running";
          break;
        case 2:
          stateDescription = "After End";
          break;
        case 3:
          stateDescription = "Halted";
          break;
        default:
          stateDescription = "Unknown State";
          break;
      }

      return stateDescription;
    } catch (error) {
      console.error("Error fetching the current state:", error);
      return "Error";
    }
  };

  // Connect wallet and set state
  const connectWallet = async () => {
    if (!provider) return;

    try {
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        abi,
        signer
      );

      const userAddress = await signer.getAddress();
      setSigner(signer);
      setContract(contractInstance);
      setAccount(userAddress);
      setConnected(true);
    } catch (error) {
      console.error("Failed to connect wallet", error);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setSigner(null);
    setAccount(null);
    setConnected(false);
  };

  // Invest function
  const invest = async (values: { amount: string }) => {
    if (!signer || !contract) return;

    try {
      const tx = await signer.sendTransaction({
        to: contractAddress,
        value: ethers.parseEther(values.amount),
      });
      await tx.wait();
      message.success("Investment successful!");
      await fetchIcoDetails(contract);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e:any) {
      console.log("Investment failed", e.message);
      message.error("Investment failed. Please try again.");
    }
  };

  // Calculate ICO progress percentage
  const calculateProgress = () => {
    const raised = parseFloat(totalRaised);
    const cap = parseFloat(hardCap);
    if (cap > 0) {
      return (raised / cap) * 100;
    }
    return 0;
  };

  // Fetch ICO details when component mounts
  useEffect(() => {
    if (window.ethereum) {
      const tempProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(tempProvider);

      const contractInstance = new ethers.Contract(
        contractAddress,
        abi,
        tempProvider
      );
      setContract(contractInstance);
      fetchIcoDetails(contractInstance);
    } else {
      
      console.error("MetaMask not detected");
    }
  }, [fetchIcoDetails]);

  return (
    <>
      <Header
        connected={connected}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        account={account}
      />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-8">
        <div className="w-full max-w-7xl bg-gray-800 shadow-2xl rounded-xl p-10 text-white">
          <Row gutter={24} align="middle">
            <Col xs={24} md={16}>
              <h1 className="text-4xl font-extrabold mb-4">Krypton ICO</h1>
              <p className="text-lg text-gray-300">
                Participate in the Krypton ICO and be a part of the future.
                Invest today and grow your assets!
              </p>
              <Form name="investmentForm" onFinish={invest} layout="vertical">
                <Form.Item
                  name="amount"
                  label={
                    <span className="text-gray-200">Invest Amount (ETH)</span>
                  }
                  rules={[
                    {
                      validator: (_, value) => {
                        const numericValue = parseFloat(value);
                        if (isNaN(numericValue)) {
                          return Promise.reject(
                            new Error("Please enter a valid number")
                          );
                        }
                        if (numericValue < 0.001 || numericValue > 1) {
                          return Promise.reject(
                            new Error(
                              `Amount must be between ${minInvestment} and ${maxInvestment} ETH`
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter ETH amount"
                    className="bg-gray-200 text-gray-800 border-gray-400 placeholder-gray-500"
                  />
                </Form.Item>

                <Form.Item>
                  <button
                    type="submit"
                    className={`w-full text-white py-2 px-4 rounded ${
                      connected
                        ? "bg-blue-500 hover:bg-blue-400"
                        : "bg-blue-800 cursor-not-allowed"
                    }`}
                    disabled={!connected}
                  >
                    Participate
                  </button>
                </Form.Item>
              </Form>
            </Col>

            <Col xs={24} md={8} className="text-center">
              <Card className="bg-gray-700 border-0 text-white mb-4">
                <h3 className="text-lg font-bold">Swap Progress</h3>
                <Progress
                  percent={calculateProgress()}
                  status="active"
                  showInfo={true}
                  strokeColor="green"
                  trailColor="gray"
                  className="progress-bar"
                />
                <p className="mt-2 text-gray-300">
                  {totalRaised} / {hardCap} ETH
                </p>
                <div className="flex items-center mt-3 relative md:left-1.5 left-4.5">
                  {icostate === "Running" && (
                    <Avatar
                      icon={<InfoCircleOutlined />}
                      className="animate-pulse bg-green-600"
                    />
                  )}
                  {icostate === "After End" && (
                    <Avatar
                      style={{ backgroundColor: "#f56c6c" }}
                      icon={<InfoCircleOutlined />}
                      className="animate-pulse"
                    />
                  )}
                  {icostate === "Halted" && (
                    <Avatar
                      style={{ backgroundColor: "#f7c500" }}
                      icon={<InfoCircleOutlined />}
                      className="animate-pulse"
                    />
                  )}
                  <p className="ml-2">ICO Status: {icostate}</p>
                </div>
              </Card>
            </Col>
          </Row>

          <div className="mt-8">
            <Card
              title="Project Details"
              className="bg-gray-700 border-0 text-white mb-4"
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <p>
                    <strong>Opens:</strong> 2023-12-18 08:00:00 UTC
                  </p>
                  <p>
                    <strong>Closes:</strong> 2024-01-12 20:00:00 UTC
                  </p>
                  <p>
                    <strong>Token Price:</strong> {tokenPrice} ETH
                  </p>
                </Col>
                <Col xs={24} md={12}>
                  <p>
                    <strong>Min Investment:</strong> {minInvestment} ETH
                  </p>
                  <p>
                    <strong>Max Investment:</strong> {maxInvestment} ETH
                  </p>
                </Col>
              </Row>
            </Card>
            <Card
              title="Token Information"
              className="bg-gray-700 border-0 text-white"
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <p>
                    <strong>Name:</strong> KRYPTOS
                  </p>
                  <p>
                    <strong>Token Symbol:</strong> KRPT
                  </p>
                </Col>
                <Col xs={24} md={12}>
                  <p>
                    <strong>Total Supply:</strong> {totalSupply.toString()} KRPT
                  </p>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default App;
