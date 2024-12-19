import { _Hand as Hand } from './pokersolver.js'
console.log('HAND', Hand)

var hand1 = Hand.solve(['Ad', 'As', 'Jc', 'Th', '2d', '3c', 'Kd']);
console.log('HAND 1', hand1)

var hand2 = Hand.solve(['Ad', 'As', 'Jc', 'Th', '2d', 'Qs', 'Qd']);
console.log('HAND 2', hand2)

var hand3 = Hand.solve(['Ad', 'As', 'Jc', 'Th', '2d', 'Qs', 'Qd']);
console.log('HAND 3', hand3)

var winner = Hand.winners([hand1, hand2]); // hand2
console.log('WINNER', winner.length, winner)

var winners = Hand.winners([hand2, hand3]); // hand2
console.log('WINNER', winners.length, winners)
