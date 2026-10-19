import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import {
  Navbar,
  Footer,
  Motion,
  ScrollProgress,
  ContactFloat,
} from "./components";
import Home from "./Home";
import SEO from "./SEO";
const load = (name) =>
  lazy(() => import("./Pages").then((m) => ({ default: m[name] })));
const Services = load("Services"),
  ServiceDetail = load("ServiceDetail"),
  Work = load("Work"),
  WorkDetail = load("WorkDetail"),
  About = load("About"),
  Process = load("Process"),
  Pricing = load("Pricing"),
  Blog = load("Blog"),
  BlogDetail = load("BlogDetail"),
  Contact = load("Contact"),
  Legal = load("Legal"),
  NotFound = load("NotFound");
const Admin = lazy(() => import("./Admin"));
export default function App() {
  const loc = useLocation();
  const admin = loc.pathname.startsWith("/admin");
  return (
    <>
      <SEO />
      {!admin && (
        <>
          <Navbar />
          <ScrollProgress />
        </>
      )}
      <Suspense
        fallback={<div className="route-loading">Good things are growing…</div>}
      >
        {admin ? (
          <Admin />
        ) : (
          <>
            <main id="main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/work" element={<Work />} />
                <Route path="/work/:slug" element={<WorkDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/process" element={<Process />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/get-a-quote" element={<Contact />} />
                <Route path="/privacy-policy" element={<Legal />} />
                <Route path="/terms" element={<Legal terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <ContactFloat />
            <Motion />
          </>
        )}
      </Suspense>
    </>
  );
}
