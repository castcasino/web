/* Import modules. */
import { GraphQLObjectType } from 'graphql'

/* Import mutations. */
import asset from './queries/asset.js'
import game from './queries/game.js'
import hello from './queries/hello.js'
import player from './queries/player.js'

/* Set name. */
const name = 'Query'

/* Set (Mutation) fields. */
const fields = {
    asset,
    game,
    hello,
    player,
}

/* Set (Mutation) description. */
const description = `
Make requests for Exchange data directly from the Nexa blockchain and our high-speed storage.
`.trim()

/**
 * Query
 *
 * Make requests for Exchagne data.
 */
export default new GraphQLObjectType({
    name,
    fields,
    description,
})
