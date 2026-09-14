export interface PostAuthor {
  id?: string;
  displayName: string;
  username: string;
  avatarUrl?: string | null;
  isAnonymous: boolean;
  quizVerified: boolean;
  role?: string;
}

export interface PostTag {
  id: string;
  name: string;
  slug: string;
}

export interface PollOption {
  id: string;
  optionText: string;
  votesCount: number;
  percentage: number;
}

export interface PostPoll {
  id: string;
  question: string;
  expiresAt: string;
  totalVotes: number;
  hasEnded: boolean;
  userVotedOptionId?: string | null;
  options: PollOption[];
}

export interface Post {
  id: string;
  content: string;
  contentWarning?: string | null;
  mediaUrls: string[];
  isAnonymous: boolean;
  author: PostAuthor;
  tags: PostTag[];
  poll?: PostPoll | null;
  communityNotes?: any[];
  likesCount: number;
  hugsCount: number;
  commentsCount: number;
  bookmarksCount: number;
  hasLiked?: boolean;
  hasSentHug?: boolean;
  hasBookmarked?: boolean;
  createdAt: string;
}
