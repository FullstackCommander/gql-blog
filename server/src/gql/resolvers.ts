import User from "../models/User";
import Post from "../models/Post";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export const resolvers = {
  Query: {
    getUserPosts: async (_: any, { userId }: { userId: string }) => {
      return await Post.find({ author: userId }).populate("author");
    },
    getAllPosts: async () => {
      return await Post.find().populate("author");
    },
    getUserProfile: async (_: any, { id }: { id: string }) => {
      const user = await User.findById(id).select("-password");
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
    getAllUsers: async () => {
      return await User.find().select("-password");
    },
    getUserById: async (_: any, { id }: { id: string }) => {
      const user = await User.findById(id).select("-password");
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
    getPostById: async (_: any, { id }: { id: string }) => {
      const post = await Post.findById(id).populate("author");
      if (!post) {
        throw new Error("Post not found");
      }
      return post;
    },
  },

  Mutation: {
    registerUser: async (
      _: any,
      {
        username,
        email,
        password,
        avatar,
        bio,
      }: {
        username: string;
        email: string;
        password: string;
        avatar: string;
        bio: string;
      }
    ) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error("Username already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const token = jwt.sign(
        { username, email },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "7d" }
      );

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        avatar,
        bio,
        createdAt: new Date(),
      });

      await newUser.save();

      return {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        bio: newUser.bio,
        token,
      };
    },

    loginUser: async (
      _: any,
      { username, password }: { username: string; password: string }
    ) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      const token = jwt.sign(
        { username: user.username, email: user.email },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "7d" }
      );

      console.log("User logged in:", user.username);
      console.log("Generated token:", token);

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        token,
      };
    },


    updateUser: async (
      _: any,
      {
        id,
        username,
        email,
        avatar,
        bio,
      }: {
        id: string;
        username?: string;
        email?: string;
        avatar?: string;
        bio?: string;
      }
    ) => {
      const user = await User.findById(id);
      if (!user) {
        throw new Error("User not found");
      }

      if (username) user.username = username;
      if (email) user.email = email;
      if (avatar) user.avatar = avatar;
      if (bio) user.bio = bio;

      await user.save();
      return user;
    },

    deleteUser: async (_: any, { id }: { id: string }) => {
      const user = await User.findById(id);
      if (!user) {
        throw new Error("User not found");
      }
      await User.deleteOne({ _id: id });
      return true;
    },

     createPost: async (
    _: any,
    {
      title,
      content,
      author,
      image,
    }: {
      title: string;
      content: string;
      author: string;
      image?: string;
    }
  ) => {
    const user = await User.findById(author);
    if (!user) throw new Error("Author (user) not found");

    const newPost = new Post({
      title,
      content,
      author,
      image: image || null,
      createdAt: new Date(),
    });

    return await newPost.save();
  },

    updatePost: async (
      _: any,
      {
        id,
        title,
        content,
      }: { id: string; title?: string; content?: string }
    ) => {
      const post = await Post.findById(id);
      if (!post) {
        throw new Error("Post not found");
      }

      if (title) post.title = title;
      if (content) post.content = content;
      post.updatedAt = new Date();

      await post.save();
      return post;
    },

    deletePost: async (_: any, { id }: { id: string }) => {
      const post = await Post.findById(id);
      if (!post) {
        throw new Error("Post not found");
      }

      await post.deleteOne();
      return true;
    },
  },

  User: {
    posts: async (parent: { id: string }) => {
      return await Post.find({ author: parent.id });
    },
  },

  Post: {
    author: async (parent: { author: string }) => {
      return await User.findById(parent.author).select("-password -email");
    },
  },
};
