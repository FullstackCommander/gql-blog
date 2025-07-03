import { useParams, Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useAuth } from "../context/AuthContext";

const GET_USER_BY_ID = gql`
  query GetUser($id: ID!) {
    getUserById(id: $id) {
      id
      username
      email
      avatar
      bio
    }
  }
`;

const GET_USER_POSTS = gql`
  query GetUserPosts($userId: ID!) {
    getUserPosts(userId: $userId) {
      id
      title
      content
      image
      createdAt
    }
  }
`;

function UserPosts({ userId }: { userId: string }) {
  const { data, loading, error } = useQuery(GET_USER_POSTS, {
    variables: { userId },
    skip: !userId,
  });

  if (loading) return <p>Lade Beiträge...</p>;
  if (error) return <p>Fehler beim Laden der Beiträge: {error.message}</p>;
  if (!data?.getUserPosts?.length) return <p>Keine Beiträge gefunden.</p>;

  return (
    <ul className="list-none p-0 space-y-4 flex flex-col md:flex-row md:flex-wrap md:space-y-0 md:space-x-4 items-center md:justify-center gap-4">
      {data.getUserPosts.slice().sort((a: any, b: any) =>
          Number(b.createdAt) - Number(a.createdAt)).map((post: any) => (
        <li
          key={post.id}
          className="w-full md:w-96 flex-shrink-0 "
        >
          <div className="flex flex-col md:flex-row h-full rounded-lg bg-base-300 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            {post.image && post.image.trim() !== "" && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full md:w-48 h-48 object-cover rounded-t-lg md:rounded-tl-lg md:rounded-bl-lg md:rounded-tr-none"
              />
            )}
            <div className="flex flex-col justify-between flex-1 p-4">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p>
                {/* Trim the content to a max of 100 letters */}
                {post.content.length > 50
                  ? post.content.substring(0, 50) + "..."
                  : post.content}
              </p>
              <div className="flex flex-col items-end justify-center">
            <button className="btn btn-outline btn-secondary my-2" ><Link to={`/post/${post.id}`} >
  Read more →
</Link></button>
          <small className="text-gray-500">
          Created at:{" "}
          {post.createdAt
            ? new Date(Number(post.createdAt)).toLocaleDateString()
            : "Unknown date"}
          </small></div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const profileId = id || user?.id;
  const isOwnProfile = !id || id === user?.id;

  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { id: profileId },
    skip: !profileId,
  });

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.getUserById) return <p>No User found.</p>;

  const profileUser = data.getUserById;

  return (
    <div className="flex flex-col items-center p-4 space-y-2 w-full">
      <h2 className="mb-8">
        {isOwnProfile ? "My Profile" : `${profileUser.username}'s Profil`}
      </h2>
      <img
        src={profileUser.avatar}
        alt="avatar"
        width={200}
        className="rounded-full border-4"
      />
      <p className="text-xl">
        <strong>{profileUser.username}</strong>{" "}
      </p>
      <p>
        <strong>Bio:</strong> {profileUser.bio}
      </p>

      {isOwnProfile && (
        <div className="flex space-x-4 mt-4">
          <button className="btn">
            <Link to={`/edit-profile`}>Edit profile</Link>
          </button>
          <button className="btn">
            <Link to="/create-post">Create new Post</Link>
          </button>
        </div>
      )}

      <h3 className="text-2xl font-semibold mt-8">Posts made by {profileUser.username}:</h3>
      <div>
        <UserPosts userId={profileId!} />
      </div>
    </div>
  );
}

export { GET_USER_POSTS };