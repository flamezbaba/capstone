let SquareVerifier = artifacts.require("SquareVerifier");
let SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
let proof = require("../../zokrates/code/square/proof.json");

contract("TestSolnSquareVerifier", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];

  // Test if a new solution can be added for contract - SolnSquareVerifier
  it("Test if a new solution can be added for contract SolnSquareVerifier", async function () {
    const squareVerifier = await SquareVerifier.new({ from: account_one });
    const contract = await SolnSquareVerifier.new(squareVerifier.address, {
      from: account_one,
    });

    let result = await contract.IsMintable(
      account_two,
      2,
      proof.proof.a,
      proof.proof.b,
      proof.proof.c,
      proof.inputs,
      { from: account_one }
    );

    assert.equal(
      result.logs[0].event,
      "SolutionAdded",
      "could not add a solution"
    );
  });

  // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
  it("Test if an ERC721 token can be minted for contract SolnSquareVerifier", async function () {
    const squareVerifier = await SquareVerifier.new({ from: account_one });
    const contract = await SolnSquareVerifier.new(squareVerifier.address, {
      from: account_one,
    });

    let canMint = true;
    try {
      await contract.mintToken(
        account_two,
        2,
        proof.proof.a,
        proof.proof.b,
        proof.proof.c,
        proof.inputs,
        { from: account_one }
      );
    } catch (e) {
      canMint = false;
    }
    assert.equal(canMint, true, "cannot mint a token");
  });
});
