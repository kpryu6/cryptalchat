const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Cryptalchat", function () {

  let deployer, user
  let cryptalchat

  const NAME = "Cryptalchat"
  const SYMBOL = "CC"

  beforeEach(async () => {

    [deployer, user] = await ethers.getSigners()

    // deployer = signers[0]
    // user = signers[1]

    // Contract 배포
    const Cryptalchat = await ethers.getContractFactory("Cryptalchat")
    cryptalchat = await Cryptalchat.deploy(NAME,SYMBOL)

    // 1 ETH = 1000000000000000000 wei



    // Channel 생성
    const transaction = await cryptalchat.connect(deployer).createChannel("general", tokens(0.000001))
    await transaction.wait()
  })
    

  describe("Deployment", function() {
    it("Sets the name", async () => {
      // Fetch name
      let result = await cryptalchat.name()
      expect(result).to.equal(NAME)
    })

    it("Sets the symbol", async () => {
      // Fetch symbol
      let result = await cryptalchat.symbol()
      expect(result).to.equal(SYMBOL)
    })

    it("Sets the owner", async () => {

      const result = await cryptalchat.owner()
      expect(result).to.equal(deployer.address)
    })
  })

  describe("Creating Channels", () => {
    it('Returns total Channels', async() => {
      const result = await cryptalchat.totalChannels()
      expect(result).to.be.equal(1)
    })

    it('Returns channel attributes', async() => {
      const channel = await cryptalchat.getChannel(1)
      expect(channel.id).to.be.equal(1)
      expect(channel.name).to.be.equal("general")
      expect(channel.cost).to.be.equal(tokens(0.000001))
    })
  })
    
  describe("Joining Channels", () => {
    const ID = 1
    const AMOUNT = ethers.utils.parseUnits("0.000001", 'ether')

    beforeEach(async () => {
      const transaction = await cryptalchat.connect(user).mint(ID, { value: AMOUNT })
      await transaction.wait()
    })

    it('Joins the user', async () => {
      const result = await cryptalchat.hasJoined(ID, user.address)
      expect(result).to.be.equal(true)
    })

    it('Increases total supply', async () => {
      const result = await cryptalchat.totalSupply()
      expect(result).to.be.equal(ID)
    })

    it('Updates the contract balance', async () => {
      const result = await ethers.provider.getBalance(cryptalchat.address)
      expect(result).to.be.equal(AMOUNT)
    })
  })

  describe("Withdrawing", () => {
    const ID = 1
    const AMOUNT = ethers.utils.parseUnits("10", 'ether')
    let balanceBefore

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      let transaction = await cryptalchat.connect(user).mint(ID, { value: AMOUNT })
      await transaction.wait()

      transaction = await cryptalchat.connect(deployer).withdraw()
      await transaction.wait()
    })

    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('Updates the contract balance', async () => {
      const result = await ethers.provider.getBalance(cryptalchat.address)
      expect(result).to.equal(0)
    })
  })
})
