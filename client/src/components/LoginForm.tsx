import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import {useAuth} from "../context/AuthContext";

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

  const [loginUser, { loading, error }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await loginUser({ variables: { username, password } });
    const token = response.data.loginUser.token;
    const usernameLoggedIn = response.data.loginUser.username;
    const id = response.data.loginUser.id;

    login(token, id, usernameLoggedIn); // speichern im Context + localStorage

    alert("Login successful!");
  } catch (err) {
    alert("Login failed.");
    }
  setUsername("");
  setPassword("");
};

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p className="error">Error: {error.message}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
