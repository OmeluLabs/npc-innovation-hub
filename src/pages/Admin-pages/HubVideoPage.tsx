/**
 * Hub Video Page
 *
 * Admin page for uploading, replacing, and removing the intro video
 * shown on the public landing page.
 */

import React from "react";
import { Toaster } from "react-hot-toast";
import AdminLayout from "../../components/admin-components/AdminLayout";
import HubVideoManagement from "../../components/admin-components/HubVideoManagement";

const HubVideoPage: React.FC = () => {
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
              Hub Intro Video
            </h1>
            <p className="text-sm text-mist-600">
              Manage the intro video shown on the public landing page.
            </p>
          </div>
        }
      >
        <HubVideoManagement />
      </AdminLayout>
    </>
  );
};

export default HubVideoPage;
