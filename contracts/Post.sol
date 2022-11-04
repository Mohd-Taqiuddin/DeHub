// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Post is ERC721 {

  constructor() ERC721("Post", "POST") public  {}
  event NFTCreated (
    uint tokenId,
    string imageURL,
    uint date,
    address payable from
  );

  function mintNFT(string memory _tokenURI) external {
    uint _tokenId = totalSupply().add(1);
    _safeMint(msg.sender, _tokenId);
    _setTokenURI(_tokenId, _tokenURI);
    emit NFTCreated(_tokenId, _tokenURI, now, msg.sender);
  }
}