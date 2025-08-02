"use client";
import React from "react";
import { PostCard } from "./PostCard";
import { Post } from "@/types";

interface PostListProps {
  posts: Post[];
  loading: boolean;
}

export const PostList: React.FC<PostListProps> = ({ posts, loading }) => {
  if (loading) {
    return <p className="text-center text-gray-500">Loading posts...</p>;
  }

  if (posts.length === 0) {
    return (
      <p className="text-center text-gray-500">No posts have been made yet.</p>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};
