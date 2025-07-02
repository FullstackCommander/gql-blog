import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import uploadApi from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

const CREATE_POST_MUTATION = gql`
  mutation CreatePost(
    $title: String!
    $content: String!
    $author: ID!
    $image: String
  ) {
    createPost(
      title: $title
      content: $content
      author: $author
      image: $image
    ) {
      id
      title
      content
      image
      createdAt
      author {
        id
        username
      }
    }
  }
`;

export default function CreatePost() {
  const { user } = useAuth();
  if (!user) {
    return <p>You must be logged in to create a post.</p>;
  }

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [createPost, { loading, error }] = useMutation(CREATE_POST_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = null;

    if (imageFile) {
      const formData = new FormData();
      formData.append("postimage", imageFile);

      try {
        const res = await uploadApi.post("/upload/post-image", formData);
        imageUrl = res.data.url;
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return;
      }
    }

    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    if (title.length < 5 || content.length < 10) {
      alert(
        "Title must be at least 5 characters and content at least 10 characters."
      );
      return;
    }

    if (title.length > 100) {
      alert("Title must not exceed 100 characters.");
      return;
    }

    if (imageFile && !imageUrl) {
      alert("Image upload failed. Please try again.");
      return;
    }

    // Ensure user ID is passed correctly
    const authorId = user;

    try {
      await createPost({
        variables: {
          title,
          content,
          author: authorId,
          image: imageUrl || null,
        },
      });

      alert("Post created successfully!");
      setTitle("");
      setContent("");
      setImageFile(null);
    } catch (createError) {
      console.error("Error creating post:", createError);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-form">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setImageFile(e.target.files ? e.target.files[0] : null)
        }
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Post"}
      </button>
      {error && <p>Error creating post: {error.message}</p>}
    </form>
  );
}
