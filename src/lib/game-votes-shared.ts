export const VOTER_COOKIE = "zenfun-voter-id";
export const VOTER_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type UserVote = "like" | "dislike" | null;

export type GameVoteStats = {
  likes: number;
  dislikes: number;
  userVote: UserVote;
};
