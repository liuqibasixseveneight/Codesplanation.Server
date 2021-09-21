const commentsResolvers = require("./comments");
const postsResolvers = require("./posts");
const usersResolvers = require("./users");

module.exports = {
  Post: {
    commentCount: (parent) => parent.comments.length,
    likeCount: (parent) => parent.likes.length,
  },
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...commentsResolvers.Mutation,
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
  },
};
