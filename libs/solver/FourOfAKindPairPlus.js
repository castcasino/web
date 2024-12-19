/* Import modules. */
import Hand from './Hand.js'

export default class FourOfAKindPairPlus extends Hand {
    constructor(cards, game, canDisqualify) {
        super(cards, 'Four of a Kind with Pair or Better', game, canDisqualify)
    }

  solve() {
    var cards;
    this.resetWildCards();

    for (var i=0; i<this.values.length; i++) {
      if (this.getNumCardsByRank(i) === 4) {
        this.cards = this.values[i] || [];
        for (var j=0; j<this.wilds.length && this.cards.length<4; j++) {
          var wild = this.wilds[j];
          if (this.cards) {
            wild.rank = this.cards[0].rank;
          } else {
            wild.rank = values.length - 1;
          }
          wild.wildValue = values[wild.rank];
          this.cards.push(wild);
        }
        break;
      }
    }

    if (this.cards.length === 4) {
      for (i=0; i<this.values.length; i++) {
        cards = this.values[i];
        if (cards && this.cards[0].wildValue === cards[0].wildValue) {
          continue;
        }
        if (this.getNumCardsByRank(i) >= 2) {
          this.cards = this.cards.concat(cards || []);
          for (var j=0; j<this.wilds.length; j++) {
            var wild = this.wilds[j];
            if (wild.rank !== -1) {
              continue;
            }
            if (cards) {
              wild.rank = cards[0].rank;
            } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
              wild.rank = values.length - 2;
            } else {
              wild.rank = values.length - 1;
            }
            wild.wildValue = values[wild.rank];
            this.cards.push(wild);
          }
          this.cards = this.cards.concat(this.nextHighest().slice(0, this.game.cardsInHand-6));
          break;
        }
      }
    }

    if (this.cards.length >= 6) {
      var type = this.cards[0].toString().slice(0, -1) + '\'s over ' + this.cards[4].toString().slice(0, -1) + '\'s';
      this.descr = this.name + ', ' + type;
    }

    return this.cards.length >= 6;
  }
}
