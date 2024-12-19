/* Import modules. */
import RoyalFlush from './RoyalFlush.js'

// NOTE: The 'joker' will be denoted with a value of 'O' and any suit.
const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']

export default class NaturalRoyalFlush extends RoyalFlush {
    constructor(cards, game, canDisqualify) {
        super(cards, game, canDisqualify)
    }

    solve() {
        var i = 0;
        this.resetWildCards();
        var result = super.solve();

        if (result && this.cards) {
            for (i=0; i<this.game.sfQualify && i<this.cards.length; i++) {
                if (this.cards[i].value === this.game.wildValue) {
                    result = false;
                    this.descr = 'Wild Royal Flush';
                    break;
                }
            }

            if (i === this.game.sfQualify) {
                this.descr = 'Royal Flush';
            }
        }

        return result;
    }
}
