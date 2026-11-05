/**
 * Hero Members Page
 *
 * Admin page for managing which members are featured in the landing
 * page hero section, and in what order.
 */

import React from "react";
import { Toaster } from "react-hot-toast";
import AdminLayout from "../../components/admin-components/AdminLayout";
import HeroMembersManagement from "../../components/admin-components/HeroMembersManagement";

const HeroMembersPage: React.FC = () => {
  return (
    <>
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

      <AdminLayout
        title={
          <div>
            <h1 className="font-bold text-2xl mb-2 text-navy-800 uppercase">
              Hero Members
            </h1>
            <p className="text-sm text-mist-600">
              Manage which members appear in the landing page hero section.
            </p>
          </div>
        }
      >
        <HeroMembersManagement />
      </AdminLayout>
    </>
  );
};

export default HeroMembersPage;
