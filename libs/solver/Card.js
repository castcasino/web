/**
 * Base Card class that defines a single card.
 */
export default class Card {
    constructor(str) {
        this.value = str.substr(0, 1)
        this.suit = str.substr(1, 1).toLowerCase()
        this.rank = values.indexOf(this.value)
        this.wildValue = str.substr(0, 1)
    }

    toString() {
        return this.wildValue.replace('T', '10') + this.suit
    }

    static sort(a, b) {
        if (a.rank > b.rank) {
            return -1
        } else if (a.rank < b.rank) {
            return 1
        } else {
            return 0
        }
    }
}
