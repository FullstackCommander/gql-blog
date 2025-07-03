import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useAuth } from "../context/AuthContext";
import uploadApi from "../api/axiosConfig";
import toast from "react-hot-toast";

const UPDATE_USER = gql`
  mutation updateUser(
    $id: ID!
    $username: String!
    $email: String
    $avatar: String
    $bio: String
  ) {
    updateUser(
      id: $id
      username: $username
      email: $email
      avatar: $avatar
      bio: $bio
    ) {
      id
      username
      email
      avatar
      bio
    }
  }
`;

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

export default function EditProfile() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bio, setBio] = useState("");

  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { id: id || user?.id },
    skip: !user?.id && !id,
  });

  const [editUserProfile, { loading: editLoading, error: editError }] =
    useMutation(UPDATE_USER);

  useEffect(() => {
    if (data?.getUserById) {
      const profileUser = data.getUserById;
      setUsername(profileUser.username);
      setEmail(profileUser.email || "");
      setBio(profileUser.bio || "");
      setAvatarUrl(profileUser.avatar || null);
      setAvatarFile(null);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalAvatarUrl = avatarUrl;

    if (avatarFile) {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      try {
        const res = await uploadApi.post("/upload/avatar", formData);
        finalAvatarUrl = res.data.url;
      } catch (uploadError) {
        console.error("Error uploading avatar:", uploadError);
        toast.error("Avatar-Upload fehlgeschlagen.");
        return;
      }
    }

    try {
      await editUserProfile({
        variables: {
          id: id || user?.id,
          username,
          email,
          avatar: finalAvatarUrl,
          bio,
        },
      });
      toast.success("Profil erfolgreich aktualisiert!");
      navigate(`/profile/${id || user?.id}`); // Weiterleitung zum Profil
    } catch (err) {
      console.error("Fehler beim Aktualisieren des Profils:", err);
      toast.error("Fehler beim Aktualisieren des Profils.");
    }
  };

  if (loading) return <p>Lade Profil...</p>;
  if (error) return <p>Fehler: {error.message}</p>;

  return (
    <div>
      <h2>Profil bearbeiten</h2>
      <form onSubmit={handleSubmit}>
        {editError && <p className="error">Fehler: {editError.message}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          className="input input-bordered w-full max-w-xs outline-none focus:outline-none "
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* Aktuelles Avatarbild anzeigen, wenn kein neuer Upload */}
        {avatarUrl && !avatarFile && (
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{
              maxWidth: "150px",
              borderRadius: "50%",
              marginBottom: "10px",
            }}
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <button type="submit" disabled={editLoading}>
          {editLoading ? "Aktualisiere..." : "Profil aktualisieren"}
        </button>
      </form>
    </div>
  );
}
