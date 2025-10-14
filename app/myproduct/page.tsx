"use client";

import { useCallback, useState } from "react";

import { useAuth } from "../context/AuthContext";
import Modal from "./_components/Modal";
import { PostList } from "./_components/PostList";
import { usePostManager } from "./_hooks/postStates";
import type { PostBody } from "@/types/PostBody";

export default function ProductsPage() {
  const { user } = useAuth();
  const {
    posts,
    handleSubmit,
    isSubmitting,
    deletePosts,
    editingPost,
    startEditing,
    resetEditing,
    filePreview,
    handleFile,
  } = usePostManager({
    userId: user?.id,
  });

  const handleDeleteSelected = useCallback(
    (items: PostBody[]) => deletePosts(items),
    [deletePosts],
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const openCreateModal = useCallback(() => {
    handleFile(undefined);
    resetEditing();
    setIsCreateOpen(true);
  }, [handleFile, resetEditing]);

  return (
    <div className="space-y-6">
      <div className="flex w-full justify-end gap-4">
        <Modal
          isEditing={false}
          showTrigger={false}
          forceOpen={isCreateOpen}
          onFileChange={handleFile}
          filePreview={filePreview}
          onSubmit={async (event) => {
            const success = await handleSubmit(event);
            if (success) {
              resetEditing();
              setIsCreateOpen(false);
            }
            return success;
          }}
          isSubmitting={isSubmitting}
          onClose={() => {
            handleFile(undefined);
            resetEditing();
            setIsCreateOpen(false);
          }}
        />
        {editingPost && (
          <Modal
            isEditing
            showTrigger={false}
            initialValues={{
              id: editingPost.id,
              title: editingPost.title,
              description: editingPost.description,
              price: editingPost.price,
            }}
            onFileChange={handleFile}
            filePreview={filePreview}
            onSubmit={async (event) => {
              const success = await handleSubmit(event);
              if (success) {
                resetEditing();
                handleFile(undefined);
              }
              return success;
            }}
            isSubmitting={isSubmitting}
            onClose={() => {
              handleFile(undefined);
              resetEditing();
            }}
          />
        )}
      </div>

      <PostList
        posts={posts}
        onRequestDelete={handleDeleteSelected}
        onRequestEdit={(post) => {
          setIsCreateOpen(false);
          return startEditing(post);
        }}
        onRequestCreate={openCreateModal}
      />
    </div>
  );
}
