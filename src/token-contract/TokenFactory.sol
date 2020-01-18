pragma solidity >=0.4.0 <0.6.0;

import "./Token.sol";

contract TokenFactory{
    event TokenDeploy(address indexed tokenOwner, string tokenName, string tokenSymbol, address tokenAddress);

    function deployToken(string memory _name, string memory _symbol, uint8 _decimals, uint256 _supply) public {
        Token tokenContract = new Token(_name, _symbol, _decimals, _supply, msg.sender);
        emit TokenDeploy(msg.sender, _name, _symbol, address(tokenContract));
    }
}