/**
 * HireUsRequests Page
 * Main admin page for managing hire inquiries
 */

import AdminLayout from "../../components/admin-components/AdminLayout";
import HireRequests from "../../components/admin-components/HireRequests";

export default function HireUsRequests() {
  return (
    <AdminLayout
      title="Hire Us Inquiries"
      actions={
        <div className="text-sm text-ink-muted">
          Manage and respond to client inquiries
        </div>
      }
    >
      <HireRequests />
    </AdminLayout>
  );
}
