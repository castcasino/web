/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

/* Import types. */
import GameType from '../types/Game.js'

import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
} from 'graphql'

/* Initialize databases. */
const gamesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/games`)
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)
const sessionsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/sessions`)

export default {
    type: new GraphQLList(GameType),
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
        let response

        if (_args?.gameid) {
            gameid = _args.gameid
        }

        if (gameid) {
            response = await gamesDb
                .get(gameid)
                .catch(err => console.error(err))

            /* Validate response. */
            if (response) {
                game = {
                    title: response.title,
                    createdAt: response.createdAt,
                    updatedAt: response.updatedAt,
                }
            }
        }

        if (_args) {
            response = await logsDb.put({
                _id: uuidv4(),
                args: _args,
                createdAt: moment().valueOf(),
            }).catch(err => console.error(err))
        }

        return [game]
    },
    description: `Game objects hold all relevent metadata.`,
}
