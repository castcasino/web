export default class RoyalFlush extends StraightFlush {
    constructor(cards, game, canDisqualify) {
        super(cards, game, canDisqualify);
    }

    solve() {
        this.resetWildCards()
        var result = super.solve()
        return result && this.descr === 'Royal Flush'
    }
}
