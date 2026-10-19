import React, { useState, useEffect, useRef } from "react";
import useFocusTrap from "./useFocusTrap";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  LogOut,
  Plus,
  Trash2,
  Pencil,
  Download,
  X,
  Sprout as Leaf,
} from "lucide-react";
import { Sprout } from "./Art";
import { api, post } from "./api";
import { services, projects, posts, testimonials, faqs } from "./content";
const templates = {
  services: services[0],
  projects: projects[0],
  blog: posts[0],
  testimonials: testimonials[0],
  faqs: faqs[0],
};
export default function Admin() {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [tab, setTab] = useState("leads"),
    [stats, setStats] = useState({}),
    [items, setItems] = useState([]),
    [status, setStatus] = useState(""),
    [editor, setEditor] = useState(null),
    [draft, setDraft] = useState({}),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  const editorRef = useRef();
  useFocusTrap(editorRef, !!editor, () => setEditor(null));
  useEffect(() => {
    if (!sessionStorage.getItem("esgrow-token")) {
      setLoading(false);
      return;
    }
    api("/admin/me")
      .then(setUser)
      .catch(() => sessionStorage.removeItem("esgrow-token"))
      .finally(() => setLoading(false));
  }, []);
  async function load() {
    setError("");
    try {
      const [s, i] = await Promise.all([
        api("/admin/stats"),
        api(
          "/admin/" +
            tab +
            (tab === "leads" && status ? "?status=" + status : ""),
        ),
      ]);
      setStats(s);
      setItems(i);
    } catch (err) {
      setError(err.message);
    }
  }
  useEffect(() => {
    if (user) load();
  }, [user, tab, status]);
  async function login(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      const data = await post("/admin/login", Object.fromEntries(f));
      sessionStorage.setItem("esgrow-token", data.token);
      setUser({ email: data.email });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    try {
      await post("/admin/logout", {});
    } catch {}
    sessionStorage.removeItem("esgrow-token");
    setUser(null);
  }
  async function remove(item) {
    if (
      !confirm(
        `Delete this ${tab === "leads" ? "enquiry" : "record"}? This cannot be undone.`,
      )
    )
      return;
    try {
      await api(`/admin/${tab}/${item._id}`, { method: "DELETE" });
      setNotice("Record deleted.");
      load();
    } catch (err) {
      setError(err.message);
    }
  }
  async function updateStatus(item, value) {
    try {
      await api("/admin/leads/" + item._id, {
        method: "PATCH",
        body: JSON.stringify({ status: value }),
      });
      load();
    } catch (err) {
      setError(err.message);
    }
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = { ...draft };
      for (const [key, val] of Object.entries(data)) {
        if (Array.isArray(templates[tab][key]))
          data[key] =
            typeof val === "string"
              ? val
                  .split("\n")
                  .map((x) => x.trim())
                  .filter(Boolean)
              : val;
        if (typeof templates[tab][key] === "number") data[key] = Number(val);
      }
      await api("/admin/" + tab + (editor._id ? "/" + editor._id : ""), {
        method: editor._id ? "PUT" : "POST",
        body: JSON.stringify(data),
      });
      setEditor(null);
      setNotice(
        "Content saved. The public website now uses the updated record.",
      );
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  function edit(item) {
    const clean = { ...templates[tab], ...item };
    delete clean._id;
    delete clean.id;
    delete clean.createdAt;
    delete clean.updatedAt;
    delete clean.__v;
    setDraft(clean);
    setEditor(item);
    setError("");
  }
  async function exportCSV() {
    try {
      const r = await fetch(
        (import.meta.env.VITE_API_URL || "/api") + "/admin/leads/export",
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("esgrow-token")}`,
          },
        },
      );
      if (!r.ok) throw Error("Could not export leads.");
      const url = URL.createObjectURL(await r.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = "esgrow-leads.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  }
  if (loading) return <div className="admin-loading">Opening the studio…</div>;
  if (!user)
    return (
      <main className="admin-login">
        <div className="login-art">
          <Sprout size={65} />
          <h1>
            A little care.
            <br />A lot of growth.
          </h1>
          <p>The Esgrow Studio workspace.</p>
          <Link to="/">Back to the website ↗</Link>
        </div>
        <div className="login-form">
          <Sprout size={35} />
          <h2>Welcome back.</h2>
          <p>Sign in to tend to your digital garden.</p>
          <form onSubmit={login}>
            <label className="field">
              Email
              <input
                name="email"
                type="email"
                autoComplete="username"
                required
              />
            </label>
            <label className="field">
              Password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="button" disabled={busy}>
              {busy ? "Signing in…" : "Open the studio"}
              <ArrowUpRight size={17} />
            </button>
          </form>
          <small>Use the admin account configured in server/.env.</small>
        </div>
      </main>
    );
  return (
    <div className="admin">
      <aside className="admin-sidebar">
        <Link to="/" className="brand">
          <Sprout />
          <span>
            esgrow <span className="brand-studio">STUDIO / ADMIN</span>
          </span>
        </Link>
        <span className="admin-nav-label">YOUR WORKSPACE</span>
        {[
          "leads",
          "blog",
          "projects",
          "services",
          "testimonials",
          "faqs",
          "subscribers",
        ].map((x) => (
          <button
            key={x}
            className={tab === x ? "selected" : ""}
            onClick={() => {
              setTab(x);
              setNotice("");
            }}
          >
            {x === "blog" ? "Field notes" : x}
            <ArrowUpRight size={15} />
          </button>
        ))}
        <div className="admin-sidebar-bottom">
          <span>{user.email}</span>
          <button onClick={logout}>
            <LogOut size={16} />
            Sign out
          </button>
          <Link to="/">View website ↗</Link>
        </div>
      </aside>
      <main className="admin-main">
        <header>
          <div>
            <span className="eyebrow">A little tending goes a long way</span>
            <h1>{tab === "blog" ? "Field notes" : tab}.</h1>
          </div>
          {templates[tab] && (
            <button className="button" onClick={() => edit({})}>
              <Plus size={18} />
              Add {tab === "blog" ? "article" : "record"}
            </button>
          )}
        </header>
        <div className="admin-stats">
          {[
            ["Total enquiries", stats.leads],
            ["New conversations", stats.newLeads],
            ["Subscribers", stats.subscribers],
            ["Published articles", stats.blog],
          ].map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value ?? "—"}</strong>
            </div>
          ))}
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="admin-notice" role="status">
            {notice}
          </p>
        )}
        <div className="admin-toolbar">
          <span>
            {items.length} records{" "}
            {items.length === 1000 ? "(latest 1,000)" : ""}
          </span>
          {tab === "leads" && (
            <>
              <label>
                Status{" "}
                <select
                  aria-label="Filter leads by status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All</option>
                  {["new", "contacted", "qualified", "closed"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <button className="text-link" onClick={exportCSV}>
                <Download size={16} />
                Export all CSV
              </button>
            </>
          )}
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {(tab === "leads"
                  ? [
                      "Name / Email",
                      "Project",
                      "Budget / Timeline",
                      "Status",
                      "Received",
                      "Actions",
                    ]
                  : tab === "subscribers"
                    ? ["Email", "Subscribed"]
                    : ["Title / Name", "Details", "Updated", "Actions"]
                ).map((x) => (
                  <th key={x}>{x}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  {tab === "leads" ? (
                    <>
                      <td>
                        <b>{item.name}</b>
                        <a href={"mailto:" + item.email}>{item.email}</a>
                        <small>
                          {item.company} {item.phone}
                        </small>
                      </td>
                      <td>
                        <b>{item.services.join(", ")}</b>
                        <details>
                          <summary>Read enquiry</summary>
                          <p>{item.message}</p>
                          <small>Email status: {item.notification}</small>
                        </details>
                      </td>
                      <td>
                        {item.budget}
                        <small>{item.timeline}</small>
                      </td>
                      <td>
                        <select
                          aria-label={`Status for ${item.name}`}
                          value={item.status}
                          onChange={(e) => updateStatus(item, e.target.value)}
                        >
                          {["new", "contacted", "qualified", "closed"].map(
                            (x) => (
                              <option key={x}>{x}</option>
                            ),
                          )}
                        </select>
                      </td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="icon-button"
                          aria-label={`Delete enquiry from ${item.name}`}
                          onClick={() => remove(item)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </>
                  ) : tab === "subscribers" ? (
                    <>
                      <td>{item.email}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    </>
                  ) : (
                    <>
                      <td>
                        <b>{item.title || item.name || item.question}</b>
                        <small>{item.slug || item.role}</small>
                      </td>
                      <td className="admin-excerpt">
                        {item.excerpt ||
                          item.description ||
                          item.quote ||
                          item.answer}
                      </td>
                      <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="icon-button"
                            aria-label="Edit record"
                            onClick={() => edit(item)}
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            className="icon-button"
                            aria-label="Delete record"
                            onClick={() => remove(item)}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {!items.length && (
            <div className="empty-state">A fresh patch. Nothing here yet.</div>
          )}
        </div>
      </main>
      {editor && (
        <div
          className="admin-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="editor-title"
        >
          <div className="admin-editor" ref={editorRef}>
            <header>
              <h2 id="editor-title">
                {editor._id ? "Edit" : "New"}{" "}
                {tab === "blog" ? "article" : "record"}
              </h2>
              <button
                className="icon-button"
                aria-label="Close editor"
                onClick={() => setEditor(null)}
              >
                <X />
              </button>
            </header>
            <form onSubmit={save}>
              {Object.entries(templates[tab]).map(([key, val]) => (
                <label className="field" key={key}>
                  {key.replace(/([A-Z])/g, " $1")}
                  {Array.isArray(val) ? (
                    <>
                      <textarea
                        required
                        rows={key === "body" ? 10 : 4}
                        value={
                          Array.isArray(draft[key])
                            ? draft[key].join("\n")
                            : draft[key]
                        }
                        onChange={(e) =>
                          setDraft({ ...draft, [key]: e.target.value })
                        }
                      />
                      <small>One item or paragraph per line.</small>
                    </>
                  ) : key === "type" ? (
                    <select
                      value={draft[key]}
                      onChange={(e) =>
                        setDraft({ ...draft, [key]: e.target.value })
                      }
                    >
                      {["flora", "forma", "ritual"].map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  ) : String(val).length > 90 ? (
                    <textarea
                      required
                      rows={4}
                      value={draft[key]}
                      onChange={(e) =>
                        setDraft({ ...draft, [key]: e.target.value })
                      }
                    />
                  ) : (
                    <input
                      required
                      type={typeof val === "number" ? "number" : "text"}
                      value={draft[key]}
                      onChange={(e) =>
                        setDraft({ ...draft, [key]: e.target.value })
                      }
                    />
                  )}
                </label>
              ))}
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <div className="editor-actions">
                <button
                  type="button"
                  className="button outline"
                  onClick={() => setEditor(null)}
                >
                  Cancel
                </button>
                <button className="button" disabled={busy}>
                  {busy ? "Saving…" : "Save content"}
                  <CheckIcon />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
function CheckIcon() {
  return <ArrowUpRight size={17} />;
}
