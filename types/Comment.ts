export type CommentAuthor = {
  id: string;
  name: string | null;
};

export type Comment = {
  id: string;
  text: string;
  date: string | null;
  user_id: string;
  parent_id?: string | null;
  rating?: number | null;
  users?: CommentAuthor | null;
  replies?: Comment[];
};

export type CommentHandlers = {
  toggleMenu: (commentId: string) => void;
  startEditing: (comment: Comment) => void;
  handleCancelEdit: () => void;
  handleEditingValueChange: (value: string) => void;
  handleEdit: (commentId: string) => void;
  handleDelete: (commentId: string) => void;
  beginReply: (commentId: string, depth: number) => void;
  handleCancelReply: () => void;
  handleReplyValueChange: (value: string) => void;
  handleSubmitReply: (commentId: string) => void;
  toggleThreadVisibility: (commentId: string) => void;
  handleEditingRatingSelect: (index: number) => void;
  handleEditingRatingHover: (index: number) => void;
  handleEditingRatingLeave: () => void;
  onMessageChange: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void | Promise<void>;
  handleRatingSelect: (index: number) => void;
  handleRatingHover: (index: number) => void;
  handleRatingLeave: () => void;
};

export type CommentState = {
  activeMenuId: string | null;
  editingCommentId: string | null;
  editingValue: string;
  editError: string | null;
  replyMessage: string;
  replyError: string | null;
  replyingToId: string | null;
  isSavingEdit: boolean;
  isSubmittingReply: boolean;
  expandedThreads: Set<string>;
  editingRating: number;
  editingHoverRating: number;
};

export type CommentItemProps = {
  comment: Comment;
  depth: number;
  maxDepth: number;
  userId?: string;
  state: CommentState;
  handlers: CommentHandlers;
};
