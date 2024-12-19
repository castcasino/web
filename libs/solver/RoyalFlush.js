/* Import modules. */
import StraightFlush from './StraightFlush.js'

// NOTE: The 'joker' will be denoted with a value of 'O' and any suit.
const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']

export default class RoyalFlush extends StraightFlush {
    constructor(cards, game, canDisqualify) {
        super(cards, game, canDisqualify)
    }

    solve() {
        this.resetWildCards()
        var result = super.solve()
        return result && this.descr === 'Royal Flush'
    }
}
