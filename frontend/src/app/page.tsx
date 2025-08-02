"use client";
import { CreatePostForm } from "@/app/components/CreatePostForm";
import { PostList } from "@/app/components/PostList.tsx";
import { useAuth } from "@/app/context/AuthContext";
import { Post } from "@/types";
import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<Post[]>(
          `${process.env.NEXT_PUBLIC_SERVER}/posts`
        );
        const validPosts = response.data.filter((post) => post.author);
        setPosts(validPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container w-full p-8 mt-8 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-between ">
        {/* Left Sidebar */}
        <aside className="md:col-span-1">
          {user ? (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center hidden sm:block">
              <Link href={`/profile/${user.id}`}>
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 cursor-pointer"
                />
              </Link>
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-500 truncate">{user.username}</p>
            </div>
          ) : (
            <img src="/graphic.png" className="hidden sm:block mt-23"></img>
          )}
        </aside>

        {/* Main Feed */}
        <main className="md:col-span-2 ">
          {user ? (
            <CreatePostForm onPostCreated={handlePostCreated} />
          ) : (
            <h1 className="mb-10 text-5xl font-semibold text-center ">Feed</h1>
          )}

          <PostList posts={posts} loading={postsLoading} />
        </main>
      </div>
    </div>
  );
}
