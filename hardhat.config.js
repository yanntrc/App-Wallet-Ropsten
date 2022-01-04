require('dotenv').config()
require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
const INFURA_URL = process.env.INFURA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: './src/artifacts'
  },
  networks: {
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_URL}`,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
