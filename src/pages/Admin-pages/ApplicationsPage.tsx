/**
 * ApplicationsPage
 * Main admin page for reviewing membership applications
 */

import AdminLayout from "../../components/admin-components/AdminLayout";
import ApplicationsList from "../../components/admin-components/ApplicationsList";

export default function ApplicationsPage() {
  return (
    <AdminLayout
      title="Membership Applications"
      actions={
        <div className="text-sm text-ink-muted">
          Review and decide on Join Us applications
        </div>
      }
    >
      <ApplicationsList />
    </AdminLayout>
  );
}
