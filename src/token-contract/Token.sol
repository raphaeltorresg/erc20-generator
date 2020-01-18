


/** Thanks to OpenZeppelin for the awesome Libraries and SmartContracts. */

pragma solidity >=0.4.0 <0.6.0;

import "./ERC20.sol";
import "./ERC20Detailed.sol";


/**
 * @title SimpleToken
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 */
contract Token is ERC20, ERC20Detailed {

    /**
     * @dev Constructor that gives _owner all of existing tokens.
     */
    constructor (string memory _name, string memory _symbol, uint8 _decimals, uint256 _supply, address _owner) public
        ERC20Detailed(_name, _symbol, _decimals) {
        uint256 INITIAL_SUPPLY = _supply * (10 ** uint256(_decimals));
        _mint(_owner, INITIAL_SUPPLY);
    }

    
}