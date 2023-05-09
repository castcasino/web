/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

/* Initialize databases. */
const gamesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/games`)
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

        let game
        let gameid

        if (_args?.gameid) {
            gameid = _args.gameid
        }

        if (gameid) {
            game = await gamesDb
                .get(gameid)
                .catch(err => console.error(err))
        }

        let response

        if (_args) {
            response = await logsDb.put({
                _id: uuidv4(),
                args: _args,
                createdAt: moment().valueOf(),
            }).catch(err => console.error(err))
        }

        const pkg = {
            game,
            response,
        }

        return [JSON.stringify(pkg)]
    },
    description: `Game description goes here.`,
}
