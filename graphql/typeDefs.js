const { gql } = require('apollo-server');

module.exports = gql`
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }

  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }

  type Post {
    id: ID!
    title: String!
    subtitle: String!
    body: String!
    createdAt: String!
    username: String!
    user: ID!
    comments: [Comment]!
    commentCount: Int!
    likes: [Like]!
    likeCount: Int!
    difficulty: String!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getPostsByUser(userId: ID!): [Post]
    getUsers: [User]
    getUser(userId: ID!): User
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(
      subtitle: String!
      title: String!
      body: String!
      difficulty: String!
    ): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
`;
