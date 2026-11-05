/**
 * Member Management Page (Updated)
 *
 * Admin page for managing all users in the system.
 * Uses the new MembersManagement component with API integration.
 */

import React from "react";
import { Toaster } from "react-hot-toast";
import AdminLayout from "../../components/admin-components/AdminLayout";
import MembersManagement from "../../components/admin-components/MembersManagement";

// ==================== COMPONENT ====================

const MemberManagement: React.FC = () => {
  return (
    <>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgb(var(--color-surface))",
            color: "rgb(var(--color-primary))",
            boxShadow:
              "0 4px 6px -1px rgb(var(--color-primary) / 0.1), 0 2px 4px -1px rgb(var(--color-primary) / 0.06)",
          },
          success: {
            iconTheme: {
              primary: "rgb(var(--color-success))",
              secondary: "rgb(var(--color-surface))",
            },
          },
          error: {
            iconTheme: {
              primary: "rgb(var(--color-danger))",
              secondary: "rgb(var(--color-surface))",
            },
          },
        }}
      />

      <AdminLayout>
        <MembersManagement />
      </AdminLayout>
    </>
  );
};

export default MemberManagement;
