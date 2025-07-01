import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Query {
    users: [User!]
    user(id: ID!): User
    posts: [Post!]
    post(id: ID!): Post

    getUserPosts(userId: ID!): [Post!]
    getPosts: [Post!]
    getAllPosts: [Post!]
    getPostById(id: ID!): Post
    getUserProfile(id: ID!): User
    getAllUsers: [User!]
    getUserById(id: ID!): User
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
    bio: String
    createdAt: String!
    posts: [Post]
    token: String
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    author: User
    image: String
  }

  type Mutation {
    registerUser(
      username: String!
      email: String!
      avatar: String
      password: String!
      bio: String!
    ): User!

    updateUser(
      id: ID!
      username: String
      email: String
      avatar: String
      bio: String
    ): User!

    deleteUser(id: ID!): Boolean!

    loginUser(username: String!, password: String!): User!

    createPost(
      title: String!
      content: String!
      author: ID!
      image: String
    ): Post!

    updatePost(id: ID!, title: String, content: String): Post!
    deletePost(id: ID!): Boolean!
  }
`;
