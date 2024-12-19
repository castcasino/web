export default class WildRoyalFlush extends RoyalFlush {
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
                    this.descr = 'Wild Royal Flush';
                    break;
                }
            }

            if (i === this.game.sfQualify) {
                result = false;
                this.descr = 'Royal Flush';
            }
        }

        return result;
    }
}
