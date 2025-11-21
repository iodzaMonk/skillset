import { memo } from "react";
import { Pencil, Trash2 } from "lucide-react";

import type { CommentItemProps } from "@/types/Comment";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function CommentItemBase({
  comment,
  depth,
  maxDepth,
  userId,
  activeMenuId,
  editingCommentId,
  editingValue,
  editError,
  replyMessage,
  replyError,
  replyingToId,
  isSavingEdit,
  isSubmittingReply,
  expandedThreads,
  editingRating,
  editingHoverRating,
  onToggleMenu,
  onStartEditing,
  onCancelEdit,
  onEditingValueChange,
  onSaveEdit,
  onDelete,
  onBeginReply,
  onCancelReply,
  onReplyChange,
  onSubmitReply,
  onToggleReplies,
  onEditingRatingSelect,
  onEditingRatingHover,
  onEditingRatingLeave,
}: CommentItemProps) {
  const isOwner = userId === comment.user_id;
  const isMenuOpen = activeMenuId === comment.id;
  const isEditing = editingCommentId === comment.id;
  const isReplying = replyingToId === comment.id;
  const replies = comment.replies ?? [];
  const hasReplies = replies.length > 0;
  const canRenderChildReplies = depth + 1 < maxDepth;
  const showReplyToggle = hasReplies && canRenderChildReplies;
  const isExpanded = showReplyToggle && expandedThreads.has(comment.id);
  const canReply = depth < maxDepth - 1;
  const authorName = comment.users?.name ?? "Anonymous";
  const dateLabel =
    comment.date && !Number.isNaN(Date.parse(comment.date))
      ? dateFormatter.format(new Date(comment.date))
      : null;
  const ratingValue = comment.rating ?? 0;
  const isTopLevel = !comment.parent_id;
  const editingStarValue = editingHoverRating || editingRating;

  const containerClasses =
    depth === 0
      ? "border-border/60 flex flex-col gap-3 rounded-md border p-4"
      : "border-border/40 bg-surface/60 ml-6 flex flex-col gap-3 rounded-md border p-4";

  return (
    <li className={containerClasses}>
      <div className="text-text-muted flex items-start gap-2 text-sm">
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-wrap items-center gap-5">
            <span className="text-text font-medium">{authorName}</span>
            {dateLabel ? <time className="text-xs">{dateLabel}</time> : null}
          </div>
          {!isEditing && ratingValue > 0 ? (
            <div className="flex items-center gap-1 text-yellow-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={index < ratingValue ? "currentColor" : "none"}
                  stroke="currentColor"
                  className="size-3"
                >
                  <path d="M12 2.25l2.902 6.084 6.718.977-4.81 4.69 1.136 6.632L12 16.75l-5.946 3.883 1.136-6.632-4.81-4.69 6.718-.977L12 2.25z" />
                </svg>
              ))}
            </div>
          ) : null}
          {isEditing ? (
            <>
              {isTopLevel ? (
                <div className="flex items-center gap-1 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                      key={index}
                      onClick={() => onEditingRatingSelect(index)}
                      onMouseEnter={() => onEditingRatingHover(index)}
                      onMouseLeave={onEditingRatingLeave}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={index < editingStarValue ? "currentColor" : "none"}
                      stroke="currentColor"
                      className="size-4 cursor-pointer"
                    >
                      <path d="M12 2.25l2.902 6.084 6.718.977-4.81 4.69 1.136 6.632L12 16.75l-5.946 3.883 1.136-6.632-4.81-4.69 6.718-.977L12 2.25z" />
                    </svg>
                  ))}
                </div>
              ) : null}
              <textarea
                value={editingValue}
                onChange={(event) => onEditingValueChange(event.target.value)}
                className="border-border focus:border-primary focus:ring-primary/30 min-h-20 w-full rounded-md border bg-transparent p-3 text-sm transition outline-none focus:ring"
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
              onClick={() => onToggleMenu(comment.id)}
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
            {isMenuOpen ? (
              <div className="bg-surface-2 absolute top-7 right-0 z-10 flex min-w-[140px] flex-col rounded-xl p-1 shadow-lg">
                <button
                  type="button"
                  className="hover:bg-accent flex w-full items-center gap-2 rounded-xl p-2 text-left text-sm transition"
                  onClick={() => onStartEditing(comment)}
                >
                  <Pencil size={16} />
                  Edit
                </button>
                <button
                  type="button"
                  className="hover:bg-accent flex w-full items-center gap-2 rounded-xl p-2 text-left text-sm transition"
                  onClick={() => onDelete(comment.id)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {isEditing ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="border-border text-text-muted hover:text-text inline-flex items-center rounded-md border px-3 py-1 text-xs font-medium transition disabled:opacity-60"
            onClick={onCancelEdit}
            disabled={isSavingEdit}
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-primary hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1 text-xs font-medium text-white transition disabled:opacity-60"
            onClick={() => onSaveEdit(comment.id)}
            disabled={
              isSavingEdit ||
              editingValue.trim().length === 0 ||
              (isTopLevel && editingRating <= 0)
            }
          >
            {isSavingEdit ? "Saving…" : "Update"}
          </button>
        </div>
      ) : userId && canReply ? (
        <button
          type="button"
          className="text-primary hover:text-primary/80 text-xs font-medium transition"
          onClick={() => onBeginReply(comment.id, depth)}
        >
          {isReplying ? "Cancel reply" : "Reply"}
        </button>
      ) : null}

      {isReplying ? (
        <form
          className="border-border focus-within:border-primary mt-3 flex flex-col gap-2 rounded-md border p-3"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitReply(comment.id);
          }}
        >
          <textarea
            value={replyMessage}
            onChange={(event) => onReplyChange(event.target.value)}
            className="min-h-20 resize-y bg-transparent text-sm outline-none"
            placeholder="Write your reply…"
            disabled={isSubmittingReply}
          />
          {replyError ? (
            <p className="text-error text-xs" role="alert">
              {replyError}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="border-border text-text-muted hover:text-text inline-flex items-center rounded-md border px-3 py-1 text-xs font-medium transition disabled:opacity-60"
              onClick={onCancelReply}
              disabled={isSubmittingReply}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1 text-xs font-medium text-white transition disabled:opacity-60"
              disabled={isSubmittingReply || replyMessage.trim().length === 0}
            >
              {isSubmittingReply ? "Replying…" : "Post Reply"}
            </button>
          </div>
        </form>
      ) : null}

      {showReplyToggle ? (
        <button
          type="button"
          className="text-text-muted hover:text-text mt-1 inline-flex items-center text-xs font-medium transition"
          onClick={() => onToggleReplies(comment.id)}
        >
          {isExpanded ? "Hide replies" : `Show replies (${replies.length})`}
        </button>
      ) : null}

      {isExpanded && canRenderChildReplies ? (
        <ul className="border-border/40 mt-4 space-y-3 border-l pl-4">
          {replies.map((child) => (
            <CommentItemBase
              key={child.id}
              comment={child}
              depth={depth + 1}
              maxDepth={maxDepth}
              userId={userId}
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
              onEditingRatingSelect={onEditingRatingSelect}
              onEditingRatingHover={onEditingRatingHover}
              onEditingRatingLeave={onEditingRatingLeave}
              onToggleMenu={onToggleMenu}
              onStartEditing={onStartEditing}
              onCancelEdit={onCancelEdit}
              onEditingValueChange={onEditingValueChange}
              onSaveEdit={onSaveEdit}
              onDelete={onDelete}
              onBeginReply={onBeginReply}
              onCancelReply={onCancelReply}
              onReplyChange={onReplyChange}
              onSubmitReply={onSubmitReply}
              onToggleReplies={onToggleReplies}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export const CommentItem = memo(CommentItemBase);
