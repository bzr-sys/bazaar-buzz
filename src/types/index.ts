import type { Doc, User } from "@bzr/bazaar";

// A post as stored in a user's `default_blog` collection.
export type Post = Doc & {
  text: string;
  ts: string | Date;
};

// A post with its author, as shown in the feed and on profiles.
export type FeedPost = Post & {
  author: User;
  mine: boolean;
};

export type Person = Pick<User, "id" | "name" | "handle">;

export type IconName =
  | "home"
  | "user"
  | "users"
  | "search"
  | "plus"
  | "globe"
  | "arrow-up"
  | "logout";
