"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { PostCard } from "@/app/components/PostCard";
import { useAuth } from "@/app/context/AuthContext";
import { EditProfileModal } from "@/app/components/EditProfileModal";
import { User, UserProfile } from "@/types";

export default function ProfilePage() {
  const params = useParams();
  const { userId } = params;
  const { user: loggedInUser } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userId) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get<UserProfile>(
            `${process.env.NEXT_PUBLIC_SERVER}/posts/profile/${userId}`
          );
          setProfile(response.data);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [userId]);

  const handleProfileUpdate = (updatedUser: User) => {
    if (profile) {
      setProfile({ ...profile, user: updatedUser });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_SERVER}/posts/${postId}`, {
        withCredentials: true,
      });
      if (profile) {
        const updatedPosts = profile.posts.filter(
          (post) => post._id !== postId
        );
        setProfile({ ...profile, posts: updatedPosts });
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("There was an error deleting the post.");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center py-10">User not found.</div>;
  }

  const isOwner = loggedInUser?.id === profile.user._id;

  return (
    <main className="min-h-screen">
      <div className="container mx-auto max-w-3xl p-8">
        <div className="relative bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="text-center">
            <img
              src={profile.user.picture}
              alt={profile.user.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
            />
            <h1 className="text-3xl font-bold">{profile.user.name}</h1>
            <p className="text-gray-600">{profile.user.username}</p>
            <p className="text-gray-800 mt-4 max-w-lg mx-auto">
              {profile.user.bio}
            </p>
          </div>
          {isOwner && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300"
            >
              Edit Profile
            </button>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-6">Posts</h2>
        <div className="space-y-6">
          {profile.posts.length > 0 ? (
            profile.posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                isOwner={isOwner}
                onPostDelete={handleDeletePost}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">
              This user has no posts yet.
            </p>
          )}
        </div>
      </div>

      {isEditing && profile && (
        <EditProfileModal
          user={profile.user}
          onClose={() => setIsEditing(false)}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </main>
  );
}
