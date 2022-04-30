const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB_CONNECTION_STRING } = require('./config');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true })
  .then(() => {
    console.log('\u001b[1;32m ✅ MongoDB Connected');
    return server.listen(process.env.PORT || 5000);
  })
  .then((res) => {
    console.log(`\u001b[1;32m ✅ Server running at: ${res.url}`);
  });
