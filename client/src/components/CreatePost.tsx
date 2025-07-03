import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import uploadApi from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GET_POSTS } from "./Posts";
import { GET_USER_POSTS } from "./Profile";
import toast from "react-hot-toast";

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
  const [createPost, { loading, error }] = useMutation(CREATE_POST_MUTATION, {
  refetchQueries: [{query: GET_POSTS}, {query: GET_USER_POSTS, variables: { userId: user.id }}],
});
  const navigate = useNavigate();

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
      toast.error("Title and content are required.");
      return;
    }

    if (title.length < 5 || content.length < 10) {
      toast.error(
        "Title must be at least 5 characters and content at least 10 characters."
      );
      return;
    }

    if (title.length > 100) {
      toast.error("Title must not exceed 100 characters.");
      return;
    }

    if (imageFile && !imageUrl) {
      toast.error("Image upload failed. Please try again.");
      return;
    }

    // Ensure user ID is passed correctly
    const authorId = user?.id;

    try {
      await createPost({
        variables: {
          title,
          content,
          author: authorId,
          image: imageUrl || null,
        },        
      });

      toast.success("Post created successfully!");
      setTitle("");
      setContent("");
      setImageFile(null);
      navigate("/"); // Redirect to home or posts page after creation
    } catch (createError) {
      console.error("Error creating post:", createError);
      toast.error("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-start p-4 space-y-2 w-full">
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          minLength={5}
        className="input input-bordered w-full max-w-xs outline-none focus:outline-none "
        required
      />
      <textarea
        placeholder="Content"
          value={content}
        className="textarea textarea-bordered w-full md:min-w-[800px] outline-none focus:outline-none"
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setImageFile(e.target.files ? e.target.files[0] : null)
        }
        className="file-input file-input-bordered w-full max-w-xs"
        placeholder="Upload an image (optional)"
      />
      <button type="submit" disabled={loading} className="btn btn-primary max-w-xs">
        {loading ? "Creating..." : "Create Post"}
      </button>
      {error && <p>Error creating post: {error.message}</p>}
    </form></div>
  );
}
