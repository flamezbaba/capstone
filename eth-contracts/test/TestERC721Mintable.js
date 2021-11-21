var ERC721MintableComplete = artifacts.require("CapStoneToken");

contract("TestERC721Mintable", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];

  describe("match erc721 spec", function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one });

      // TODO: mint multiple tokens
      for (let i = 0; i < 5; i++) {
        await this.contract.mint(accounts[i], i, { from: accounts[0] });
      }
      await this.contract.mint(accounts[0], 5, { from: accounts[0] });
    });

    it("should return total supply", async function () {
      const actual = await this.contract.totalSupply();
      assert.equal(actual.toNumber(), 6);
    });

    it("should get token balance", async function () {
      const actual = await this.contract.balanceOf(accounts[0]);
      assert.equal(actual.toNumber(), 2);
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function () {
      const actual = await this.contract.tokenURI(5);
      assert.equal(
        actual,
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/5"
      );
    });

    it("should transfer token from one owner to another", async function () {
      await this.contract.approve(accounts[0], 2, { from: accounts[2] });
      await this.contract.transferFrom(accounts[2], accounts[0], 2, {
        from: accounts[2],
      });
      const actual = await this.contract.balanceOf(accounts[0]);
      assert.equal(actual.toNumber(), 3);
    });
  });

  describe("have ownership properties", function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one });
    });

    it("should fail when minting when address is not contract owner", async function () {
      let flag = false;
      try {
        await this.contract.mint(accounts[0], 6, { from: accounts[1] });
      } catch (error) {
        flag = true;
      }
      assert.equal(flag, true);
    });

    it("should return contract owner", async function () {
      it('should return contract owner', async function () { 
        const actual = await this.contract.getOwner.call();
        assert.equal(actual, accounts[0]);
    })
    });
  });
});
