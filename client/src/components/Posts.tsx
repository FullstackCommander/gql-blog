import { gql, useQuery } from "@apollo/client";

import { Link } from "react-router-dom";

const GET_POSTS = gql`
  query GetAllPosts {
    getAllPosts {
      id
      title
      content
      image
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
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 p-4">
      <div className="flex flex-col gap-4 w-full md:w-3/4">
      {data.getAllPosts
        .slice()
        .sort(
        (a: any, b: any) =>
          Number(b.createdAt) - Number(a.createdAt)
        )
        .map((post: any) => (
        <article
          key={post.id}
          className="shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] gap-4 p-4 rounded-lg bg-base-300"
        >
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="text-sm text-gray-600">
          Author:{" "}
          <Link to={`/profile/${post.author.id}`}>
            {post.author.username}
          </Link>
          </p>
          {/* show only 200px in height of image but full width */}
          {post.image && post.image.trim() !== "" && (
          <img
            src={post.image}
            alt={post.title}
            className="post-image-clip rounded-lg mb-4"
          />
          )}
          <p>
          {post.content.length > 100
            ? post.content.substring(0, 100) + "..."
            : post.content}
            </p>
            <div className="flex items-center justify-between">
            <button className="btn btn-outline btn-secondary my-2" ><Link to={`/post/${post.id}`} >
  Read more →
</Link></button>
          <small className="text-gray-500">
          Created at:{" "}
          {post.createdAt
            ? new Date(Number(post.createdAt)).toLocaleDateString()
            : "Unknown date"}
          </small></div>
        </article>
        ))}
      </div>
    </div>
  );
}

export { GET_POSTS };