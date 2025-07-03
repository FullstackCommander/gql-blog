import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LOGIN_MUTATION = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      username
      token
      id
    }
  }
`;

export default function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [loginUser, { loading, error }] = useMutation(LOGIN_MUTATION);



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await loginUser({ variables: { username, password } });

    const { token, id, username: uname, email, avatar, bio } = response.data.loginUser;

    login({
      token,
      user: { id, username: uname, email, avatar, bio },
    });

    toast.success("Login successful!");
    navigate("/profile");
  } catch (err) {
    console.error("Login error:", err);
    toast.error("Login failed.");
  }

  setUsername("");
  setPassword("");
  };
  
  return (
    <div className="flex flex-col items-center p-4 space-y-2 w-full">
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <h2>Login</h2>
      {error && <p className="error">Error: {error.message}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
          onChange={(e) => setUsername(e.target.value)}
        className="input input-bordered w-full max-w-xs outline-none focus:outline-none"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
          onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered w-full max-w-xs outline-none focus:outline-none"
        required
      />
      <button type="submit" disabled={loading} className="btn btn-primary max-w-xs">
        {loading ? "Logging in..." : "Login"}
      </button>
    </form></div>
  );
}
