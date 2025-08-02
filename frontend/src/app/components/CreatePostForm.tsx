"use client";
import { useAuth } from "@/app/context/AuthContext";
import { Post } from "@/types";
import axios from "axios";
import React, { useState } from "react";

interface CreatePostFormProps {
  onPostCreated: (newPost: Post) => void;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({
  onPostCreated,
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Post cannot be empty.");
      return;
    }

    try {
      const response = await axios.post<Post>(
        `${process.env.NEXT_PUBLIC_SERVER}/posts`,
        { content },
        { withCredentials: true }
      );
      onPostCreated(response.data);
      setContent("");
      setError("");
    } catch (err) {
      setError("Failed to create post. Please try again.");
      console.error(err);
    }
  };
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-8">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4">
          <img
            src={user?.picture}
            alt={user?.name}
            className="w-12 h-12 rounded-full"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="What's on your mind?"
            rows={4}
          ></textarea>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-2 text-right">{error}</p>
        )}

        <div className="text-right mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};
