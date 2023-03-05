// Blockfiles.io
// Author: amlug.eth 
// Work in progress.

// Devfund: 0xA8c51eEC9293b5E4E80d43a5eE7e10e707832F36
// Charityfund: 0xfd5bFF20BDc13E4B659dF40f4a431C0625682D01
// Whistleblowerfund: 0x9D200E11D2631D7BEd8700d579e1880b0259bC73
// Treasury: 0xDFaD9bd60E738e29C8891d76039e1A04A9dF2273

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; 

contract Blockfiles is
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    OwnableUpgradeable
{
    event NewFileMinted(address indexed owner, uint256 tokenId);
    struct File {
        uint256 royaltyFee;
        uint256 maxHolders;
    }
    address payable public constant ADDRESS_DEV      = payable(0xA8c51eEC9293b5E4E80d43a5eE7e10e707832F36);
    address payable public constant ADDRESS_CHARITY  = payable(0xfd5bFF20BDc13E4B659dF40f4a431C0625682D01);
    address payable public constant ADDRESS_WHISTLE  = payable(0x9D200E11D2631D7BEd8700d579e1880b0259bC73);
    address payable public constant ADDRESS_TREASURY = payable(0xDFaD9bd60E738e29C8891d76039e1A04A9dF2273);
    uint256 public constant CHARITY_SPLIT = 10;
    
    uint256 public pricePerMB;
    bool public uploadOpen;
    CountersUpgradeable.Counter private _tokenIdTracker;
    uint256 public devSplit;
    uint256 public whistleblowerSplit;

    mapping(uint256 => File) public files;
    mapping(uint256 => string) public customMetadataUris;

    function initialize() public initializer {
        __ERC721_init("Blockfiles", "BFL");
        pricePerMB = 0.0002 ether;
        devSplit = 50;
        whistleblowerSplit = 10;
        uploadOpen = true;
    }

    function getRoyaltyFee(uint256 tokenId) public view virtual returns (uint256) {
        return files[tokenId].royaltyFee;
    }
    function getMaxHolders(uint256 tokenId) public view virtual returns (uint256) {
        return files[tokenId].maxHolders;
    }

    function setPricePerMB(uint256 newPrice) external onlyOwner {
        pricePerMB = newPrice;
    }

    function setDevSplit(uint256 newSplit) external onlyOwner {
        devSplit = newSplit;
    }

    function setWhistleblowerSplit(uint256 newSplit) external onlyOwner {
        whistleblowerSplit = newSplit;
    }

    function setUploadOpen(bool open) external onlyOwner {
        uploadOpen = open;
    }

    function mint(uint256 sizeInMB, address owner, uint256 maxHolders, uint256 royaltyFee) external payable {
        require(uploadOpen, "Public sale has not started");
        require(
            pricePerMB * sizeInMB == msg.value,
            "Payment amount is incorrect"
        );
        uint256 id = CountersUpgradeable.current(_tokenIdTracker);
        _mint(owner, id);
        files[id] = File(royaltyFee, maxHolders);
        CountersUpgradeable.increment(_tokenIdTracker);

        emit NewFileMinted(owner, id);
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overridden in child contracts.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return "https://api.blockfiles.io/v1/metadata/";
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable)
    {
        super._burn(tokenId);
    }

    function withdraw() public onlyOwner {
        uint256 devSplitAmount = address(this).balance*devSplit/100;
        payable(ADDRESS_DEV).call{value: devSplitAmount}("");
        uint256 charitySplitAmount = address(this).balance*CHARITY_SPLIT/100;
        payable(ADDRESS_CHARITY).call{value: charitySplitAmount}("");
        uint256 whistleblowerSplitAmount = address(this).balance*whistleblowerSplit/100;
        payable(ADDRESS_WHISTLE).call{value: whistleblowerSplitAmount}("");
        uint256 treasury = address(this).balance;
        payable(ADDRESS_TREASURY).call{value: treasury}("");
    }


    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);
        bytes memory b = bytes(customMetadataUris[tokenId]);
        if (b.length>0) {
            return customMetadataUris[tokenId];
        }

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, Strings.toString(tokenId))) : "";
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
