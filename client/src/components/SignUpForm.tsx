import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import uploadApi from "../api/axiosConfig";

const SIGNUP_MUTATION = gql`
  mutation RegisterUser(
    $username: String!
    $email: String!
    $password: String!
    $avatar: String
    $bio: String!
  ) {
    registerUser(
      username: $username
      email: $email
      password: $password
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

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bio, setBio] = useState("");

  const [registerUser, { loading, error, data }] = useMutation(SIGNUP_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let avatarUrl = null;

    if (avatarFile) {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      try {
        const res = await uploadApi.post("/upload/avatar", formData);
        // Entferne den redundanten Content-Type Header
        avatarUrl = res.data.url;
      } catch (uploadError) {
        console.error("Error uploading avatar:", uploadError);
        // Logge mehr Details
        if (
          typeof uploadError === "object" &&
          uploadError !== null &&
          "response" in uploadError &&
          typeof (uploadError as any).response === "object"
        ) {
          console.error("Upload error response:", (uploadError as any).response?.data);
          console.error("Upload error status:", (uploadError as any).response?.status);
        }
        return;
      }
    }

    try {
      await registerUser({
        variables: {
          username,
          email,
          password,
          avatar: avatarUrl,
          bio: bio || "No bio provided",
        },
      });
      alert("User registered successfully!");
    } catch (registerError) {
      console.error("Error registering user:", registerError);
      alert("Registration failed. Please try again.");
    }
    setUsername("");
    setEmail("");
    setPassword("");
    setAvatarFile(null);
    setBio("");
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={3}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
          }
        }}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
      {error && <p className="error">Error: {error.message}</p>}
      {data && <p className="success">User registered successfully!</p>}
    </form>
  );
}
