export default class NaturalRoyalFlush extends RoyalFlush {
    constructor(cards, game, canDisqualify) {
        super(cards, game, canDisqualify);
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
