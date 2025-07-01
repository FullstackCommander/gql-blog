import { gql, useQuery } from "@apollo/client";

const GET_POSTS = gql`
  query GetAllPosts {
    getAllPosts {
      id
      title
      content
      author {
        id
        username
  }
      createdAt
  }
}
`;

export default function Posts() {
  const { loading, error, data } = useQuery(GET_POSTS);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.getAllPosts.map((post: any) => (
        <article key={post.id} className="post">
          <h2>{post.title}</h2>
          <p>Author: {post.author.username}</p>
          <p>{post.content}</p>
          <small>Created at: {post.createdAt ? new Date(Number(post.createdAt)).toLocaleDateString() : "Unknown date"}</small>
        </article>
      ))}
    </div>
  );
};