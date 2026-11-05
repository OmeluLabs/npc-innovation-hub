// src/components/resources/ProjectDeleteModal.tsx
import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface Props {
  projectTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ProjectDeleteModal: React.FC<Props> = ({
  projectTitle,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-primary">Delete Project</h3>
        </div>

        <p className="text-sm text-ink-muted mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-primary">"{projectTitle}"</span>?
          This action cannot be undone.
        </p>

        <div className="dialog-actions flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-primary bg-surface-muted hover:bg-line rounded-lg transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDeleteModal;
