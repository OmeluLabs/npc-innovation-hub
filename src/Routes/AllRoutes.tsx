// src/Routes/AllRoutes.tsx
//
// Every route element below is lazy-loaded (React.lazy + Suspense), so a
// visitor only downloads the code for the page they're actually on instead
// of the whole app - the entire admin dashboard (recharts included),
// member dashboard, and every other page used to ship in one ~1.45MB/
// 383KB-gzip bundle on the very first request, homepage included. Footer,
// Navbar, and the two route guards stay eager: they render on (almost)
// every route, so lazy-loading them would just add a loading flicker for
// no bundle-size benefit.

import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Footer from "../components/button/Footer";
import Navbar from "../components/Navbar";
import { ProtectedRoute, PublicRoute } from "../components/ProtectedRoute";

const LoginPage = lazy(() => import("../pages/Login/LoginPage"));
const HubMembersSection = lazy(
  () => import("../pages/landing/HubMembersSection"),
);
const HeroSection = lazy(() => import("../pages/landing/HeroSection"));
const Offerings = lazy(() => import("../pages/landing/Offerings"));
const HubIntroVideo = lazy(() => import("../pages/landing/HubIntroVideo"));
const PublicEventsPage = lazy(
  () => import("../pages/events-page/PublicEventsPage"),
);
const ContactUs = lazy(() => import("../pages/landing/ContactUs"));
const ContactSection = lazy(() => import("../pages/landing/ContactSection"));
const ProjectsPage = lazy(() => import("../pages/project-page/ProjectsPage"));
const ProjectsShowcase = lazy(
  () => import("../pages/landing/ProjectsShowcase"),
);
const BlogShowcase = lazy(() => import("../pages/landing/BlogShowcase"));
const EventsShowcase = lazy(() => import("../pages/landing/EventsShowcase"));
const InnovationHubMembersPage = lazy(() =>
  import("../pages/all-member-page/InnovationHubMembersPage").then((m) => ({
    default: m.InnovationHubMembersPage,
  })),
);
const MemberDetailPage = lazy(() =>
  import("../pages/all-member-page/MemberDetailPage").then((m) => ({
    default: m.MemberDetailPage,
  })),
);
const ApplyPage = lazy(() =>
  import("../pages/apply/ApplyPage").then((m) => ({ default: m.ApplyPage })),
);
const LetTalk = lazy(() => import("../pages/HireUs/form"));
const Services = lazy(() => import("../pages/HireUs/services"));
const LatestPro = lazy(() => import("../pages/HireUs/latespro"));
const InnovationHub = lazy(() => import("../pages/HireUs/FirstSection"));
const BlogDesign = lazy(() => import("../pages/AboutHub/Topics"));
const BlogDetails = lazy(() => import("../pages/blog/BlogDetails"));
const AboutIntro = lazy(() => import("../pages/Hub-info/AboutIntro"));
const MissionSection = lazy(() => import("../pages/Hub-info/MissionSection"));
const StrategicObjectives = lazy(
  () => import("../pages/Hub-info/StrategicObjectives"),
);
const CoreValues = lazy(() => import("../pages/Hub-info/CoreValues"));
const WhyHub = lazy(() => import("../pages/Hub-info/WhyHub"));
const FAQs = lazy(() => import("../pages/Hub-info/FAQs"));

// Resources Room
const Home = lazy(() => import("../pages/resources-room/Home"));
const Categories = lazy(() => import("../pages/resources-room/Categories"));
const SubcategoryResults = lazy(
  () => import("../pages/resources-room/SubcategoryResults"),
);
const AllResources = lazy(() => import("../pages/resources-room/AllResources"));

// Member Dashboard
const DashboardLayout = lazy(() =>
  import("../components/member/layouts/DashboardLayout").then((m) => ({
    default: m.DashboardLayout,
  })),
);
// Messages/HubChannel need a height-bounded shell (see the file's own
// comment) rather than DashboardLayout's ordinary document-flow one.
const MemberChatLayout = lazy(() =>
  import("../components/member/layouts/MemberChatLayout").then((m) => ({
    default: m.MemberChatLayout,
  })),
);
const Dashboard = lazy(() =>
  import("../pages/member-page/Dashboard").then((m) => ({
    default: m.Dashboard,
  })),
);
const Resources = lazy(() =>
  import("../pages/resources-page/Resources").then((m) => ({
    default: m.Resources,
  })),
);
const Projects = lazy(() =>
  import("../pages/projects-page/Projects").then((m) => ({
    default: m.Projects,
  })),
);
const AddProject = lazy(() => import("../pages/add-project-page/AddProject"));
const Events = lazy(() =>
  import("../pages/events-page/Events").then((m) => ({
    default: m.Events,
  })),
);
const Messages = lazy(() =>
  import("../pages/messages-page/Messages").then((m) => ({
    default: m.Messages,
  })),
);
const HubChannel = lazy(() =>
  import("../pages/messages-page/HubChannel").then((m) => ({
    default: m.HubChannel,
  })),
);
const MemberForm = lazy(() => import("../components/member/MemberForm"));
const MyTasks = lazy(() => import("../pages/tasks/MyTasks"));
const TaskDetails = lazy(() => import("../pages/tasks/TaskDetails"));
const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));

// Admin pages
const AdminDashboard = lazy(
  () => import("../pages/Admin-pages/AdminDashboard"),
);
const AdminResources = lazy(
  () => import("../pages/Admin-pages/AdminResources"),
);
const HireUsRequests = lazy(
  () => import("../pages/Admin-pages/HireUsRequests"),
);
const AddResource = lazy(() => import("../pages/Admin-pages/AddResource"));
const MemberManagement = lazy(
  () => import("../pages/Admin-pages/MemberManagement"),
);
const HeroMembersPage = lazy(
  () => import("../pages/Admin-pages/HeroMembersPage"),
);
const HubVideoPage = lazy(() => import("../pages/Admin-pages/HubVideoPage"));
const HeroMediaPage = lazy(() => import("../pages/Admin-pages/HeroMediaPage"));
const LeadershipPage = lazy(
  () => import("../pages/Admin-pages/LeadershipPage"),
);
const BlogTables = lazy(() => import("../pages/Admin-pages/BlogTables"));
const ProjectTables = lazy(() => import("../pages/Admin-pages/ProjectTables"));
const OTPVerification = lazy(() => import("../pages/Login/OTPVerification"));
const ForgotPassword = lazy(() => import("../pages/Login/ForgotPassword"));
const HireRequestDetail = lazy(
  () => import("../components/admin-components/HireRequestDetail"),
);
const ApplicationsPage = lazy(
  () => import("../pages/Admin-pages/ApplicationsPage"),
);
const ApplicationDetail = lazy(
  () => import("../components/admin-components/ApplicationDetail"),
);
const EventTables = lazy(() => import("../pages/Admin-pages/EventTables"));
const TaskManagement = lazy(
  () => import("../pages/Admin-pages/TaskManagement"),
);
const ViewProfile = lazy(
  () => import("../pages/Admin-pages/Profile/ViewProfile"),
);
const ProfileSettings = lazy(
  () => import("../pages/Admin-pages/Profile/ProfileSettings"),
);

// Admin Chat pages
const AdminMessages = lazy(() => import("../pages/Admin-pages/AdminMessages"));
const AdminContactMessages = lazy(
  () => import("../pages/Admin-pages/AdminContactMessages"),
);
const AdminHubChannel = lazy(
  () => import("../pages/Admin-pages/AdminHubChannel"),
);
const AdminChatLayout = lazy(
  () => import("../components/admin-components/AdminChatLayout"),
);

// A minimal, brand-consistent loading state while a lazy route chunk
// downloads - shown only on the first visit to a given route (browser
// caches the chunk after that).
const RouteLoadingFallback: React.FC = () => (
  <div
    role="status"
    aria-label="Loading"
    className="min-h-screen w-full flex items-center justify-center bg-white"
  >
    <div
      className="w-10 h-10 rounded-full border-4 border-line border-t-primary animate-spin"
      aria-hidden="true"
    />
  </div>
);

const AllRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}

        <Route
          path="/"
          element={
            // One continuous story - Home -> About -> Members -> Projects ->
            // Footer - rather than the disconnected pages this used to be.
            // Navbar's Home/About Us/Members/Projects links scroll to these
            // sections by id when already on "/" (see Navbar.tsx). About is
            // shown here in full (same content as /Hub-information, nothing
            // gated behind a "learn more" click); Members and Projects here
            // stay short previews with a "View all" link to the full
            // /members and /projects pages, which remain their own routes
            // for deep exploration.
            <>
              <Navbar />
              <main id="main-content">
                <HeroSection />
                <Offerings />
                <section
                  id="about"
                  aria-label="About NPC Innovation Hub"
                  className="scroll-mt-16 lg:scroll-mt-20"
                >
                  <div className="py-20 px-4 md:px-8 bg-white">
                    <div className="container mx-auto max-w-7xl">
                      <AboutIntro />
                    </div>
                  </div>
                  <MissionSection />
                  <StrategicObjectives />
                  <CoreValues />
                  <WhyHub />
                </section>
                <HubMembersSection />
                <ProjectsShowcase />
                <HubIntroVideo />
                <BlogShowcase />
                <EventsShowcase />
                <section
                  id="contact"
                  aria-label="Contact Us"
                  className="scroll-mt-16 lg:scroll-mt-20 py-16 px-4 md:px-8 bg-white"
                >
                  {/* Was given its own "Contact Us" heading + intro line
                      here (matching a hero banner the standalone /contact-us
                      page also had) so this section wasn't the only Home
                      section with no visible heading - but that intro line
                      just repeated, in different words, the "Get in Touch"
                      card's own intro right below it. Dropped from both
                      places instead: the card already opens with its own
                      heading and explanation, so a redundant outer title
                      added noise, not missing consistency. */}
                  <ContactSection />
                </section>
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/hire-us"
          element={
            <>
              <Navbar />
              <main id="main-content">
                <InnovationHub />
                <Services />
                <LatestPro />
                <LetTalk />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            // LoginPage renders its own Navbar and <main id="main-content">
            // internally now (it used to have its own bare hand-rolled
            // header instead of the shared Navbar) - wrapping it in another
            // <main> here would nest one inside the other.
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        {/* Self-serve sign-up is disabled for now: external users apply via
            the "Join the Hub" form instead, an admin reviews and approves
            the application, and the approved account is created for them
            with default credentials tied to the email they applied with.
            Any old /signup link or bookmark just lands on /login. */}
        <Route path="/signup" element={<Navigate to="/login" replace />} />
        <Route
          path="/forgot-password"
          element={
            // ForgotPassword renders its own Navbar and <main
            // id="main-content"> internally now, matching LoginPage/
            // OTPVerification - wrapping it in another <main> here would
            // nest one inside the other.
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/otp"
          element={
            // OTPVerification renders its own Navbar and <main
            // id="main-content"> internally now, matching LoginPage -
            // wrapping it in another <main> here would nest one inside the
            // other.
            <OTPVerification />
          }
        />
        <Route
          path="/projects"
          element={
            <>
              <Navbar />
              <main id="main-content">
                <ProjectsPage />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/members"
          element={
            <>
              <Navbar />
              <main id="main-content">
                <InnovationHubMembersPage />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/events"
          element={
            <>
              <Navbar />
              <main id="main-content">
                <PublicEventsPage />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/contact-us"
          element={
            <>
              <Navbar />
              <main id="main-content">
                <ContactUs />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/members/:id"
          element={
            <>
              <Navbar />
              <main id="main-content">
                <MemberDetailPage />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/apply"
          element={
            <>
              <Navbar />
              <main id="main-content">
                <ApplyPage />
              </main>
              <Footer />
            </>
          }
        />

        {/* ── Blog routes ── */}
        <Route
          path="/blog"
          element={
            <>
              <Navbar />
              <main id="main-content">
                <BlogDesign />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/blogs"
          element={
            <>
              <Navbar />
              <main id="main-content">
                <BlogDesign />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <>
              <Navbar />
              <main id="main-content">
                <BlogDetails />
              </main>
              <Footer />
            </>
          }
        />

        <Route
          path="/Hub-information"
          element={
            <>
              <Navbar />
              <main id="main-content">
                <div className="py-16 px-4 md:px-8 bg-white">
                  <div className="container mx-auto max-w-7xl">
                    <AboutIntro />
                  </div>
                </div>
                <MissionSection />
                <StrategicObjectives />
                <CoreValues />
                <WhyHub />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/faqs"
          element={
            <>
              <Navbar />
              <main id="main-content">
                <FAQs />
              </main>
              <Footer />
            </>
          }
        />
        {/* The AI assistant is now a floating widget on every page (see
            Navbar.tsx -> AssistantWidget), not its own page - redirect
            any old bookmark/link to this URL home instead of a 404,
            same precedent as the /signup -> /login redirect above. */}
        <Route path="/chat-with-us" element={<Navigate to="/" replace />} />
        <Route
          path="/resources-room"
          element={
            <>
              <Navbar />
              <main id="main-content">
                <Home />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/resources-room/categories"
          element={
            <>
              <Navbar />
              <main id="main-content">
                <Categories />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/resources-room/categories/:subcategory"
          element={
            <>
              <Navbar />
              <main id="main-content">
                <SubcategoryResults />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/resources-room/all-resources"
          element={
            <>
              <Navbar />
              <main id="main-content">
                <AllResources />
              </main>
              <Footer />
            </>
          }
        />

        {/* ==================== PROTECTED MEMBER ROUTES ==================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/resources"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <Resources />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/projects"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <Projects />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/projects/new"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <AddProject />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/events"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <Events />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Member's own Blog nav item used to point at the public "/blog"
            route (Navbar + marketing site chrome) - clicking it from
            inside the dashboard dropped the sidebar/Topbar entirely,
            unlike Admin's own "Blog" nav item, which stays inside
            AdminLayout. This keeps Member in the dashboard shell too. */}
        <Route
          path="/dashboard/blog"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <BlogDesign embedded />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ── Member Tasks ── */}
        <Route
          path="/dashboard/tasks"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <MyTasks />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/tasks/:id"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <TaskDetails />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Member Messages - MemberChatLayout, not DashboardLayout: see
            that file's comment for why chat needs a height-bounded shell. */}
        <Route
          path="/messages"
          element={
            <ProtectedRoute requiredRole="Member">
              <MemberChatLayout>
                <Messages />
              </MemberChatLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages/:id"
          element={
            <ProtectedRoute requiredRole="Member">
              <MemberChatLayout>
                <Messages />
              </MemberChatLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hub-channel"
          element={
            <ProtectedRoute requiredRole="Member">
              <MemberChatLayout>
                <HubChannel />
              </MemberChatLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/edit-profile"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <MemberForm />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ==================== PROTECTED ADMIN ROUTES ==================== */}

        <Route
          path="/Admindashboard"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-tasks"
          element={
            <ProtectedRoute requiredRole="Admin">
              <TaskManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-events"
          element={
            <ProtectedRoute requiredRole="Admin">
              <EventTables />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminResources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hire-requests"
          element={
            <ProtectedRoute requiredRole="Admin">
              <HireUsRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hire-inquiries/:id"
          element={
            <ProtectedRoute requiredRole="Admin">
              <HireRequestDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute requiredRole="Admin">
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications/:id"
          element={
            <ProtectedRoute requiredRole="Admin">
              <ApplicationDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-resource"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AddResource />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-members"
          element={
            <ProtectedRoute requiredRole="Admin">
              <MemberManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-hero-members"
          element={
            <ProtectedRoute requiredRole="Admin">
              <HeroMembersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-hub-video"
          element={
            <ProtectedRoute requiredRole="Admin">
              <HubVideoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-hero-media"
          element={
            <ProtectedRoute requiredRole="Admin">
              <HeroMediaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-leadership"
          element={
            <ProtectedRoute requiredRole="Admin">
              <LeadershipPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-blogs"
          element={
            <ProtectedRoute requiredRole="Admin">
              <BlogTables />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-projects"
          element={
            <ProtectedRoute requiredRole="Admin">
              <ProjectTables />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute requiredRole="Admin">
              <ViewProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile/settings"
          element={
            <ProtectedRoute requiredRole="Admin">
              <ProfileSettings />
            </ProtectedRoute>
          }
        />

        {/* ── Admin Chat Routes ── */}
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminChatLayout>
                <AdminMessages />
              </AdminChatLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages/:id"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminChatLayout>
                <AdminMessages />
              </AdminChatLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hub-channel"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminChatLayout>
                <AdminHubChannel />
              </AdminChatLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contact-messages"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminChatLayout>
                <AdminContactMessages />
              </AdminChatLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AllRoutes;
