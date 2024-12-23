import { _Hand as Hand } from './pokersolver.js'
// console.log('HAND', Hand)

const findWinner = (_player1, _player2) => {
    const hand1 = Hand.solve([ ...community, ...player1 ])
// console.log('\nHAND 1', hand1.descr)
// console.log('\nHAND 1', hand1)

    const hand2 = Hand.solve([ ...community, ...player2 ])
// console.log('\nHAND 2', hand2.descr)
// console.log('\nHAND 2', hand2)

    const winner = Hand.winners([ hand1, hand2 ])
console.log('\nWINNER', winner.length, winner.map(_winner => _winner.descr))
// console.log('\nWINNER', winner.length, winner.map(_winner => JSON.stringify(_winner.cards)))
// console.log('\nWINNER', winner.length, winner)

    const winnerMatch = JSON.stringify(winner[0].cards)
// console.log('winnerMatch', winnerMatch)
    const player1Match = JSON.stringify(hand1.cards)
// console.log('player1Match', player1Match)
    const player2Match = JSON.stringify(hand2.cards)
// console.log('player2Match', player2Match)

    if (winner.length === 2) {
        return 0
    } else if (winnerMatch === player1Match) {
        return 1
    } else if (winnerMatch === player2Match) {
        return 2
    }

    return -1
}

const community = ['KS', 'JS', '9S', '7S', '5S']
const player1 = ['3H', '6C']
const player2 = ['QC', 'JD']

const winner = findWinner()
console.log('PLAYER', winner)
