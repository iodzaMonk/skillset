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

export type CommentItemProps = {
  comment: Comment;
  depth: number;
  maxDepth: number;
  userId?: string;
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
  onToggleMenu: (commentId: string) => void;
  onStartEditing: (comment: Comment) => void;
  onCancelEdit: () => void;
  onEditingValueChange: (value: string) => void;
  onSaveEdit: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onBeginReply: (commentId: string, depth: number) => void;
  onCancelReply: () => void;
  onReplyChange: (value: string) => void;
  onSubmitReply: (commentId: string) => void;
  onToggleReplies: (commentId: string) => void;
  onEditingRatingSelect: (index: number) => void;
  onEditingRatingHover: (index: number) => void;
  onEditingRatingLeave: () => void;
};
