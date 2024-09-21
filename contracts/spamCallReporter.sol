// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// Import necessary dependencies for World ID verification
import { ByteHasher } from "./ByteHasher.sol";
import { IWorldID } from "./IWorldID.sol";

contract SpamCallReporter {
    using ByteHasher for bytes;

    // Define an enum for the type of flag
    enum CallType { SPAM, SCAM }

    // Define a struct to hold call data
    struct CallData {
        uint256 callTime;
        string obfuscatedNumber;
        string label;
        CallType callType;
    }

    // World ID verification state variables
    IWorldID internal worldId;
    uint256 internal externalNullifier;
    uint256 internal groupId = 1;
    mapping(uint256 => bool) internal nullifierHashes;

    address public owner;

    // Mapping of verified addresses
    mapping(address => bool) public isVerified;

    // Event with an additional 'verified' field
    event FlaggedCall(
        uint256 indexed callTime,          // Time at which the call came
        string obfuscatedNumber,           // Hashed number
        address indexed submittedBy,       // Person who submitted it
        string label,                      // Label if any
        CallType callType,                 // Type of flag
        bool verified                      // Verified by World ID
    );

    /// @notice Thrown when attempting to reuse a nullifier
    error DuplicateNullifier(uint256 nullifierHash);

    /// @dev Constructor to initialize World ID variables
    /// @param _worldId The WorldID instance that will verify the proofs
    /// @param _appId The World ID app ID
    /// @param _actionId The World ID action ID
    constructor(IWorldID _worldId, string memory _appId, string memory _actionId) {
        worldId = _worldId;
        externalNullifier = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _actionId)
            .hashToField();
        owner = msg.sender;
    }

	/// @param root The root of the Merkle tree (returned by the JS widget).
	/// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the JS widget).
	/// @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by the JS widget).
	/// @dev Feel free to rename this method however you want! We've used `claim`, `verify` or `execute` in the past.
    function verifyUser(
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof,
        address userAddress
    ) public {
        // Check if the nullifier has already been used
        if (nullifierHashes[nullifierHash]) revert DuplicateNullifier(nullifierHash);

        // Perform World ID verification
        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked('').hashToField(),
            nullifierHash,
            externalNullifier,
            proof
        );

        // Mark the nullifier as used
        nullifierHashes[nullifierHash] = true;

        // Mark the address as verified
        isVerified[userAddress] = true;
    }

    event Proof(
        uint256 root,
        uint256 nullifierHash,
        uint256[8] proof
    );

    function changeWorldCoinDetails(
        IWorldID _worldId, string memory _appId, string memory _actionId
    ) public onlyOwner {
        worldId = _worldId;
        externalNullifier = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _actionId)
            .hashToField();
    }

    // Function to store spam calls
    function storeSpamOnlyOwner(CallData[] memory calls, address submitter) public onlyOwner{
        bool verified = isVerified[submitter];
        uint256 len = calls.length;

        // Emit event for each call
        for (uint256 i = 0; i < len; i++) {
            emit FlaggedCall(
                calls[i].callTime,
                calls[i].obfuscatedNumber,
                submitter,
                calls[i].label,
                calls[i].callType,
                verified
            );
        }
    }

    // Function to store spam calls
    function storeSpam(CallData[] memory calls) public onlyVerified{
        bool verified = isVerified[msg.sender];
        uint256 len = calls.length;

        // Emit event for each call
        for (uint256 i = 0; i < len; i++) {
            emit FlaggedCall(
                calls[i].callTime,
                calls[i].obfuscatedNumber,
                msg.sender,
                calls[i].label,
                calls[i].callType,
                verified
            );
        }
    }

    // Owner only functions 
    function changeOwner(address _owner) public onlyOwner { owner = _owner;}

    modifier onlyVerified() {
        // Verify that the address is verified
        require(isVerified[msg.sender], "Not verified");
        _;
    }

    // Temporary function while we wait for worldcoin to deploy on this chain
    function verifyUserByOwner(
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof, address _verifiedAddress
    ) public onlyOwner {
        emit Proof(root, nullifierHash, proof);
        isVerified[_verifiedAddress] = true;
    }

    // Only Owner modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function unverify(address add) public {
        isVerified[add] = false;
    }
}
