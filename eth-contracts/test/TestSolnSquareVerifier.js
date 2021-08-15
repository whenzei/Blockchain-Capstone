const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const Verifier = artifacts.require('Verifier');
const { proof, inputs } = require('./proof.json');

contract('TestSolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    let solnSquareVerifier;
    let verifier;

    beforeEach("setup", async () => {
        verifier = await Verifier.new();
        solnSquareVerifier = await SolnSquareVerifier.new(verifier.address, { from: account_one });
    })

    it("Test add solution success", async () => {
        let eventTriggered = false;
        await solnSquareVerifier.SolutionAdded((err, res) => {
            eventTriggered = true;
        })

        await solnSquareVerifier.addSolution(proof.a, proof.b, proof.c, inputs, { from: account_one });

        assert.equal(eventTriggered, true, "Solution not added");

    });

    it("Test can verify solution and mint success", async () => {
        let eventTriggered = false;
        await solnSquareVerifier.SolutionAdded((err, res) => {
            eventTriggered = true;
        })

        await solnSquareVerifier.addSolution(proof.a, proof.b, proof.c, inputs, { from: account_one });
        await solnSquareVerifier.mintNFT(account_one, proof.a, proof.b, proof.c, inputs, { from: account_one });

        const tokenCount = await solnSquareVerifier.balanceOf.call(account_one);

        assert.equal(eventTriggered, true, "Solution not added");
        assert.equal(tokenCount, 1, "Token not minted");
    });

});
