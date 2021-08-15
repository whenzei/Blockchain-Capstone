pragma solidity >=0.4.21 <0.6.0;

import "./ERC721MintableComplete.sol";

contract SolnSquareVerifier is ERC721MintableComplete {
    Solution[] private _solutions;
    Verifier private _verifier;

    mapping(bytes32 => Solution) private _uniqueSolutions;
    struct Solution {
        uint256 index;
        address addr;
        bool isMinted;
    }

    constructor(address verifierAddress) public {
        _verifier = Verifier(verifierAddress);
    }

    event SolutionAdded(uint256 index, address addr);

    function addSolution(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory inputs
    ) public {
        bytes32 key = keccak256(abi.encodePacked(a, b, c, inputs));

        address newAddr = _uniqueSolutions[key].addr;
        require(newAddr == address(0), "Solution already exists");

        bool verified = _verifier.verifyTx(a, b, c, inputs);
        require(verified, "Solution failed verification");

        Solution memory newSolution = Solution(
            _solutions.length,
            msg.sender,
            false
        );
        _solutions.push(newSolution);
        _uniqueSolutions[key] = newSolution;

        emit SolutionAdded(newSolution.index, msg.sender);
    }

    function mintNFT(
        address to,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory inputs
    ) public returns (bool) {
        bytes32 key = keccak256(abi.encodePacked(a, b, c, inputs));
        require(
            _uniqueSolutions[key].addr == msg.sender,
            "Not owner of solution"
        );
        require(
            _uniqueSolutions[key].isMinted == false,
            "Token has been minted with this solution"
        );

        _uniqueSolutions[key].isMinted = true;
        return super.mint(to, _uniqueSolutions[key].index);
    }
}

contract Verifier {
    function verifyTx(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public view returns (bool);
}
