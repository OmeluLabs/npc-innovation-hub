/**
 * BlogTables Page
 * Main admin page for blog management
 */

import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin-components/AdminLayout";
import BlogTable from "../../components/admin-components/BlogTable";
import { AddBlogModal } from "../../components/admin-components/AddBlogModal";
import { EditBlogModal } from "../../components/admin-components/EditBlogModal";
import { DeleteConfirmModal } from "../../components/admin-components/DeleteConfirmModal";
import { Toast, useToast } from "../../components/admin-components/Toast";
import { useBlogs } from "../../hooks/useBlogs";
import type { Blog } from "../../types/blog.types";

export default function BlogTables() {
  const {
    blogs,
    loading,
    error,
    fetchBlogs,
    handleCreateBlog,
    handleUpdateBlog,
    handleDeleteBlog,
    handleTogglePublish,
  } = useBlogs();

  const { toast, showToast, hideToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Handle create blog
  const handleCreate = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const data = {
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        summary: formData.get("summary") as string,
        category: formData.get("category") as string,
        isPublished: formData.get("isPublished") === "true",
      };
      const image = formData.get("image") as File | null;

      console.log("Submitting blog data:", data);

      const success = await handleCreateBlog(data, image);
      if (success) {
        setIsAddModalOpen(false);
        showToast("Blog created successfully!", "success");
      } else {
        // Error message is already set in the hook
        showToast(error || "Failed to create blog", "error");
      }
    } catch (err) {
      console.error("Unexpected error in handleCreate:", err);
      showToast("An unexpected error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit blog
  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (formData: FormData) => {
    if (!selectedBlog) return;

    setIsSubmitting(true);
    try {
      const data: Record<string, unknown> = {};
      const title = formData.get("title") as string;
      const content = formData.get("content") as string;
      const summary = formData.get("summary") as string;
      const category = formData.get("category") as string;
      const isPublished = formData.get("isPublished") === "true";

      if (title !== selectedBlog.title) data.title = title;
      if (content !== selectedBlog.content) data.content = content;
      if (summary !== selectedBlog.summary) data.summary = summary;
      if (category !== selectedBlog.category) data.category = category;
      if (isPublished !== selectedBlog.isPublished)
        data.isPublished = isPublished;

      const image = formData.get("image") as File | null;

      const success = await handleUpdateBlog(selectedBlog.id, data, image);
      if (success) {
        setIsEditModalOpen(false);
        setSelectedBlog(null);
        showToast("Blog updated successfully!", "success");
      } else {
        showToast(error || "Failed to update blog", "error");
      }
    } catch (err) {
      console.error("Unexpected error in handleUpdate:", err);
      showToast("An unexpected error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete blog
  const handleDeleteClick = (id: string) => {
    const blog = blogs.find((b) => b.id === id);
    if (blog) {
      setSelectedBlog(blog);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!selectedBlog) return;

    setIsSubmitting(true);
    try {
      const success = await handleDeleteBlog(selectedBlog.id);
      if (success) {
        setIsDeleteModalOpen(false);
        setSelectedBlog(null);
        showToast("Blog deleted successfully!", "success");
      } else {
        showToast(error || "Failed to delete blog", "error");
      }
    } catch (err) {
      console.error("Unexpected error in confirmDelete:", err);
      showToast("An unexpected error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle toggle publish
  const handleToggle = async (id: string) => {
    const success = await handleTogglePublish(id);
    if (success) {
      const blog = blogs.find((b) => b.id === id);
      const newStatus = blog?.isPublished ? "unpublished" : "published";
      showToast(`Blog ${newStatus} successfully!`, "success");
    } else {
      showToast(error || "Failed to update blog status", "error");
    }
  };

  return (
    <AdminLayout
      title="Blogs"
      actions={
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-white rounded-xl px-6 sm:px-10 py-3 font-bold text-lg shadow hover:bg-primary transition-all flex items-center gap-2 justify-center"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Blog
        </button>
      }
    >
      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Blog Table */}
      <BlogTable
        blogs={blogs}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onTogglePublish={handleToggle}
      />

      {/* Modals */}
      <AddBlogModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
      />

      <EditBlogModal
        isOpen={isEditModalOpen}
        blog={selectedBlog}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBlog(null);
        }}
        onSubmit={handleUpdate}
        isLoading={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Blog"
        message={`Are you sure you want to delete "${selectedBlog?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedBlog(null);
        }}
        isLoading={isSubmitting}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </AdminLayout>
  );
}
