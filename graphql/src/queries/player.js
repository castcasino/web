/* Import types. */
// import PlayerType from '../types/Player.js'

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
    // args: {
    //     fieldName: {
    //         type: new GraphQLList(GraphQLString),
    //         description: `Field description goes here.`,
    //     },
    // },
    resolve: (_root, args, ctx) => {
        console.log('Player (args):', args)

        return [{
            field1: 'This is a PLAYER asset!',
            field2: 1337,
            field3: 88888888,
        }]
    },
    description: `Player description goes here.`,
}
