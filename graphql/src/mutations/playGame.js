/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

import { randomBytes } from '@nexajs/crypto'
import { entropyToMnemonic } from '@nexajs/hdnode'

/* Import types. */
import PlayType from '../types/Play.js'

import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLSchema,
    GraphQLString,
} from 'graphql'

/* Initialize databases. */
const gamesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/games`)
const playsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/plays`)
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)
const sessionsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/sessions`)

export default {
    type: GraphQLString,
    resolve: async (_root, _args, _ctx) => {
        console.log('BLANK PARAMS:', _args)

        let response

        const _id = uuidv4()

        const args = _args

        const bytes = randomBytes(32)

        const mnemonic = entropyToMnemonic(entropy)

        const createdAt = moment().valueOf()

        response = await playsDb.put({
            _id,
            args,
            bytes,
            mnemonic,
            createdAt,
        }).catch(err => console.error(err))

        return response
    },
    description: `Play description goes here.`,
}
