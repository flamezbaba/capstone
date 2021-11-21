pragma solidity >=0.4.21 <0.6.0;
import "openzeppelin-solidity/contracts/utils/Address.sol";
import "./ERC721Mintable.sol";
import "./Verifier.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier {

}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CapStoneToken {
    SquareVerifier public squareContract;

    constructor(address verifierAddress) public CapStoneToken() {
        squareContract = SquareVerifier(verifierAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solutions {
        uint256 tokenId;
        address to;
    }

    // TODO define an array of the above struct
    Solutions[] private solutionsArray;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solutions) private solutionsMapping;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 tokenId, address to);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(
        address _to,
        uint256 _tokenId,
        bytes32 _key
    ) public {
        Solutions memory _solution = Solutions(_tokenId, _to);
        solutionsArray.push(_solution);
        solutionsMapping[_key] = _solution;
        emit SolutionAdded(_tokenId, _to);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintToken(
        address _to,
        uint256 _tokenId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public {
        bytes32 key = keccak256(abi.encodePacked(a, b, c, input));
        require(
            solutionsMapping[key].to == address(0),
            "Solution is already used."
        );
        require(
            squareContract.verifyTx(a, b, c, input),
            "Solution is not correct"
        );
        addSolution(_to, _tokenId, key);
        mint(_to, _tokenId);
    }

    function IsMintable(
        address _to,
        uint256 _tokenId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public {
        require(
            squareContract.verifyTx(a, b, c, input),
            "Solution is not correct"
        );
        bytes32 key = keccak256(abi.encodePacked(a, b, c, input));
        require(
            solutionsMapping[key].to == address(0),
            "Solution is already used."
        );

        addSolution(_to, _tokenId, key);
    }
}
