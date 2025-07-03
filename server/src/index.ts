import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import uploadRoutes from "./routes/upload";

// Imports for GraphQL schema and resolvers
import connectDB from "./config/connectDB";
import { typeDefs } from "./gql/typeDefs";
import { resolvers } from "./gql/resolvers";

export interface MyContext {
  token?: string;
}

async function startApolloServer() {
  dotenv.config();

  // Connect to the database
  await connectDB();

  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  // CORS Configuration - WICHTIG: Vor allen anderen Routes!
  const corsOptions = {
    origin: process.env.CORS_ORIGIN || "https://gql-blog.vercel.app",
    credentials: true,
  };

  // Global CORS middleware
  app.use(cors(corsOptions));

  // Body parser middleware for JSON and URL-encoded data
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Upload Routes - Nach CORS, aber vor GraphQL
  app.use("/upload", uploadRoutes);
  
  // GraphQL Middleware setup
  app.use(
    "/graphql",
    
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.token as string;
        return { token };
      },
    })
  );

  // Start the server
  const PORT = process.env.PORT || 4000;
  await new Promise<void>((resolve) => {
    httpServer.listen({ port: PORT }, resolve);
  });
  
}

startApolloServer().catch((error) => {
  console.error("Error starting Apollo Server:", error);
  process.exit(1);
});
