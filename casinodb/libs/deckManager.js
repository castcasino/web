/*******************************************************************************
 * Deck Manager
 *
 * Provides ALL functions for managing a deck of cards.
 */

export const selectCard = (_activeDeck, _hashIdx, _numCards = 1) => {
console.log('ACTIVE DECK', _activeDeck)
console.log('HASH INDEX', _hashIdx)
    /* Initialize locals. */
    // let activeDeck
    let hashByte1
    let hashByte2
    let hashVal1
    let hashVal2
    let numRemaining
    let selectedCard
    let selectedIdx
    let selected
    let updatedDeck

    hashByte1 = _hashIdx.slice(0, 2)
console.log('HASH BYTE-1', hashByte1)

    hashVal1 = parseInt((hashByte1), 16)
console.log('HASH VALUE-1', hashVal1)

    /* Calculate remaining cards. */
    numRemaining = _activeDeck.length
console.log('NUM REMAINING', numRemaining)

    /* Calculate selected index. */
    selectedIdx = numRemaining % hashVal1
console.log('SELECTED INDEX', selectedIdx)

    selected = _activeDeck[selectedIdx]
console.log('SELECTED', selected)

    // updatedDeck = [ ..._activeDeck ].splice(selectedIdx)
    updatedDeck = _activeDeck.splice(selectedIdx)
console.log('UPDATED DECK', updatedDeck)

}

export const fullDeck = () => {
    /* Initialize deck. */
    const deck = []

    deck.push('AS')
    deck.push('KS')
    deck.push('QS')
    deck.push('JS')
    deck.push('TS')
    deck.push('9S')
    deck.push('8S')
    deck.push('7S')
    deck.push('6S')
    deck.push('5S')
    deck.push('4S')
    deck.push('3S')
    deck.push('2S')

    deck.push('AH')
    deck.push('KH')
    deck.push('QH')
    deck.push('JH')
    deck.push('TH')
    deck.push('9H')
    deck.push('8H')
    deck.push('7H')
    deck.push('6H')
    deck.push('5H')
    deck.push('4H')
    deck.push('3H')
    deck.push('2H')

    deck.push('AC')
    deck.push('KC')
    deck.push('QC')
    deck.push('JC')
    deck.push('TC')
    deck.push('9C')
    deck.push('8C')
    deck.push('7C')
    deck.push('6C')
    deck.push('5C')
    deck.push('4C')
    deck.push('3C')
    deck.push('2C')

    deck.push('AD')
    deck.push('KD')
    deck.push('QD')
    deck.push('JD')
    deck.push('TD')
    deck.push('9D')
    deck.push('8D')
    deck.push('7D')
    deck.push('6D')
    deck.push('5D')
    deck.push('4D')
    deck.push('3D')
    deck.push('2D')

    return deck
}
