import should from 'should'

function importTest(name, path) {
    describe(name, function () {
        import(path)
    })
}

describe('main', function () {
    importTest('Standard', './standard.js')
    // importTest('Jacks or Better', './jacksbetter')
    // importTest('Joker Poker', './joker')
    // importTest('Deuces Wild', './deuceswild')
    // importTest('Three Card Poker', './threecard')
    // importTest('Four Card Poker', './fourcard')
    // importTest('Four Card Aces Up Bonus', './fourcardbonus')
    // importTest('Pai Gow Poker', './paigowpokerfullhands')
    return
})
