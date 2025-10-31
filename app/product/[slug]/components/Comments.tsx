"use client";

import Link from "next/link";

import { useAuth } from "@/app/context/AuthContext";

import { CommentItem } from "./Comment";
import { MAX_REPLY_DEPTH, useComments } from "./useComments";
import { cn } from "@/lib/utils";

interface CommentsProps {
  productId: string;
}

export default function Comments({ productId }: CommentsProps) {
  const { user } = useAuth();

  const {
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
    onMessageChange,
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
  } = useComments({ productId, user });

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
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              depth={0}
              maxDepth={MAX_REPLY_DEPTH}
              userId={user?.id}
              activeMenuId={activeMenuId}
              editingCommentId={editingCommentId}
              editingValue={editingValue}
              editError={editError}
              replyMessage={replyMessage}
              replyError={replyError}
              replyingToId={replyingToId}
              isSavingEdit={isSavingEdit}
              isSubmittingReply={isSubmittingReply}
              expandedThreads={expandedThreads}
              editingRating={editingRating}
              editingHoverRating={editingHoverRating}
              onToggleMenu={toggleMenu}
              onStartEditing={startEditing}
              onCancelEdit={handleCancelEdit}
              onEditingValueChange={handleEditingValueChange}
              onSaveEdit={handleEdit}
              onDelete={handleDelete}
              onBeginReply={beginReply}
              onCancelReply={handleCancelReply}
              onReplyChange={handleReplyValueChange}
              onSubmitReply={handleSubmitReply}
              onToggleReplies={toggleThreadVisibility}
              onEditingRatingSelect={handleEditingRatingSelect}
              onEditingRatingHover={handleEditingRatingHover}
              onEditingRatingLeave={handleEditingRatingLeave}
            />
          ))}
        </ul>
      ) : (
        <p className="text-text-muted mb-6 text-sm">
          No comments yet. Be the first to share your thoughts.
        </p>
      )}

      {user ? (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm">
            <div className="flex gap-5">
              <span className="text-text font-medium">
                Leave a comment as {user.name ?? "you"}
              </span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  onClick={() => handleRatingSelect(i)}
                  onMouseEnter={() => handleRatingHover(i)}
                  onMouseLeave={handleRatingLeave}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  className={cn(
                    "size-4 cursor-pointer bg-transparent text-yellow-400 hover:fill-current",
                    i < (hoverRating || rating) ? "fill-current" : "fill-none",
                  )}
                >
                  <path d="M12 2.25l2.902 6.084 6.718.977-4.81 4.69 1.136 6.632L12 16.75l-5.946 3.883 1.136-6.632-4.81-4.69 6.718-.977L12 2.25z" />
                </svg>
              ))}
            </div>

            <textarea
              value={message}
              onChange={(event) => onMessageChange(event.target.value)}
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
              disabled={isSubmitting || rating === 0}
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
