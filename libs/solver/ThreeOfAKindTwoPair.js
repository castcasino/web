export default class ThreeOfAKindTwoPair extends Hand {
    constructor(cards, game, canDisqualify) {
        super(cards, 'Three of a Kind with Two Pair', game, canDisqualify);
    }

  solve() {
    var cards;
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
        break;
      }
    }

    if (this.cards.length === 3) {
      for (var i=0; i<this.values.length; i++) {
        var cards = this.values[i];
        if (cards && this.cards[0].wildValue === cards[0].wildValue) {
          continue;
        }
        if (this.cards.length > 5 && this.getNumCardsByRank(i) === 2) {
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
          this.cards = this.cards.concat(this.nextHighest().slice(0, this.game.cardsInHand-4));
          break;
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
    }

    if (this.cards.length >= 7) {
      var type = this.cards[0].toString().slice(0, -1) + '\'s over ' + this.cards[3].toString().slice(0, -1) + '\'s & ' + this.cards[5].value + '\'s';
      this.descr = this.name + ', ' + type;
    }

    return this.cards.length >= 7;
  }
}
