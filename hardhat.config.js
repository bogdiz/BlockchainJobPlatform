require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path: "./config.env" });

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_API_KEY}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
};