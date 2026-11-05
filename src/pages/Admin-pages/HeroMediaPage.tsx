/**
 * Hero Media Page
 *
 * Admin page for managing the homepage hero background (images and/or
 * video) - upload, order, activate/deactivate, set default, and delete.
 */

import React from "react";
import { Toaster } from "react-hot-toast";
import AdminLayout from "../../components/admin-components/AdminLayout";
import HeroMediaManagement from "../../components/admin-components/HeroMediaManagement";

const HeroMediaPage: React.FC = () => {
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
              Homepage Hero Media
            </h1>
            <p className="text-sm text-mist-600">
              Manage the images and video shown as the homepage background.
            </p>
          </div>
        }
      >
        <HeroMediaManagement />
      </AdminLayout>
    </>
  );
};

export default HeroMediaPage;
