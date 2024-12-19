/* Import modules. */
import Hand from './Hand.js'

export default class ThreeOfAKind extends Hand {
    constructor(cards, game, canDisqualify) {
        super(cards, 'Three of a Kind', game, canDisqualify)
    }

  solve() {
    this.resetWildCards();

    for (var i=0; i<this.values.length; i++) {
      if (this.getNumCardsByRank(i) === 3) {
        this.cards = this.values[i] || [];
        for (var j=0; j<this.wilds.length && this.cards.length<3; j++) {
          var wild = this.wilds[j];
          if (this.cards) {
            wild.rank = this.cards[0].rank;
          } else {
            wild.rank = values.length - 1;
          }
          wild.wildValue = values[wild.rank];
          this.cards.push(wild);
        }
        this.cards = this.cards.concat(this.nextHighest().slice(0, this.game.cardsInHand-3));
        break;
      }
    }

    if (this.cards.length >= 3) {
      if (this.game.noKickers) {
        this.cards.length = 3;
      }

      this.descr = this.name + ', ' + this.cards[0].toString().slice(0, -1) + '\'s';
    }

    return this.cards.length >= 3;
  }
}
