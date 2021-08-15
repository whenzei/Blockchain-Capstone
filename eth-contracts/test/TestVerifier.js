const Verifier = artifacts.require('Verifier');
const {proof, inputs} = require('./proof.json');

contract('TestVerifier', accounts => {

    const account_one = accounts[0];
    let verifier;

    before("setup", async () => {
        verifier = await Verifier.new()
    })

    it("Test verifier success", async() => {        
        const res = await verifier.verifyTx(proof.a, proof.b, proof.c, inputs, {from: account_one});
        assert.equal(res, true, "Test verification failed with proof");
    });

    it("Test verifier fail", async() => {      
        const res = await verifier.verifyTx(proof.a, proof.b, proof.c, [0, 0], {from: account_one});
        assert.equal(res, false, "Test verification failed with proof");
    });

});