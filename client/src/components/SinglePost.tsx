import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

const GET_SINGLE_POST = gql`
  query GetPostById($id: ID!) {
    getPostById(id: $id) {
      id
      title
      content
      image
      createdAt
      author {
        username
        id
      }
    }
  }
`;

export default function SinglePost() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_SINGLE_POST, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <p>Lade Beitrag...</p>;
  if (error) return <p>Fehler: {error.message}</p>;
  if (!data?.getPostById) return <p>Beitrag nicht gefunden.</p>;

  const post = data.getPostById;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-600 mb-4">
        Von <span className="font-medium">{post.author.username}</span> am{" "}
        {new Date(Number(post.createdAt)).toLocaleDateString()}
      </p>
      {post.image && (
        <img src={post.image} alt={post.title} className="rounded-lg mb-4" />
      )}
      <p className="text-lg">{post.content}</p>
    </div>
  );
}
