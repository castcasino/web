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

export default new GraphQLObjectType({
    name: 'Game',
    fields: () => ({
        title: { type: GraphQLString },
        createdAt: { type: GraphQLInt },
        updatedAt: { type: GraphQLInt },
    }),
    description: `A __Game__ is a playable platform.`,
})
