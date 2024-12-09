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
 *   - Track the order of players
 *   - Track the player seeds
 *   - DO NOT enable WAGMI (unlimited) mode at launch
 *   - DO NOT enable FOMO (inflation) mode at launch
 *
 * Version 1 (alpha)
 * Revision 0
 * Released 24.12.8
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
    //       CastCasinoDb keys; in order to prevent ANY accidental or
    //       malicious SQL-injection vulnerabilities / attacks.
    string private _namespace = 'cast.poker';

    /* Table State */
    enum TableState {
        Active,     // players can buy-in
        Completed,  // all cards have been dealt and play has ended
        Dealing,    // cards are being dealt for the hand
        Set         // created and waiting for community cards
    }

    /* Initialize table schema. */
    // NOTE: If no token is specified, the network's "native" coin is used instead.
    //       e.g. $BASE, $DEGEN, $ETH, $OP
    struct Table {
        TableState state;
        IERC20 token;           // token used for participating in the hand
        address host;           //
        string theme;           // set artwork (or suit) display on "special" cards [default is Hearts]
        string banner;          // a banner to be displayed at the table
        uint buyin;             // buy-in amount for the table
        uint tts;               // time-to-sit
        uint8 seats;            // maximum number of players allowed at the table
        uint8 fomo;             //
        uint pot;               // total pot size
        CommunityCards cards;   // community cards for the table
        Player[] players;       // players (w/ buy-in) at the table
    }

    /* Initialize (player) cards schema. */
    struct Player {
        address id;
        string seed;
        PlayerCards cards;
    }

    /* Initialize (player) cards schema. */
    struct PlayerCards {
        string hole1;
        string hole2;
    }

    /* Initialize (community) cards schema. */
    struct CommunityCards {
        string flop1;
        string flop2;
        string flop3;
        string turn;
        string river;
    }

    /* Initialize maximum seats per table. */
    // NOTE: This will be REMOVED after WAGMI is enabled.
    uint8 MAX_SEATS_PER_TABLE = 23;

    /* Initilaize maximum FOMO level. */
    // up to 20% inflation per buy-in
    uint8 MAX_FOMO_LEVEL = 20;

    /* Initialize maximum time-to-sit. */
    // 86400 seconds == 24 hours
    uint MAX_TIME_TO_SIT = 86400;

    /* Initialize tables handler. */
    // NOTE: id => Table
    mapping(uint => Table) public tables;

    /* Initialize community cards. */
    // tableid => community cards array
    mapping(uint => CommunityCards[]) public communityCards;

    /* Initialize player (chip) payouts. */
    // player => tableid => chips
    mapping(address => mapping(uint => uint)) public playerPayouts;

    /* Initialize (emit) events. */
    event NewTableCreated(uint tableId, Table table);
    event NewPlayer(uint handId, address player);
    // event CardsDealt(uint handId, PlayerCardsHashes[] playerCardsHashes);
    event RoundOver(uint handId, uint round);
    event CommunityCardsDealt(uint handId, uint roundId, uint8[] cards);
    event HandManagement(uint handId);

    /* Constructor */
    constructor() {
        /* Initialize CastCasinoDb (eternal) storage database contract. */
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

    /**************************************************************************/

    /* ACTIONS */

    /**************************************************************************/

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
     * @param _entropy Random 256-bit number, provided by the Host.
     * @param _buyin Minimum amount of tokens required to enter the table.
     * @param _tts Time-to-sit (in seconds), before play begins.
     * @param _seats Maximum number of players allowed at this table.
     */
    function setTable(
        address _token,
        string memory _asset,
        string memory _theme,
        string memory _banner,
        uint _entropy,
        uint _buyin,
        uint _tts,
        uint8 _seats,
        uint8 _fomo
    ) external {
        /* Initialize (empty) players handler. */
        Player[] memory empty;

        require(_tts <= MAX_TIME_TO_SIT,
            "Oops! Your maximum player seats is OVER the platform limit.");

        require(_seats <= MAX_SEATS_PER_TABLE,
            "Oops! Your maximum player seats is OVER the platform limit.");

        require(_fomo <= MAX_FOMO_LEVEL,
            "Oops! Your FOMO level OVER the platform limit.");

        /* Set hash. */
        bytes32 hash = keccak256(abi.encodePacked(
            _namespace, '.total.tables'
        ));

        /* Retrieve value from CastCasinoDb. */
        uint totalTables = _castCasinoDb.getUint(hash);

        /* Initialize the hand. */
        tables[totalTables] = Table({
            state: TableState,
            token: IERC20(_token),
            theme: _theme,
            maxPlayers: _maxPlayers,
            bonusPool: 0,
            currentRound: 0,
            betAmount: _betAmount,
            pot: 0,
            players: empty
        });

        /* Broadcast event. */
        emit NewHandCreated(totalHands, hands[totalHands]);

        /* Set last action of round (1 of 3). */
        lastActionOfRound[totalHands][0] = block.number;

        /* Update total hands. */
        totalHands += 1;
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
        string memory _tableid,
        string memory _flop1,
        string memory _flop2,
        string memory _flop3,
        string memory _turn,
        string memory _river
    ) external onlyOwner {
        /* Set community cards. */
        communityCards[_tableId].flop1 = _flop1;
        communityCards[_tableId].flop2 = _flop2;
        communityCards[_tableId].flop3 = _flop3;
        communityCards[_tableId].turn = _turn;
        communityCards[_tableId].river = _river;

        /* Emit community cards. */
        emit CommunityCardsDealt(
            _tableId,
            _flop1,
            _flop2,
            _flop3,
            _turn,
            _river
        );
    }

    /**
     * Buy In
     *
     * Allows a player to join the hand.
     *
     * NOTE: ONLY externally owned accounts are permitted to buy in.
     *       This offers a better UX for players, as the Platform
     *       will then automatically deliver payouts after the
     *       completion of each hand.
     *
     * @param _tableid the unique id of the hand.
     */
    function buyIn(uint _tableid) external payable {
        /* Validate sender (is NOT a contract). */
        require(_isContract(msg.sender) == false,
            "Oops! You CANNOT buy in using a smart wallet. Please use an EOA address.");

        /* Set hand. */
        Hand storage hand = hands[_tableid];

        require(hand.players.length < hand.maxPlayers,
            "Oops! This hand if full!");

        /* Validate deposit method. */
        // NOTE: Support is available for either the network's
        //       native coin OR an ERC-20 token.
        if (msg.value == hand.betAmount) {
            // TODO Handle wrapping of "base" coin into ERC-20.

            require(msg.value == hand.betAmount,
                "Oops! That's NOT the buy-in amount to join this hand.");

        } else if (msg.value > 0) {
            revert("Oops! You CANNOT deposit that amount into this hand.");
        } else {
            // NOTE: MUST pre-authorize this contract with an allowance
            //       from the player's wallet.

            /* Transfer bet amount from player to contract. */
            require(hand.token.transferFrom(
                msg.sender, address(this), hand.betAmount));
        }

        /* Provide chips to the player. */
        chips[msg.sender][_tableid] += hand.betAmount;

        /* Add player to hand. */
        hand.players.push(msg.sender);

        /* Broadcast new player. */
        emit NewPlayer(_tableid, msg.sender);
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
        uint _tableid,
        address payable _player,
        string memory _hole1,
        string memory _hole2
    ) external onlyOwner {
        /* Set table. */
        Table storage table = tables[_tableid];

        /* Set # of players. */
        uint n = hand.players.length;

        /* Validate hand status. */
        require(hand.state == TableState.Completed,
            "Oops! This hand was already completed...");

        /* Update table state to DEALING. */
        table.state = TableState.Dealing;

        /* Broadcast cards dealt. */
        emit CardsDealt(
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
     */
    function makePayout(
        uint _tableid,
        address payable player
    ) external returns (bool) {


        return true;
    }

    /**
     * Cashout
     *
     * Allows a player to withdraw their deposited assets from the hand.
     *
     * NOTE: Chips are "normally" transferred at the completion of the hand
     *       by the platform. This is in the event that transfer fails.
     *       e.g. When the player's address is a smart contract (i.e. non-EOA)
     *       that DOES NOT permit direct transfers.
     */
    function cashout(uint _tableid) external returns (uint) {
        /* Validate chip balance. */
        require(chips[msg.sender][_tableid] > 0,
            "Oops! You DO NOT have any chips remaining in this hand.");

        /* Set (cashout / balance) amount. */
        uint balance = chips[msg.sender][_tableid];

        /* Reset chip balance. */
        chips[msg.sender][_tableid] = 0;

        /* Transfer FULL chip balance to player. */
        require(hands[_tableid].token.transfer(msg.sender, balance));

        return true;
    }

    /**************************************************************************/

    /* UTILITIES */

    /**************************************************************************/

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
