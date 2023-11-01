import { loadFiles } from '@graphql-tools/load-files';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { resolvers } from "./src/resolvers/index.mjs";

const server = new ApolloServer({
	typeDefs: await loadFiles('src/typeDefs/*.graphql'),
	resolvers,
});


const { url } = await startStandaloneServer(server, {
	context ({req}) {
		return {
			authorization: req.headers.authorization || ''
		}
	},
	listen: { port: 4000 },
});

console.log(`🚀Graphql Server ready at: ${url}`);
