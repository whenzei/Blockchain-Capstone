const Verifier = artifacts.require("Verifier");
const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

module.exports = function(deployer) {
  deployer.deploy(Verifier).then(() => deployer.deploy(SolnSquareVerifier, Verifier.address));
};
