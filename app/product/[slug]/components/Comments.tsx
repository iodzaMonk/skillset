"use client";

import axios from "axios";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/app/context/AuthContext";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type CommentAuthor = {
  id: string;
  name: string | null;
};

type Comment = {
  id: string;
  text: string;
  date: string | null;
  user_id: string;
  users?: CommentAuthor | null;
};

interface CommentsProps {
  productId: string;
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function Comments({ productId }: CommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    axios
      .get<Comment[]>(`/api/product/${productId}/reviews`)
      .then((response) => {
        if (!cancelled) {
          setComments(response.data ?? []);
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

    try {
      setIsSubmitting(true);
      setFormError(null);
      setActionError(null);
      const response = await axios.post<Comment>(
        `/api/product/${productId}/reviews`,
        {
          text: trimmed,
        },
      );

      setComments((prev) => [response.data, ...prev]);
      setMessage("");
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
  };

  const handleCancelEdit = () => {
    if (isSavingEdit) return;
    setEditingCommentId(null);
    setEditingValue("");
    setEditError(null);
    setActionError(null);
  };

  const handleEdit = async (commentId: string) => {
    const trimmed = editingValue.trim();

    if (!trimmed) {
      setEditError("Comment cannot be empty.");
      return;
    }

    try {
      setIsSavingEdit(true);
      setEditError(null);
      setActionError(null);

      const response = await axios.patch<Comment>(
        `/api/product/${productId}/reviews`,
        {
          id: commentId,
          text: trimmed,
        },
      );

      setComments((prev) =>
        prev.map((existing) =>
          existing.id === commentId ? response.data : existing,
        ),
      );
      setEditingCommentId(null);
      setEditingValue("");
      setActionError(null);
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
      setOpenDelete(false);

      await axios.delete(`/api/product/${productId}/reviews`, {
        data: { id: commentId },
      });

      setComments((prev) =>
        prev.filter((existing) => existing.id !== commentId),
      );

      if (editingCommentId === commentId) {
        setEditingCommentId(null);
        setEditingValue("");
      }
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Unable to delete comment.";
      setActionError(message);
    }
  };

  return (
    <section className="border-border bg-surface/80 mx-auto mt-10 w-full max-w-4xl rounded-lg border p-6 shadow-sm">
      <header className="mb-6">
        <h2 className="text-text text-2xl font-semibold">Comments</h2>
        <p className="text-text-muted mt-1 text-sm">
          Join the conversation or see what others are saying.
        </p>
      </header>

      {actionError ? (
        <p className="text-error mb-4 text-sm" role="alert">
          {actionError}
        </p>
      ) : null}

      {isLoading ? (
        <p className="text-text-muted">Loading comments…</p>
      ) : loadError ? (
        <p className="text-error mb-6 text-sm" role="alert">
          {loadError}
        </p>
      ) : hasComments ? (
        <ul className="mb-6 space-y-4">
          {comments.map((comment) => {
            const date =
              comment.date && !Number.isNaN(Date.parse(comment.date))
                ? dateFormatter.format(new Date(comment.date))
                : null;
            const authorName = comment.users?.name ?? "Anonymous";
            const isOwner = user?.id === comment.user_id;
            const isMenuOpen = activeMenuId === comment.id;
            const isEditing = editingCommentId === comment.id;

            return (
              <li
                key={comment.id}
                className="border-border/60 flex flex-col gap-2 rounded-md border p-4"
              >
                <div className="flex flex-col gap-3">
                  <div className="text-text-muted flex items-start justify-between gap-2 text-sm">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-5">
                        <span className="text-text font-medium">
                          {authorName}
                        </span>
                        {date ? <time className="text-xs">{date}</time> : null}
                      </div>
                      {isEditing ? (
                        <>
                          <input
                            value={editingValue}
                            onChange={(event) => {
                              setEditingValue(event.target.value);
                              if (editError) setEditError(null);
                            }}
                            className="w-full p-3 text-sm transition outline-none"
                            aria-label="Edit comment"
                            disabled={isSavingEdit}
                          />
                          <div className="h-px w-full bg-white/90" />
                          {editError ? (
                            <p className="text-error text-xs" role="alert">
                              {editError}
                            </p>
                          ) : null}
                        </>
                      ) : (
                        <p className="text-text text-sm leading-6 whitespace-pre-wrap">
                          {comment.text}
                        </p>
                      )}
                    </div>
                    {isOwner ? (
                      <div className="relative ml-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleMenu(comment.id)}
                          className="text-text hover:text-text/80 rounded-full p-1 transition"
                          aria-label="Open comment actions"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 0 24 24"
                            width="24"
                            focusable="false"
                            aria-hidden="true"
                            className="pointer-events-none"
                            fill="currentColor"
                          >
                            <path d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z" />
                          </svg>
                        </button>

                        {isMenuOpen && (
                          <div className="bg-surface-2 absolute top-7 right-0 z-10 flex min-w-[140px] flex-col rounded-xl p-1 shadow-lg">
                            <button
                              type="button"
                              className="hover:bg-accent flex w-full items-center gap-2 rounded-xl p-2 text-left text-sm transition"
                              onClick={() => startEditing(comment)}
                            >
                              <Pencil size={16} />
                              Edit
                            </button>
                            <button
                              type="button"
                              className="hover:bg-accent flex w-full items-center gap-2 rounded-xl p-2 text-left text-sm transition"
                              onClick={() => setOpenDelete(true)}
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                  {openDelete && (
                    <div className="bg-surface-2 fixed inset-0 mx-auto my-auto h-fit w-fit rounded-2xl p-5">
                      <p className="text-2xl leading-12">Delete comment</p>
                      <p className="text-text-muted leading-12">
                        Delete your comment permanently?
                      </p>
                      <div className="flex justify-end gap-5">
                        <Button
                          variant="cancel"
                          onClick={() => setOpenDelete(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="delete"
                          onClick={() => handleDelete(comment.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                  {isEditing ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="border-border text-text-muted hover:text-text inline-flex items-center rounded-md border px-3 py-1 text-xs font-medium transition disabled:opacity-60"
                        onClick={handleCancelEdit}
                        disabled={isSavingEdit}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="bg-primary hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1 text-xs font-medium text-white transition disabled:opacity-60"
                        onClick={() => handleEdit(comment.id)}
                        disabled={
                          isSavingEdit || editingValue.trim().length === 0
                        }
                      >
                        {isSavingEdit ? "Saving…" : "Update"}
                      </button>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-text-muted mb-6 text-sm">
          No comments yet. Be the first to share your thoughts.
        </p>
      )}

      {user ? (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-text font-medium">
              Leave a comment as {user.name ?? "you"}
            </span>
            <textarea
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                if (formError) setFormError(null);
              }}
              className="border-border focus:border-primary focus:ring-primary/30 min-h-[120px] rounded-md border bg-transparent p-3 text-sm transition outline-none focus:ring"
              placeholder="Share your experience or ask a question…"
              disabled={isSubmitting}
            />
          </label>
          {formError ? (
            <p className="text-error text-sm" role="alert">
              {formError}
            </p>
          ) : null}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting…" : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="border-border/60 text-text flex flex-col gap-2 rounded-md border p-4 text-sm">
          <p>You need to be signed in to leave a comment.</p>
          <Link
            href="/auth/login"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Log in to join the discussion
          </Link>
          {formError ? (
            <p className="text-error" role="alert">
              {formError}
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
