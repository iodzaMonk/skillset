"use client";

import axios from "axios";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/app/context/AuthContext";

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

  return (
    <section className="border-border bg-surface/80 mx-auto mt-10 w-full max-w-4xl rounded-lg border p-6 shadow-sm">
      <header className="mb-6">
        <h2 className="text-text text-2xl font-semibold">Comments</h2>
        <p className="text-text-muted mt-1 text-sm">
          Join the conversation or see what others are saying.
        </p>
      </header>

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

            return (
              <li
                key={comment.id}
                className="border-border/60 flex flex-col gap-2 rounded-md border p-4"
              >
                <div className="text-text-muted flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="text-text font-medium">{authorName}</span>
                  {date ? <time className="text-xs">{date}</time> : null}
                </div>
                <p className="text-text text-sm leading-6 whitespace-pre-wrap">
                  {comment.text}
                </p>
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
