// src/components/layout/ViewAllButton.tsx
//
// The outlined "view all" button used under every landing-page preview grid.

import React from "react";

interface ViewAllButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const ViewAllButton: React.FC<ViewAllButtonProps> = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-lg border-2 border-primary px-8 py-3 text-base font-semibold text-primary transition-colors duration-200 hover:bg-primary hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
  >
    {children}
  </button>
);

export default ViewAllButton;
