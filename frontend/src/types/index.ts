export interface User {
  _id: string;
  name: string;
  username: string; 
  picture: string;
  bio: string;
}

export interface Post {
  _id: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface UserProfile {
  user: User;
  posts: Post[];
}