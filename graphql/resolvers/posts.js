const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    getPostsByUser: async (_, { userId }) => {
      try {
        const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    createPost: async (_, { title, subtitle, difficulty, body }, context) => {
      const user = checkAuth(context);

      if (title.trim() === '') {
        throw new Error('Post title must not be empty');
      }
      if (subtitle.trim() === '') {
        throw new Error('Post subtitle must not be empty');
      }
      if (body.trim() === '') {
        throw new Error('Post body must not be empty');
      }
      if (difficulty.trim() === '') {
        throw new Error('Post difficulty must not be empty');
      }

      const newPost = new Post({
        title,
        subtitle,
        difficulty,
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      context.pubsub.publish('NEW_POST', {
        newPost: post,
      });

      return post;
    },
    deletePost: async (_, { postId }, context) => {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);

        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully';
        } else {
          throw new AuthenticationError('Action not permitted');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    likePost: async (_, { postId }, context) => {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        return post;
      } else {
        throw new UserInputError('Post not found');
      }
    },
  },
};
