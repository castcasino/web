/* Import modules. */
import RoyalFlush from './RoyalFlush.js'

// NOTE: The 'joker' will be denoted with a value of 'O' and any suit.
import values from './values.js'

export default class WildRoyalFlush extends RoyalFlush {
    constructor(cards, game, canDisqualify) {
        super(cards, game, canDisqualify)
    }

    solve() {
        let i = 0

        this.resetWildCards()

        let result = super.solve()

        if (result && this.cards) {
            for (i = 0; i < this.game.sfQualify && i < this.cards.length; i++) {
                if (this.cards[i].value === this.game.wildValue) {
                    this.descr = 'Wild Royal Flush'
                    break
                }
            }

            if (i === this.game.sfQualify) {
                result = false
                this.descr = 'Royal Flush'
            }
        }

        return result
    }
}
