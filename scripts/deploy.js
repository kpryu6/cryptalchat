const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {

  // Set up Accounts
  const [deployer] = await ethers.getSigners()

  const NAME = "Cryptalchat"
  const SYMBOL = "CC"

  // Contract 배포
  const Cryptalchat = await ethers.getContractFactory("Cryptalchat")
  const cryptalchat = await Cryptalchat.deploy(NAME,SYMBOL)
  await cryptalchat.deployed()

  console.log(`Deployed Cryptalchat Contract at ${cryptalchat.address}\n`)

  // 3개 채널 생성
  const CHANNEL_NAMES = ["general", "intro", "jobs"]
  const COSTS = [tokens(1), tokens(0), tokens(0.25)]
  for (var i = 0; i < 3; i++) {
    const transaction = await cryptalchat.connect(deployer).createChannel(CHANNEL_NAMES[i], COSTS[i])
    await transaction.wait()

    console.log(`Created text channel #${CHANNEL_NAMES[i]}`)
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});