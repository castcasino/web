/*******************************************************************************
 *
 * Copyright (c) 2024 Cast Casino DAO.
 * SPDX-License-Identifier: MIT
 *
 * CastPoker - Play a hand of poker in a Farcaster frame.
 *
 * NOTES
 *   - TRANSPARENCY IS THE KEY
 *   - Track the game start time
 *   - Track the order of players??
 *   ✔ Track the player seeds
 *   ✔ DO NOT enable WAGMI (unlimited) mode at launch
 *   ✔ DO NOT enable FOMO (inflation) mode at launch
 *
 * Version 1 (alpha)
 * Revision 0
 * Released 24.12.10
 *
 * https://cast.poker
 * https://cast.casino
 */
pragma solidity ^0.8.9;

import { Ownable } from "../interfaces/Ownable.sol";
import { IERC20 } from "../interfaces/IERC20.sol";
import { ICastCasinoDb } from "../interfaces/ICastCasinoDb.sol";

contract CastPoker is Ownable {
    /* Initialize predecessor contract. */
    address payable private _predecessor;

    /* Initialize successor contract. */
    address payable private _successor;

    /* Initialize revision number. */
    uint private _revision;

    /* Initialize Modenero Db contract. */
    ICastCasinoDb private _castCasinoDb;

    /* Set namespace. */
    // NOTE: Use of `namespace` is REQUIRED when generating ANY & ALL
    //       Cast Casino database keys; in order to prevent ANY accidental or
    //       malicious SQL-injection vulnerabilities / attacks.
    string private _namespace = 'cast.poker';

    /* Table State */
    enum TableState {
        Active,     // players can buy-in
        Completed,  // all cards have been dealt and play has ended
        Dealing,    // cards are being dealt for the han
        Set         // created and waiting for community cards
    }

    /* Initialize table schema. */
    // NOTE: If no token is specified, the network's "native" coin is used instead.
    //       e.g. $BASE, $DEGEN, $ETH, $OP
    struct Table {
        TableState state;
        IERC20 token;               // token used for participating in the hand
        address host;               //
        // string theme;               // set artwork (or suit) display on "special" cards [default is Hearts]
        string banner;              // a banner to be displayed at the table
        uint seed;               // a random number, provided by the host, used to deal community cards
        uint buyin;                 // buy-in amount for the table
        uint tts;                   // a.k.a time-to-sit - duration of seating time before cards are dealt
        uint8 seats;                // maximum number of players allowed at the table
        uint8 fomo;                 //
        uint pot;                   // total pot size
        uint8 seated;               // Allow UP TO 255 seated players (w/ duplicates)  per table
        CommunityCards community;   // community cards for the table
        // Player[] players;           // players (w/ buy-in) at the table
    }

    /* Initialize (player) cards schema. */
    struct Player {
        address id;
        string seed;
        PlayerCards cards;
    }

    /* Initialize (player) cards schema. */
    struct PlayerCards {
        uint8 hole1;
        uint8 hole2;
    }

    /* Initialize (community) cards schema. */
    struct CommunityCards {
        uint8 flop1;
        uint8 flop2;
        uint8 flop3;
        uint8 turn;
        uint8 river;
    }

    /* Initialize maximum seats per table. */
    // NOTE: This will be REMOVED after WAGMI is enabled.
    uint8 MAX_SEATS_PER_TABLE = 23;

    /* Initilaize maximum FOMO level. */
    // up to 20% inflation per buy-in
    uint8 MAX_FOMO_LEVEL = 20;

    /* Initialize maximum time-to-sit. */
    // 86400 seconds == 24 hours
    uint MAX_TIME_TO_SIT = 86_400;

    /* Initialize tables handler. */
    // tableid => Table
    mapping(string => Table) public tables;

    /* Initialize community cards. */
    // tableid => community cards array
    // mapping(uint => CommunityCards[]) public communityCards;

    /* Initialize players. */
    // tableid => player address => Player
    mapping(string => mapping(address => Player)) public players;

    /* Initialize (emit) events. */
    event TableCreated(
        string indexed tableid,
        Table table
    );
    event CommunityCardsDealt(
        string indexed tableid,
        uint8 flop1,
        uint8 flop2,
        uint8 flop3,
        uint8 turn,
        uint8 river
    );
    event BuyIn(
        string indexed tableid,
        Player player
    );
    event PlayerCardsDealt(
        string indexed tableid,
        address player,
        uint8 hole1,
        uint8 hole2
    );
    event Payout(
        string indexed tableid,
        uint pot,
        uint amount
    );
    event Cashout(
        string indexed tableid,
        address player,
        uint amount
    );
    event TableManagement(
        string indexed tableid
    );

    /* Constructor */
    constructor() {
        /* Initialize Cast Casino (eternal) storage database contract. */
        // NOTE We hard-code the address here, since it should never change.
        _castCasinoDb = ICastCasinoDb(0x4fD22578B85dC2bd70532D6C63be9F7925b4167f);

        /* Initialize (aname) hash. */
        bytes32 hash = keccak256(abi.encodePacked('aname.', _namespace));

        /* Set predecessor address. */
        _predecessor = payable(_castCasinoDb.getAddress(hash));

        /* Verify predecessor address. */
        if (_predecessor != address(0)) {
            /* Retrieve the last revision number (if available). */
            uint lastRevision = CastPoker(_predecessor).getRevision();

            /* Set (current) revision number. */
            _revision = lastRevision + 1;
        }
    }

    fallback() external payable {
        /* Cancel this transaction. */
        revert('Oops! Direct payments are NOT permitted here.');
    }

    receive() external payable {
        /* Cancel this transaction. */
        revert('Oops! Direct payments are NOT permitted here.');
    }

    /**
     * @dev Only allow access to an authorized Cast Casino administrator.
     */
    modifier onlyAuthByCastCasino() {
        /* Verify write access is only permitted to authorized accounts. */
        require(_castCasinoDb.getBool(keccak256(
            abi.encodePacked(msg.sender, '.has.auth.for.', _namespace))) == true);

        _;      // function code is inserted here
    }


    /***************************************************************************
     *
     * ACTIONS
     *
     */

    /**
     * Set Table
     *
     * A host MUST begin a hand by first setting the table. This process
     * involves generating sufficient entropy to Deal the Flop.
     *
     * NOTE: Randomization occurs by utilzing the block hashes of the *NEXT*
     *       blocks produced by the miners.
     *
     * @param _token Primary token used for buy-ins.
     * @param _buyin Minimum amount of tokens required to enter the table.
     * @param _tts Time-to-sit (in seconds), before play begins.
     * @param _seats Maximum number of players allowed at this table.
     */
    function setTable(
        string calldata _tableid,
        address _token,
        // string calldata _theme,
        string calldata _banner,
        uint _seed,
        uint _buyin,
        uint _tts,
        uint8 _seats,
        uint8 _fomo
    ) external {
        require(_tts <= MAX_TIME_TO_SIT,
            "Oops! Your maximum player seats is OVER the platform limit.");

        require(_seats <= MAX_SEATS_PER_TABLE,
            "Oops! Your maximum player seats is OVER the platform limit.");

        require(_fomo <= MAX_FOMO_LEVEL,
            "Oops! Your FOMO level OVER the platform limit.");

        /* Initialize community cards. */
        CommunityCards memory community;

        /* Initialize (empty) players handler. */
        // Player[] memory players;

        /* Set hash. */
        bytes32 hash = keccak256(abi.encodePacked(
            _namespace, '.total.tables'
        ));

        /* Initialize the hand. */
        tables[_tableid] = Table({
            state: TableState.Set,
            token: IERC20(_token),
            host: msg.sender,
            // theme: _theme,
            banner: _banner,
            seed: _seed,
            buyin: _buyin,
            tts: _tts,
            seats: _seats,
            fomo: _fomo,
            pot: 0,
            seated: 0,
            community: community
        });

        /* Retrieve value from Cast Casino database. */
        uint totalTables = _castCasinoDb.getUint(hash);

        /* Update (increment) table count. */
        _castCasinoDb.setUint(hash, totalTables + 1);

        /* Broadcast event. */
        // emit TableCreated(_tableid, tables[_tableid]);
    }

    /**
     * Set Bench
     *
     * Provides a venue for (one-on-one) heads-up games.
     */
    function setBench() external {
        // TODO
    }

    /**
     * Deal Community Cards
     *
     * A hosts MUST begin each hand by dealing a flop.
     *
     * NOTE: A flop is three (3) "random" cards provided for all participating
     *       players to utilize in forming their final hand.
     *
     * NOTE: A host MUST "set the table" BEFORE dealing the flop.
     */
    function dealCommunityCards(
        string calldata _tableid,
        uint8 _flop1,
        uint8 _flop2,
        uint8 _flop3,
        uint8 _turn,
        uint8 _river
    ) external onlyOwner {
        /* Set table. */
        Table storage table = tables[_tableid];

        /* Set community cards. */
        table.community.flop1 = _flop1;
        table.community.flop2 = _flop2;
        table.community.flop3 = _flop3;
        table.community.turn = _turn;
        table.community.river = _river;

        /* Emit community cards. */
        // emit CommunityCardsDealt(
        //     _tableid,
        //     _flop1,
        //     _flop2,
        //     _flop3,
        //     _turn,
        //     _river
        // );
    }

    /**
     * Buy-In
     *
     * Allows a player to join the hand.
     *
     * A single player may buy-in (i.e. be seated) more than once.
     *
     * NOTE: ONLY externally owned accounts are permitted to buy in.
     *       This offers a better UX for players, as the Platform
     *       will then automatically deliver payouts after the
     *       completion of each hand.
     *
     * @param _tableid the unique id of the hand.
     */
    function buyIn(
        string calldata _tableid,
        string calldata _seed
    ) external payable {
        /* Validate sender (is NOT a contract). */
        require(_isContract(msg.sender) == false,
            "Oops! You CANNOT buy-in using a smart wallet. Please use a standard EOA wallet.");

        /* Set table. */
        Table storage table = tables[_tableid];

        require(table.seated < MAX_SEATS_PER_TABLE,
            "Oops! This table is already full!");

        /* Validate deposit method. */
        // NOTE: Support is available for either the network's
        //       native coin OR an ERC-20 token.
        if (table.token == IERC20(address(0))) {
            require(msg.value == table.buyin,
                "Oops! That's NOT the buy-in amount to join this table.");
        } else {
            // NOTE: MUST FIRST pre-authorize this contract with an allowance
            //       from the player's wallet.

            /* Transfer buy-in amount from player to table/contract. */
            require(table.token.transferFrom(msg.sender, address(this), table.buyin),
                "Oops! You DO NOT have a sufficient balance to buy-in with that asset.");
        }

        Player memory player = Player(
            msg.sender,
            _seed,
            PlayerCards(255, 255)
        );

        /* Increment seated players. */
        table.seated++;

        /* Broadcast buy-in. */
        emit BuyIn(_tableid, player);
    }

    /**
     * Deal Player Cards
     *
     * Distributes the cards for a participating player.
     *
     * NOTE: An event is kept onchain so that other players can later verify
     *       that there was no cheating.
     */
    function dealCards(
        string calldata _tableid,
        address _player,
        uint8 _hole1,
        uint8 _hole2
    ) external onlyOwner {
        /* Set table. */
        Table storage table = tables[_tableid];

        /* Set # of players. */
        // uint n = hand.players.length;

        /* Validate hand status. */
        require(table.state == TableState.Set,
            "Oops! This table is NOT ready for dealing.");

        /* Update table state to DEALING. */
        table.state = TableState.Dealing;

        /* Set player (hole) cards. */
        players[_tableid][_player].cards.hole1 = _hole1;
        players[_tableid][_player].cards.hole2 = _hole2;

        /* Broadcast cards dealt. */
        emit PlayerCardsDealt(
            _tableid,
            _player,
            _hole1,
            _hole2
        );
    }

    /**
     * Make Payout
     *
     * Allows the Platform to distribute winnings the respective participants.
     *
     * NOTE: Chip totals are stored in the Cast Casino database.
     */
    function makePayout(
        string calldata _tableid,
        address _player,
        string calldata _assetid,
        uint _amount
    ) external returns (bool) {
        /* Set table. */
        Table storage table = tables[_tableid];

        /* Set hash. */
        bytes32 hash = keccak256(abi.encodePacked(
            _namespace, '.total.', _assetid, '.chips.for', _player
        ));

        /* Retrieve value from Cast Casino database. */
        uint totalChips = _castCasinoDb.getUint(hash);

        /* Update new total chips. */
        _castCasinoDb.setUint(hash, totalChips + _amount);

        /* Validate deposit method. */
        // NOTE: Support is available for either the network's
        //       native coin OR an ERC-20 token.
        if (table.token == IERC20(address(0))) {
            (bool success, ) = msg.sender.call{ value: _amount}("");
            require(success, "Oops! Asset transfer has failed!");
        } else {
            /* Transfer bet amount from player to contract. */
            table.token.transferFrom(address(this), msg.sender, _amount);
            require(IERC20(table.token).transfer(_player, _amount),
                "Oops! Token transfer has failed!");
        }

        return true;
    }


    /***************************************************************************
     *
     * GETTERS
     *
     */

    /**
     * Get Revision (Number)
     */
    function getRevision() public view returns (uint) {
        return _revision;
    }

    /**
     * Get Predecessor (Address)
     */
    function getPredecessor() public view returns (address) {
        return _predecessor;
    }

    /**
     * Get Successor (Address)
     */
    function getSuccessor() public view returns (address) {
        return _successor;
    }


    /***************************************************************************
     *
     * SETTERS
     *
     */

    /**
     * Set Successor
     *
     * This is the contract address that replaced this current instnace.
     */
    function setSuccessor(
        address payable _newSuccessor
    ) onlyAuthByCastCasino external returns (bool success) {
        /* Set successor contract. */
        _successor = _newSuccessor;

        /* Return success. */
        return true;
    }


    /***************************************************************************
     *
     * UTILITIES
     *
     */

    /**
     * Is Contract
     *
     * Will determine (with reasonable certainty, if an address
     * belongs to a contract.
     */
    function _isContract(address _addr) internal view returns (bool) {
        /* Initialize size. */
        uint size;

        /* Calculate size. */
        assembly { size := extcodesize(_addr) }

        /* Evaluate size. */
        return size > 0;
    }
}
