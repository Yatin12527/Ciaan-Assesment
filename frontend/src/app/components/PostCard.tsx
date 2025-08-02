import React from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Post } from "@/types";
import { IoTrashOutline } from "react-icons/io5";

interface PostCardProps {
  post: Post;
  isOwner?: boolean;
  onPostDelete?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  isOwner,
  onPostDelete,
}) => {
  const handleDeleteClick = () => {
    if (onPostDelete) {
      onPostDelete(post._id);
    }
  };

  return (
    <div className="relative bg-white p-5 rounded-xl shadow-sm border border-gray-200">
      {/* Card Header */}
      <div className="flex items-center mb-4">
        <Link href={`/profile/${post.author._id}`}>
          <img
            src={post.author.picture}
            alt={post.author.name}
            className="w-12 h-12 rounded-full mr-4 cursor-pointer"
          />
        </Link>
        <div className="flex-grow">
          <Link href={`/profile/${post.author._id}`}>
            <h4 className="font-bold text-gray-800 hover:underline cursor-pointer">
              {post.author.name}
            </h4>
          </Link>
          <p className="text-gray-500 text-sm">
            {format(new Date(post.createdAt), "EEEE p")}
          </p>
        </div>
      </div>

      {isOwner && onPostDelete && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-4 right-4 p-1 text-red-500 hover:text-red-600 rounded-full transition-colors"
          aria-label="Delete post"
        >
          <IoTrashOutline className="w-6 h-6" />
        </button>
      )}

      {/* Card Body */}
      <p className="text-gray-700 text-base whitespace-pre-wrap leading-relaxed">
        {post.content}
      </p>
    </div>
  );
};
