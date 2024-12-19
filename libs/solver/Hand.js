/* Import modules. */
import Card from './Card.js'
// import Game from './Game.js'

// NOTE: The 'joker' will be denoted with a value of 'O' and any suit.
import values from './values.js'

/**
 * Base Hand class that handles comparisons of full hands.
 */
export default class Hand {
    constructor(cards, name, game, canDisqualify) {
        this.cardPool = [];
        this.cards = [];
        this.suits = {};
        this.values = [];
        this.wilds = [];
        this.name = name;
        this.game = game;
        this.sfLength = 0;
        this.alwaysQualifies = true;

        // Qualification rules apply for dealer's hand.
        // Also applies for single player games, like video poker.
        if (canDisqualify && this.game.lowestQualified) {
            this.alwaysQualifies = false;
        }

        // Ensure no duplicate cards in standard game.
        if (game.descr === 'standard' && new Set(cards).size !== cards.length) {
            throw new Error('Duplicate cards');
        }

        // Get rank based on game.
        var handRank = this.game.handValues.length;

        for (var i=0; i<this.game.handValues.length; i++) {
            if (this.game.handValues[i] === this.constructor) {
                break;
            }
        }

        this.rank = handRank - i;

        // Set up the pool of cards.
        this.cardPool = cards.map(function(c) {
            return (typeof c === 'string') ? new Card(c) : c;
        });

        // Fix the card ranks for wild cards, and sort.
        for (var i=0; i<this.cardPool.length; i++) {
            card = this.cardPool[i];

            if (card.value === this.game.wildValue) {
                card.rank = -1;
            }
        }

        this.cardPool = this.cardPool.sort(Card.sort);

        // Create the arrays of suits and values.
        var obj, obj1, key, key1, card;

        for (var i=0; i<this.cardPool.length; i++) {
            // Make sure this value already exists in the object.
            card = this.cardPool[i];

            // We do something special if this is a wild card.
            if (card.rank === -1) {
                this.wilds.push(card);
            } else {
                (obj = this.suits)[key = card.suit] || (obj[key] = []);
                (obj1 = this.values)[key1 = card.rank] || (obj1[key1] = []);

                // Add the value to the array for that type in the object.
                this.suits[card.suit].push(card);
                this.values[card.rank].push(card);
            }
        }

        this.values.reverse();
        this.isPossible = this.solve();
    }

    /**
     * Compare current hand with another to determine which is the winner.
     * @param  {Hand} a Hand to compare to.
     * @return {Number}
     */
    compare(a) {
        if (this.rank < a.rank) {
            return 1;
        } else if (this.rank > a.rank) {
            return -1;
        }

        var result = 0;
        for (var i=0; i<=4; i++) {
            if (this.cards[i] && a.cards[i] && this.cards[i].rank < a.cards[i].rank) {
                result = 1;
                break;
            } else if (this.cards[i] && a.cards[i] && this.cards[i].rank > a.cards[i].rank) {
                result = -1;
                break;
            }
        }

        return result;
    }

    /**
     * Determine whether a hand loses to another.
     * @param  {Hand} hand Hand to compare to.
     * @return {Boolean}
     */
    loseTo(hand) {
        return (this.compare(hand) > 0);
    }

    /**
     * Determine the number of cards in a hand of a rank.
     * @param  {Number} val Index of this.values.
     * @return {Number} Number of cards having the rank, including wild cards.
     */
    getNumCardsByRank(val) {
        var cards = this.values[val];
        var checkCardsLength = (cards) ? cards.length : 0;

        for (var i=0; i<this.wilds.length; i++) {
            if (this.wilds[i].rank > -1) {
                continue;
            } else if (cards) {
                if (this.game.wildStatus === 1 || cards[0].rank === values.length - 1) {
                    checkCardsLength += 1;
                }
            } else if (this.game.wildStatus === 1 || val === values.length - 1) {
                checkCardsLength += 1;
            }
        }

        return checkCardsLength;
    }

    /**
     * Determine the cards in a suit for a flush.
     * @param  {String} suit Key for this.suits.
     * @param  {Boolean} setRanks Whether to set the ranks for the wild cards.
     * @return {Array} Cards having the suit, including wild cards.
     */
    getCardsForFlush(suit, setRanks) {
        var cards = (this.suits[suit] || []).sort(Card.sort);

        for (var i=0; i<this.wilds.length; i++) {
            var wild = this.wilds[i];

            if (setRanks) {
                var j=0;
                while (j<values.length && j<cards.length) {
                    if (cards[j].rank === values.length-1-j) {
                        j += 1;
                    } else {
                        break;
                    }
                }
                wild.rank = values.length-1-j;
                wild.wildValue = values[wild.rank];
            }

            cards.push(wild);
            cards = cards.sort(Card.sort);
        }

        return cards;
    }

    /**
     * Resets the rank and wild values of the wild cards.
     */
    resetWildCards() {
        for (var i=0; i<this.wilds.length; i++) {
            this.wilds[i].rank = -1;
            this.wilds[i].wildValue = this.wilds[i].value;
        }
    }

    /**
     * Highest card comparison.
     * @return {Array} Highest cards
     */
    nextHighest() {
        var picks;
        var excluding = [];
        excluding = excluding.concat(this.cards);

        picks = this.cardPool.filter(function(card) {
            if (excluding.indexOf(card) < 0) {
                return true;
            }
        });

        // Account for remaining wild card when it must be ace.
        if (this.game.wildStatus === 0) {
            for (var i=0; i<picks.length; i++) {
                var card = picks[i];
                if (card.rank === -1) {
                    card.wildValue = 'A';
                    card.rank = values.length - 1;
                }
            }
            picks = picks.sort(Card.sort);
        }

        return picks;
    }

    /**
     * Return list of contained cards in human readable format.
     * @return {String}
     */
    toString() {
        var cards = this.cards.map(function(c) {
            return c.toString();
        });

        return cards.join(', ');
    }

    /**
     * Return array of contained cards.
     * @return {Array}
     */
    toArray() {
        var cards = this.cards.map(function(c) {
            return c.toString();
        });

        return cards;
    }

    /**
     * Determine if qualifying hand.
     * @return {Boolean}
     */
    qualifiesHigh() {
        if (!this.game.lowestQualified || this.alwaysQualifies) {
            return true;
        }

        return (this.compare(Hand.solve(this.game.lowestQualified, this.game)) <= 0);
    }

    /**
     * Find highest ranked hands and remove any that don't qualify or lose to another hand.
     * @param  {Array} hands Hands to evaluate.
     * @return {Array}       Winning hands.
     */
    static winners(hands) {
        hands = hands.filter(function(h) {
            return h.qualifiesHigh();
        });

        var highestRank = Math.max.apply(Math, hands.map(function(h) {
            return h.rank;
        }));

        hands = hands.filter(function(h) {
            return h.rank === highestRank;
        });

        hands = hands.filter(function(h) {
            var lose = false;
            for (var i=0; i<hands.length; i++) {
                lose = h.loseTo(hands[i]);
                if (lose) {
                    break;
                }
            }

            return !lose;
        });

        return hands;
    }

    /**
     * Build and return the best hand.
     * @param  {Array} cards Array of cards (['Ad', '3c', 'Th', ...]).
     * @param  {String} game Game being played.
     * @param  {Boolean} canDisqualify Check for a qualified hand.
     * @return {Hand}       Best hand.
     */
    static solve(cards, game, canDisqualify) {
        game = game || 'standard';
        game = (typeof game === 'string') ? new Game(game) : game;
        cards = cards || [''];

        var hands = game.handValues;
        var result = null;

        for (var i=0; i<hands.length; i++) {
            result = new hands[i](cards, game, canDisqualify);
            if (result.isPossible) {
                break;
            }
        }

        return result;
    }

    /**
     * Separate cards based on if they are wild cards.
     * @param  {Array} cards Array of cards (['Ad', '3c', 'Th', ...]).
     * @param  {Game} game Game being played.
     * @return {Array} [wilds, nonWilds] Wild and non-Wild Cards.
     */
    static stripWilds(cards, game) {
        var card, wilds, nonWilds;
        cards = cards || [''];
        wilds = [];
        nonWilds = [];

        for (var i=0; i<cards.length; i++) {
            card = cards[i];
            if (card.rank === -1) {
                wilds.push(cards[i]);
            } else {
                nonWilds.push(cards[i]);
            }
        }

        return [wilds, nonWilds];
    }
}
