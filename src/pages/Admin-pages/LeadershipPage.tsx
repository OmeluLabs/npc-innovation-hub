/**
 * Leadership Page
 *
 * Admin page for deciding who appears as a Co-Founder, Leader or Member on
 * the public Members page.
 */

import React from "react";
import { Toaster } from "react-hot-toast";
import AdminLayout from "../../components/admin-components/AdminLayout";
import LeadershipManagement from "../../components/admin-components/LeadershipManagement";

const LeadershipPage: React.FC = () => (
  <>
    <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    <AdminLayout
      title={
        <div>
          <h1 className="font-bold text-2xl mb-2 text-navy-800 uppercase">
            Leadership
          </h1>
          <p className="text-sm text-mist-600">
            Set who appears as a Co-Founder, Leader or Member on the public
            Members page.
          </p>
        </div>
      }
    >
      <LeadershipManagement />
    </AdminLayout>
  </>
);

export default LeadershipPage;
