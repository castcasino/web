/* Import modules. */
import Hand from './Hand.js'

// NOTE: The 'joker' will be denoted with a value of 'O' and any suit.
import values from './values.js'

export default class HighCard extends Hand {
    constructor(cards, game, canDisqualify) {
        super(cards, 'High Card', game, canDisqualify)
    }

    solve() {
        this.cards = this.cardPool.slice(0, this.game.cardsInHand);

        for (var i=0; i<this.cards.length; i++) {
            var card = this.cards[i];

            if (this.cards[i].value === this.game.wildValue) {
                this.cards[i].wildValue = 'A';
                this.cards[i].rank = values.indexOf('A');
            }
        }

        if (this.game.noKickers) {
            this.cards.length = 1;
        }

        this.cards = this.cards.sort(Card.sort);
        this.descr = this.cards[0].toString().slice(0, -1) + ' High';

        return true;
    }
}
