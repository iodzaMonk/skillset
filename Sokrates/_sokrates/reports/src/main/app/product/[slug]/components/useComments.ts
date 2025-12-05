"use client";

import axios from "axios";
import { FormEvent, useEffect, useMemo, useState } from "react";

import type { Comment } from "@/types/Comment";

const MAX_REPLY_DEPTH = 3;

type ReplyContext = {
  id: string;
  depth: number;
};

type UseCommentsArgs = {
  productId: string;
  user: { id: string } | null | undefined;
};

const updateCommentTree = (comments: Comment[], updated: Comment): Comment[] =>
  comments.map((comment) => {
    if (comment.id === updated.id) {
      const mergedReplies =
        updated.replies !== undefined
          ? updated.replies
          : comment.replies
            ? [...comment.replies]
            : undefined;

      return {
        ...comment,
        ...updated,
        replies: mergedReplies,
      };
    }

    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentTree(comment.replies, updated),
      };
    }

    return comment;
  });

const removeCommentFromTree = (comments: Comment[], id: string): Comment[] =>
  comments
    .filter((comment) => comment.id !== id)
    .map((comment) =>
      comment.replies && comment.replies.length > 0
        ? {
            ...comment,
            replies: removeCommentFromTree(comment.replies, id),
          }
        : comment,
    );

const insertReplyIntoTree = (
  comments: Comment[],
  parentId: string,
  reply: Comment,
): Comment[] =>
  comments.map((comment) => {
    if (comment.id === parentId) {
      const existingReplies = comment.replies ?? [];
      return {
        ...comment,
        replies: [...existingReplies, reply],
      };
    }

    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: insertReplyIntoTree(comment.replies, parentId, reply),
      };
    }

    return comment;
  });

const collectCommentIds = (items: Comment[]): Set<string> => {
  const ids = new Set<string>();
  const walk = (list: Comment[]) => {
    list.forEach((item) => {
      ids.add(item.id);
      if (item.replies && item.replies.length > 0) {
        walk(item.replies);
      }
    });
  };

  walk(items);
  return ids;
};

export const useComments = ({ productId, user }: UseCommentsArgs) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [replyContext, setReplyContext] = useState<ReplyContext | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(
    () => new Set(),
  );
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [editingRating, setEditingRating] = useState(0);
  const [editingHoverRating, setEditingHoverRating] = useState(0);
  const [editingParentId, setEditingParentId] = useState<string | null>(null);

  const replyingToId = replyContext?.id ?? null;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    axios
      .get<Comment[]>(`/api/product/${productId}/reviews`)
      .then((response) => {
        if (!cancelled) {
          setComments(response.data ?? []);
          setExpandedThreads(new Set());
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const fallback =
            err.response?.data?.message ?? "Unable to load comments";
          setLoadError(fallback);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const hasComments = useMemo(() => comments.length > 0, [comments]);

  const handleMessageChange = (value: string) => {
    setMessage(value);
    if (formError) setFormError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = message.trim();

    if (!user) {
      setFormError("You need to be signed in to leave a comment.");
      return;
    }

    if (!trimmed) {
      setFormError("Comment cannot be empty.");
      return;
    }

    if (rating <= 0 || rating > 5) {
      setFormError("Please select a star rating.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      setActionError(null);
      const response = await axios.post<Comment>(
        `/api/product/${productId}/reviews`,
        {
          text: trimmed,
          rating,
        },
      );

      setComments((prev) => [response.data, ...prev]);
      setMessage("");
      setRating(0);
      setHoverRating(0);
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Unable to submit comment.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMenu = (commentId: string) => {
    setActiveMenuId((prev) => (prev === commentId ? null : commentId));
  };

  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingValue(comment.text);
    setEditError(null);
    setActionError(null);
    setActiveMenuId(null);
    setReplyContext(null);
    setReplyMessage("");
    setReplyError(null);
    setEditingParentId(comment.parent_id ?? null);
    const initialRating = comment.parent_id ? 0 : (comment.rating ?? 0);
    setEditingRating(initialRating);
    setEditingHoverRating(initialRating);
  };

  const handleCancelEdit = () => {
    if (isSavingEdit) return;
    setEditingCommentId(null);
    setEditingValue("");
    setEditError(null);
    setActionError(null);
    setReplyContext(null);
    setReplyMessage("");
    setReplyError(null);
    setEditingParentId(null);
    setEditingRating(0);
    setEditingHoverRating(0);
  };

  const handleEditingValueChange = (value: string) => {
    setEditingValue(value);
    if (editError) setEditError(null);
    if (actionError) setActionError(null);
  };

  const handleReplyValueChange = (value: string) => {
    setReplyMessage(value);
    if (replyError) setReplyError(null);
    if (actionError) setActionError(null);
  };

  const handleEdit = async (commentId: string) => {
    const trimmed = editingValue.trim();

    if (!trimmed) {
      setEditError("Comment cannot be empty.");
      return;
    }

    const isTopLevelEditing = editingParentId === null;

    if (isTopLevelEditing) {
      if (editingRating <= 0 || editingRating > 5) {
        setEditError("Please select a star rating.");
        return;
      }
    }

    try {
      setIsSavingEdit(true);
      setEditError(null);
      setActionError(null);

      const payload: { id: string; text: string; rating?: number | null } = {
        id: commentId,
        text: trimmed,
      };

      if (isTopLevelEditing) {
        payload.rating = editingRating;
      }

      const response = await axios.patch<Comment>(
        `/api/product/${productId}/reviews`,
        payload,
      );

      setComments((prev) => updateCommentTree(prev, response.data));
      setEditingCommentId(null);
      setEditingValue("");
      setActionError(null);
      setEditingParentId(null);
      setEditingRating(0);
      setEditingHoverRating(0);
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Unable to update comment.";
      setEditError(message);
      setActionError(message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      setActionError(null);
      setEditError(null);
      setActiveMenuId(null);

      await axios.delete(`/api/product/${productId}/reviews`, {
        data: { id: commentId },
      });

      let updatedTree: Comment[] = [];
      setComments((prev) => {
        const nextTree = removeCommentFromTree(prev, commentId);
        updatedTree = nextTree;
        return nextTree;
      });

      if (replyContext?.id === commentId) {
        setReplyContext(null);
        setReplyMessage("");
        setReplyError(null);
      }

      setExpandedThreads((prev) => {
        if (!prev.size) return prev;
        const validIds = collectCommentIds(updatedTree);
        const next = new Set<string>();
        prev.forEach((id) => {
          if (validIds.has(id)) next.add(id);
        });
        return next;
      });
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Unable to delete comment.";
      setActionError(message);
    }
  };

  const beginReply = (commentId: string, depth: number) => {
    if (!user) {
      setActionError("You need to be signed in to leave a reply.");
      return;
    }

    if (depth >= MAX_REPLY_DEPTH - 1) {
      setActionError("Maximum reply depth reached.");
      return;
    }

    if (replyContext?.id === commentId) {
      if (!isSubmittingReply) {
        setReplyContext(null);
        setReplyMessage("");
        setReplyError(null);
      }
      return;
    }

    setReplyContext({ id: commentId, depth });
    setReplyMessage("");
    setReplyError(null);
    setActionError(null);
    setActiveMenuId(null);
    setEditingCommentId(null);
    setEditingValue("");
    setEditError(null);

    setExpandedThreads((prev) => {
      if (prev.has(commentId)) return prev;
      const next = new Set(prev);
      next.add(commentId);
      return next;
    });
  };

  const handleCancelReply = () => {
    if (isSubmittingReply) return;
    setReplyContext(null);
    setReplyMessage("");
    setReplyError(null);
  };

  const handleSubmitReply = async (commentId: string) => {
    const target = replyContext;
    if (!target || target.id !== commentId) return;

    const trimmed = replyMessage.trim();

    if (!trimmed) {
      setReplyError("Reply cannot be empty.");
      return;
    }

    if (!user) {
      setReplyError("You need to be signed in to reply.");
      return;
    }

    if (target.depth >= MAX_REPLY_DEPTH - 1) {
      setReplyError("Maximum reply depth reached.");
      return;
    }

    try {
      setIsSubmittingReply(true);
      setReplyError(null);
      setActionError(null);

      const response = await axios.post<Comment>(
        `/api/product/${productId}/reviews`,
        {
          text: trimmed,
          parentId: commentId,
        },
      );

      setComments((prev) =>
        insertReplyIntoTree(prev, commentId, response.data),
      );
      setReplyContext(null);
      setReplyMessage("");

      setExpandedThreads((prev) => {
        const next = new Set(prev);
        next.add(commentId);
        return next;
      });
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Unable to submit reply.";
      setReplyError(message);
      setActionError(message);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const toggleThreadVisibility = (commentId: string) => {
    setExpandedThreads((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  const handleRatingSelect = (index: number) => {
    const value = index + 1;
    setRating(value);
    setHoverRating(value);
    if (formError) setFormError(null);
  };

  const handleRatingHover = (index: number) => {
    setHoverRating(index + 1);
  };

  const handleRatingLeave = () => {
    setHoverRating(rating);
  };

  const handleEditingRatingSelect = (index: number) => {
    const value = index + 1;
    setEditingRating(value);
    setEditingHoverRating(value);
    if (editError) setEditError(null);
  };

  const handleEditingRatingHover = (index: number) => {
    setEditingHoverRating(index + 1);
  };

  const handleEditingRatingLeave = () => {
    setEditingHoverRating(editingRating);
  };

  return {
    comments,
    hasComments,
    isLoading,
    loadError,
    actionError,
    formError,
    message,
    isSubmitting,
    activeMenuId,
    editingCommentId,
    editingValue,
    editError,
    isSavingEdit,
    replyingToId,
    replyMessage,
    replyError,
    isSubmittingReply,
    expandedThreads,
    rating,
    hoverRating,
    editingRating,
    editingHoverRating,
    onMessageChange: handleMessageChange,
    handleSubmit,
    toggleMenu,
    startEditing,
    handleCancelEdit,
    handleEditingValueChange,
    handleEdit,
    handleDelete,
    beginReply,
    handleCancelReply,
    handleReplyValueChange,
    handleSubmitReply,
    toggleThreadVisibility,
    handleRatingSelect,
    handleRatingHover,
    handleRatingLeave,
    handleEditingRatingSelect,
    handleEditingRatingHover,
    handleEditingRatingLeave,
  };
};

export { MAX_REPLY_DEPTH };
