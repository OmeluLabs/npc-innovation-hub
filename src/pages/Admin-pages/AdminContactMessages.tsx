// src/pages/Admin-pages/AdminContactMessages.tsx
//
// Reached via the "Messages" sidebar entry -> the "Contact Messages"
// shortcut in AdminChatLeftPanel (alongside Hub Channel and Direct
// Messages). Same two-pane shell as AdminMessages.tsx/AdminHubChannel.tsx
// (left panel + main content), but the main content is ContactMessagesPanel
// instead of the live ChatShell - contact form submissions aren't a
// back-and-forth chat thread.
import React from "react";
import { Toaster } from "react-hot-toast";
import AdminChatLeftPanel from "../../components/chat/AdminChatLeftPanel";
import ContactMessagesPanel from "../../components/chat/ContactMessagesPanel";

const AdminContactMessages: React.FC = () => {
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
      <div className="flex gap-4 h-full min-h-0">
        <div className="hidden md:block md:flex-shrink-0">
          <AdminChatLeftPanel basePath="/admin" />
        </div>
        <div className="flex-1 min-w-0 min-h-0">
          <ContactMessagesPanel />
        </div>
      </div>
    </>
  );
};

export default AdminContactMessages;
