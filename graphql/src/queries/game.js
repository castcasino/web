/* Import modules. */
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

/* Initialize databases. */
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)
const sessionsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/sessions`)

/* Import types. */
// import GameType from '../types/Game.js'

import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
} from 'graphql'

export default {
    type: new GraphQLList(GraphQLString),
    args: {
        gameid: {
            type: new GraphQLList(GraphQLString),
            description: `Enter a __Game ID__ string.`,
        },
    },
    resolve: async (_root, _args, _ctx) => {
        console.log('Game (args):', _args)

        let response

        if (true) {
            response = await sessionsDb.put({
                _id: uuidv4(),
                hi: 'there!',
            }).catch(err => console.error(err))
        }

        const pkg = {
            field1: 'This is a GAME asset!',
            field2: 1337,
            field3: 88888888,
            response,
        }

        return [JSON.stringify(pkg)]
    },
    description: `Game description goes here.`,
}
