import { _Hand as Hand } from './pokersolver.js'
// console.log('HAND', Hand)

var hand1 = Hand.solve(['AD', 'AS', 'JC', 'TH', '2D', '3C', 'KD']);
console.log('HAND 1', hand1.descr)

var hand2 = Hand.solve(['AD', 'AS', 'JC', 'TH', '2D', 'QS', 'JD']);
console.log('HAND 2', hand2.descr)

var winner = Hand.winners([hand1, hand2]); // hand2
console.log('WINNER', winner.length, winner.map(_winner => _winner.descr))

var hand3 = Hand.solve(['AD', 'AS', 'JC', 'TH', '2D', 'QS', 'QD']);
console.log('HAND 3', hand3.descr)

var winners = Hand.winners([hand2, hand3]); // tie
console.log('WINNER', winners.length, winners.map(_winner => _winner.name))
console.log('WINNER', winners.length, winners.map(_winner => _winner.descr))
