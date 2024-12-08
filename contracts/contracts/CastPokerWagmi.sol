/*******************************************************************************
 *
 * Copyright (c) 2024 Cast Casino DAO.
 * SPDX-License-Identifier: MIT
 *
 * CastPokerWagmi - Play an everyone is invited hand of poker in a Farcaster frame.
 *
 * Version 1
 * Released 24.12.6
 *
 * https://cast.poker
 * https://cast.casino
 */
pragma solidity ^0.8.9;

import { Ownable } from "../interfaces/Ownable.sol";
import { IERC20 } from "../interfaces/IERC20.sol";

contract CastPokerWagmi is Ownable {

    /* Table State */
    enum TableState {
        Waiting,
        Active,
        Inactive,
        Completed
    }

    /* Player Action */
    enum PlayerAction {
        Call,
        Check,
        Fold
    }

    /* Initialize table schema. */
    // NOTE: If no token is specified, the network's "base" coin is used instead.
    //       e.g. BASE, DEGEN, ETH, OP
    struct Table {
        TableState state;
        IERC20 token;       // Token used for participating in the hand.
        uint8 themeId;      // Set artwork (or suit) display on "special" cards. [default is Hearts]
        uint8 maxPlayers;
        uint8 bonusPool;    // Set the (size in %) of the bonus pool. [default is 0]
        uint8 currentRound; // Index of the current round.
        uint betAmount;
        uint pot;
        address[] players;
    }

    /* Initialize Round schema. */
    struct Round {
        bool state;         // State of the round. (if this is active or not)
        uint turn;          // An index on the players array, specifying the player
                            // who has the current turn.
        address[] players;  // Players still playing in the Round who have not folded.
        // uint highestChip;   // the current highest chip to be called in the round.
        uint[] chips;       // The amount of chips each player has put in the round.
                            // This will be compared with the highestChip to check,
                            // if the player has to call again or not.
    }

    /* Initialize (player) cards schema. */
    struct PlayerCards {
        uint8 card1;
        uint8 card2;
    }

    /* Initialize (player) card hashes schema. */
    struct PlayerCardsHashes {
        bytes32 card1Hash;
        bytes32 card2Hash;
    }

    /* Initialize ALL constants. */
    uint8 CURRENT_VERSION = 1;
    uint8 SAFU_BLOCK_MINIMUM = 3;
    uint8 MAX_PLAYERS_PER_HAND = 23;

    /* Initialize total hands. */
    uint public version;

    /* Initialize total hands. */
    uint public totalHands;

    /* Initialize hands handler. */
    // NOTE: id => Hand
    mapping(uint => Hand) public hands;

    /* Initialize community cards. */
    // handId => int8[] community cards
    mapping(uint => uint8[]) public communityCards;

    /* Initialize player chips handler. */
    // NOTE: Keeps track of the remaining chips of the player.
    // player => handId => remainingChips
    mapping(address => mapping(uint => uint)) public chips;

    /* Initialize player card hashes. */
    // player => handId => PlayerCardsHashes
    mapping(address => mapping(uint => PlayerCardsHashes)) public playerHashes;

    /* Initialize player payouts. */
    // player => handId => playerPayouts
    mapping(address => mapping(uint => bool)) public playerPayouts;

    /* Initialize hand rounds handler. */
    // NOTE: Three (3) rounds are: Flop, Turn and River.
    // handId => roundNum => Round
    mapping(uint => mapping(uint => Round)) public rounds;

    /* Initialize last (block #) action of round. */
    // handId => roundNum => lastActionOfRound
    mapping(uint => mapping(uint => uint)) public lastActionOfRound;

    /* Initialize "random" entropy of round. */
    // handId => roundNum => lastActionOfRound
    mapping(uint => mapping(uint => bytes32)) public entropy;

    /* Initialize (emit) events. */
    event NewTableCreated(uint tableId, Table table);
    event NewPlayer(uint handId, address player);
    event CardsDealt(uint handId, PlayerCardsHashes[] playerCardsHashes);
    event RoundOver(uint handId, uint round);
    event CommunityCardsDealt(uint handId, uint roundId, uint8[] cards);
    event HandManagement(uint handId);

    /* Constructor */
    constructor() {
        /* Set contract version. */
        version = CURRENT_VERSION;

        /* Initialize total # of hands. */
// FIXME **USE CASINO'S ETERNAL DB**
        totalHands = 0;
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
     * @param _token The token that will be used to bet in this table.
     * @param _maxPlayers The maximum number of players allowed in this table.
     * @param _betAmount The minimum amount of tokens required to enter the table.
     */
    function setTable(
        address _token,
        uint8 _maxPlayers,
        uint _betAmount
    ) external {
        /* Initialize (empty) addresses handler. */
        address[] memory empty;

        require(_maxPlayers <= MAX_PLAYERS_PER_HAND,
            "Oops! Your maximum player seats is OVER the platform limit.");

        /* Initialize the hand. */
        hands[totalHands] = Hand({
            state: HandState.Inactive,
            token: IERC20(_token),
            themeId: 0,
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
     * Deal Flop (Community Cards)
     *
     * A hosts MUST begin each hand by dealing a flop.
     *
     * NOTE: A flop is three (3) "random" cards provided for all participating
     *       players to utilize in forming their final hand.
     *
     * NOTE: A host MUST "set the table" BEFORE dealing the flop.
     */
    function dealFlop() external {
        // TBD...
    }

    /**
     * Deal Turn
     *
     * Adds the fourth card to the community cards.
     */
    function dealTurn() external {
        // TBD...
    }

    /**
     * Deal River
     *
     * Adds the final card to the community cards.
     */
    function dealRiver() external {
        // TBD...
    }

    /**
     * Cashout
     *
     * Allows a player to withdraw their deposited assets from the hand.
     *
     * NOTE: Chips are "normally" transferred at the completion of the hand
     *       by the platform. This is in the event that transfer fails.
     *       e.g. When the player's address is a smart contract (i.e. non-EOA)
     *       that DOES NOT permit direct tranfers.
     */
    function cashout(uint _handId) external {
        /* Validate chip balance. */
        require(chips[msg.sender][_handId] > 0,
            "Oops! You DO NOTE have any tokens remaining in this hand.");

        /* Set (cashout / balance) amount. */
        uint balance = chips[msg.sender][_handId];

        /* Reset chip balance. */
        chips[msg.sender][_handId] = 0;

        /* Transfer FULL chip balance to player. */
        require(hands[_handId].token.transfer(msg.sender, balance));
    }

    /**
     * Payouts
     *
     * Allows the Platform to distribute winnings the respective participants.
     */
    function payouts(uint _handId) external {
        // TBD...
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
     * @param _handId the unique id of the hand.
     */
    function buyIn(uint _handId) external payable {
        /* Validate sender (is NOT a contract). */
        require(_isContract(msg.sender) == false,
            "Oops! You CANNOT buy in using a smart wallet. Please use an EOA address.");

        /* Set hand. */
        Hand storage hand = hands[_handId];

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
        chips[msg.sender][_handId] += hand.betAmount;

        /* Add player to hand. */
        hand.players.push(msg.sender);

        /* Broadcast new player. */
        emit NewPlayer(_handId, msg.sender);
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
        uint _handId,
        PlayerCardsHashes[] memory _playerCards
    ) external onlyOwner {
        /* Set hand. */
        Hand storage hand = hands[_handId];

        /* Set # of players. */
        uint n = hand.players.length;

        /* Validate hand status. */
        require(hand.state == HandState.Inactive,
            "Oops! This hand is already in progress...");

        // require(n > 1 && _playerCards.length == n,
        //     "ERROR: PlayerCardsHashes Length");

        /* Update hand state to ACTIVE. */
        hand.state = HandState.Active;

        /* Initiate the first round. */
        Round storage round = rounds[_handId][0];

        round.state = true;
        round.players = hand.players;
        // round.highestChip = table.bigBlind;

        /* Initiate the small blind and the big blind. */
        for (uint i = 0; i < n; i++) {
            if (i == (n - 1)) { // the last player
                // small blinds
                // round.chips[i] = hand.bigBlind / 2;
                // chips[round.players[i]][_handId] -= hand.bigBlind / 2;
            } else if (i == (n-2)) { // the last second player
                // big blinds
                // round.chips[i] = hand.bigBlind; // update the round array
                // chips[round.players[i]][_handId] -= hand.bigBlind; // reduce the players chips
            }

            // save the player hashes for later use in showdown()
            playerHashes[hand.players[i]][_handId] = _playerCards[i];
        }

        /* Increase pot size. */
        hand.pot += hand.betAmount;

        /* Broadcast cards dealt. */
        emit CardsDealt(_handId, _playerCards);
    }

    ///
    /**
     * Bet Round
     *
     * Allows (participating) players to manage each round's wager (for their hand).
     *
     * @param _action The action to be performed in this Round of the Hand.
     */
    function betRound(
        uint _handId,
        PlayerAction _action
    ) external payable {
        /* Set hand. */
        Hand storage hand = hands[_handId];

        /* Validate hand state. */
        require(hand.state == HandState.Active,
            "Oops! There is NO active round available.");

        /* Set round. */
        Round storage round = rounds[_handId][hand.currentRound];

        /* Validate player turn. */
        require(round.players[round.turn] == msg.sender,
            "Oops! It's NOT your turn to bet.");

        /* Handle player action. */
        if (_action == PlayerAction.Call) {
            // in case of calling
            // deduct chips from the users account
            // add those chips to the pot
            // keep the player in the round

            // uint callAmount = round.highestChip - round.chips[round.turn];

            /* Reduce player chips. */
            chips[msg.sender][_handId] -= hand.betAmount;

            /* Increase pot. */
            hand.pot += hand.betAmount;
        } else if (_action == PlayerAction.Check) {
            // you can only check if all the other values in the round.chips array is zero
            // i.e nobody has put any money till now
            for (uint i = 0; i < round.players.length; i++) {
                if (round.chips[i] > 0) {
                    require(false, "Oops! You CANNOT check this round.");
                }
            }
        } else if (_action == PlayerAction.Fold) {
            /* Remove player from the players array for this round. */
            _remove(round.turn, round.players);

            /* Remove player from the chips array for this round. */
            _remove(round.turn, round.chips);
        }

        /* Finish round. */
        _finishRound(_handId, hand);
    }

    /// @dev this method will be called by the offchain node with the
    /// keys of each card hash & the card,  dealt in the dealCards function
    /// this method will then verify them with the hashes stored
    /// evaluate the cards, and send the pot earnings to the winner
    /**
     * Manage Hand
     *
     * Offers an adminstrative override in the event of a dispute with the hand.
     *
     * This method can be used to perform the following:
     *   1. Verify and/or modify the player's card hashes.
     *   2. Re-evaluate the player's cards.
     *   3. Send pot earnings to the winners.
     *
     * This method CANNOT be sued to perform the following:
     *   1. Change the deposit amounts of players.
     *   2. Withdraw ANY funds from the pot.
     */
    function manageHand(
        uint _handId,
        uint[] memory _keys,
        PlayerCards[] memory _cards
    ) external onlyOwner {
        Hand storage hand = hands[_handId];

        Round memory round = rounds[_handId][3];

        require(hand.state == HandState.Showdown);

        uint n = round.players.length;

        require(_keys.length == n && _cards.length == n,
            "Oops! Incorrect array length.");

        /* Validate player hashes. */
        for (uint i = 0; i < n; i++) {
            /* Calculate 1st hash. */
            bytes32 givenHash1 = keccak256(abi.encodePacked(_keys[i], _cards[i].card1));

            /* Calcualte 2nd hash. */
            bytes32 givenHash2 = keccak256(abi.encodePacked(_keys[i], _cards[i].card2));

            /* Set player card hashes. */
            PlayerCardsHashes memory hashes = playerHashes[round.players[i]][_handId];

            /* Validate 1st card. */
            require(hashes.card1Hash == givenHash1,
                "Oops! Incorrect 1st hole card.");

            /* Validate 2nd card. */
            require(hashes.card2Hash == givenHash2,
                "Oops! Incorrect 2nd hole card.");
        }

        // now choose winner
        address winner;

        // uint8 bestRank = 100;

        // for (uint j = 0; j < n; j++) {
        //     address player = round.players[j];

        //     PlayerCards memory playerCards = _cards[j];

        //     uint8[] memory cCards = communityCards[_handId];

        //     // uint8 rank = Evaluator7(EVALUATOR7).handRank(
        //     //     cCards[0],
        //     //     cCards[1],
        //     //     cCards[2],
        //     //     cCards[3],
        //     //     cCards[4],
        //     //     playerCards.card1,
        //     //     playerCards.card2
        //     // );

        //     // if (rank < bestRank) {
        //     //     bestRank = rank;
        //     //     winner = player;
        //     // }
        // }

        // add to the winner's balance
        require(winner != address(0),
            "Oops! Winner is zero address.");

        /* Set rewards. */
        chips[winner][_handId] += hand.pot;
    }

    /// @dev method called by the offchain node to update the community cards for the next round
    /// @param _roundId The round for which the cards are being dealt (1=>Flop, 2=>Turn, 3=>River)
    /// @param _cards Code of each card(s), (as per the PokerHandUtils Library)
    /**
     * Deal Community Cards
     *
     * TBD...
     */
    function dealCommunityCards(
        uint _tableId,
        uint _roundId,
        uint8[] memory _cards
    ) external onlyOwner {
        for (uint i=0; i<_cards.length; i++) {
            communityCards[_tableId].push(_cards[i]);
        }
        emit CommunityCardsDealt(_tableId, _roundId, _cards);
    }

    /**************************************************************************/
    /* INTERNAL UTILITIES */
    /**************************************************************************/

    /**
     * Set Flop
     *
     * Generates the entropy for the Flop deal.
     *
     * TODO: Automatically call this function from Deal.
     *       Set as "internal".
     */
    function _setFlop(
        uint _handId,
        uint8 _roundIdx
    ) external {
        /* Calculate a safe block number. */
        uint safuBlock = lastActionOfRound[_handId][_roundIdx] + SAFU_BLOCK_MINIMUM;

        /* Validate "current" block is safu. */
        // NOTE: `blockhash` cannot read "current" block.
        require(block.number > safuBlock,
            "Oops! You'll have to wait for a SAFU block before continuing.");

        /* Set (random & unknown) 1st block hash. */
        bytes32 blockHash_1 = blockhash(lastActionOfRound[_handId][_roundIdx] + 1);

        /* Set (random & unknown) 2nd block hash. */
        bytes32 blockHash_2 = blockhash(lastActionOfRound[_handId][_roundIdx] + 2);

        /* Set (random & unknown) 3rd block hash. */
        bytes32 blockHash_3 = blockhash(lastActionOfRound[_handId][_roundIdx] + 3);

        /* Calculate (randomized) entropy. */
        entropy[_handId][_roundIdx] = keccak256(
            abi.encodePacked(
                blockHash_1, blockHash_2, blockHash_3));
    }

    /**
     * Set Turn
     *
     * Generates the entropy for the River deal.
     *
     * TODO: Automatically call this function from Deal.
     *       Set as "internal".
     */
    function _setTurn(
        uint _handId,
        uint8 _roundIdx
    ) external {
        /* Calculate a safe block number. */
        uint safuBlock = lastActionOfRound[_handId][_roundIdx] + SAFU_BLOCK_MINIMUM;

        /* Validate "current" block is safu. */
        // NOTE: `blockhash` cannot read "current" block.
        require(block.number > safuBlock,
            "Oops! You'll have to wait for a SAFU block before continuing.");

        /* Set (random & unknown) 1st block hash. */
        bytes32 blockHash_1 = blockhash(lastActionOfRound[_handId][_roundIdx] + 1);

        /* Set (random & unknown) 2nd block hash. */
        bytes32 blockHash_2 = blockhash(lastActionOfRound[_handId][_roundIdx] + 2);

        /* Set (random & unknown) 3rd block hash. */
        bytes32 blockHash_3 = blockhash(lastActionOfRound[_handId][_roundIdx] + 3);

        /* Calculate (randomized) entropy. */
        entropy[_handId][_roundIdx] = keccak256(
            abi.encodePacked(
                blockHash_1, blockHash_2, blockHash_3));
    }

    /**
     * Set River
     *
     * Generates entropy for the River deal.
     *
     * TODO: Automatically call this function from Deal.
     *       Set as "internal".
     */
    function _setRiver(
        uint _handId,
        uint8 _roundIdx
    ) external {
        /* Calculate a safe block number. */
        uint safuBlock = lastActionOfRound[_handId][_roundIdx] + SAFU_BLOCK_MINIMUM;

        /* Validate "current" block is safu. */
        // NOTE: `blockhash` cannot read "current" block.
        require(block.number > safuBlock,
            "Oops! You'll have to wait for a SAFU block before continuing.");

        /* Set (random & unknown) 1st block hash. */
        bytes32 blockHash_1 = blockhash(lastActionOfRound[_handId][_roundIdx] + 1);

        /* Set (random & unknown) 2nd block hash. */
        bytes32 blockHash_2 = blockhash(lastActionOfRound[_handId][_roundIdx] + 2);

        /* Set (random & unknown) 3rd block hash. */
        bytes32 blockHash_3 = blockhash(lastActionOfRound[_handId][_roundIdx] + 3);

        /* Calculate (randomized) entropy. */
        entropy[_handId][_roundIdx] = keccak256(
            abi.encodePacked(
                blockHash_1, blockHash_2, blockHash_3));
    }

    /**
     * Finish Round
     *
     * TBD...
     */
    function _finishRound(
        uint _handId,
        Hand storage _hand
    ) internal {
        Round storage _round = rounds[_handId][_hand.currentRound];

        // if all of the other players have folded then the remaining player automatically wins
        uint n = _round.players.length;

        bool allChipsEqual = _allEqual(_round.chips); // checks if anybody has raised or not

        if (n == 1) {
            // this is the last player left all others have folded
            // so this player is the winner
            // send the pot money to the user
            chips[_round.players[0]][_handId] += _hand.pot;
        } else if (allChipsEqual) {
            // all elements equal meaning nobody has raised
            if (_hand.currentRound == 3) {
                // if nobody has raised and this is the final round then go to evaluation
                _hand.state = HandState.Showdown;

                emit HandManagement(_handId);
            } else {
                // if nobody has raised and this is not the final round
                // and this is the last player
                // then just go the next round

                // check if this is the last player
                // if this is not the last player then it might just be check
                // so dont go to the next round
                if (_round.turn == n-1) {

                    // also emit an event if going to the next round which will tell the
                    // offchain node to send the next card (flop, turn or river)
                    emit RoundOver(_handId, _hand.currentRound);

                     _hand.currentRound += 1;

                    uint[] memory _chips = new uint[](n);

                    /* Initiate next round. */
                    rounds[_handId][_hand.currentRound] = Round({
                        state: true,
                        turn : 0,
                        players: _round.players, // all living players from the last round
                        chips: _chips
                    });
                }
            }
        } else if (!allChipsEqual) {
            // or if somebody has raised
            // ie. all values in the chips array are same then also stay in the same round

            // just update the turn
            _round.turn = _updateTurn(_round.turn, n);
        }
    }

    /**
     * Update Turn
     *
     * Updates the turn to the next player.
     */
    function _updateTurn(
        uint _currentTurn,
        uint _totalLength
    ) internal pure returns (uint) {
        if (_currentTurn == _totalLength -1) {
            return 0;
        }

        return _currentTurn + 1;
    }

    /**
     * All (Elements) Equal
     *
     * Will determine if ALL the provided elements are equal.
     *
     * NOTE: Used to determine if any Player has increased the bet
     *       pool for a Round.
     */
    function _allEqual(uint[] memory arr) internal pure returns (bool val) {
        /* Set first element. */
        uint x = arr[0];

        /* Initialize value. */
        val = true;

        /* Validate ALL elements. */
        for (uint i = 0; i < arr.length; i++) {
            if (arr[i] != x) {
                val = false;
            }
        }
    }

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

    /**
     * Remove Address
     *
     * Removes an element from an address array.
     */
    function _remove(
        uint index,
        address[] storage arr
    ) internal {
        /* Overwrite (specified) element w/ a copy of last element. */
        arr[index] = arr[arr.length - 1];

        /* Remove last element. */
        arr.pop();
    }

    /**
     * Remove Data
     *
     * Removes an element from a data array.
     */
    function _remove(
        uint index,
        uint[] storage arr
    ) internal {
        /* Overwrite (specified) element w/ a copy of last element. */
        arr[index] = arr[arr.length - 1];

        /* Remove last element. */
        arr.pop();
    }
}
