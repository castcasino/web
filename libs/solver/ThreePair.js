/* Import modules. */
import Hand from './Hand.js'

// NOTE: The 'joker' will be denoted with a value of 'O' and any suit.
import values from './values.js'

export default class ThreePair extends Hand {
    constructor(cards, game, canDisqualify) {
        super(cards, 'Three Pair', game, canDisqualify)
    }

  solve() {
    this.resetWildCards();

    for (var i=0; i<this.values.length; i++) {
      var cards = this.values[i];
      if (this.cards.length > 2 && this.getNumCardsByRank(i) === 2) {
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
      } else if (this.cards.length > 0 && this.getNumCardsByRank(i) === 2) {
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
      } else if (this.getNumCardsByRank(i) === 2) {
        this.cards = this.cards.concat(cards);
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
      }
    }

    if (this.cards.length >= 6) {
      var type = this.cards[0].toString().slice(0, -1) + '\'s & ' + this.cards[2].toString().slice(0, -1) + '\'s & ' + this.cards[4].toString().slice(0, -1) + '\'s';
      this.descr = this.name + ', ' + type;
    }

    return this.cards.length >= 6;
  }
}
