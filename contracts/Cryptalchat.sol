// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Cryptalchat is ERC721{

    address public owner;
    uint256 public totalChannels = 0;
    uint256 public totalSupply;

    struct Channel {
        uint256 id;
        string name;
        uint256 cost;
    }

    mapping(uint256 => Channel) public channels;
    // 채널 1에서, 사용자 주소 보고 이 사용자가 이 채널에 접근할 수 있는가?에 대한 것
    mapping(uint256 => mapping(address => bool)) public hasJoined;

    modifier onlyOwner() {
        // require : 코드 문지기 (true면 코드진행)
        require(msg.sender == owner);
        // 아무거나 진행하세요~
        _;
    }
    
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol){
        owner = msg.sender;
    }

    function createChannel(string memory _name, uint256 _cost) public onlyOwner {
        // require(msg.sender == owner);
        totalChannels++;
        channels[totalChannels] = Channel(totalChannels, _name, _cost);
    }

    function mint(uint256 _id) public payable {
        require(_id != 0);
        require(_id <= totalChannels);
        require(hasJoined[_id][msg.sender] == false);
        require(msg.value >= channels[_id].cost);

        // 채널 입장
        hasJoined[_id][msg.sender] = true;
        totalSupply++;

        // mint NFT
        _safeMint(msg.sender, totalSupply);
    }

    function getChannel(uint256 _id) public view returns (Channel memory) {
        return channels[_id];
    }

    // contract에 있는 사용자들의 돈을 onwer가 withdraw 할 수 있게
    //
    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
