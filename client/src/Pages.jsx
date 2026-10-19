import React, { useState, useEffect } from "react";
import {
  Link,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Check,
  Mail,
  Globe,
  Clock,
  Copy,
  Search,
  Plus,
} from "lucide-react";
import {
  Label,
  Button,
  SectionHead,
  FinalCTA,
  Accordion,
  PricingCards,
  useContent,
} from "./components";
import { Garden, Sprout, ProjectArt } from "./Art";
import { ServiceList, Framework, ProjectCard, icons } from "./Home";
import { services, projects, posts, steps } from "./content";
import { siteConfig } from "./siteConfig";
import { api, post } from "./api";
export function PageHero({ label, title, text, children }) {
  return (
    <section className="page-hero page-enter">
      <Label>{label}</Label>
      <h1>{title}</h1>
      {text && <p>{text}</p>}
      {children}
      <span className="page-hero-flower" aria-hidden="true">
        ✳
      </span>
    </section>
  );
}
export function Services() {
  return (
    <>
      <PageHero
        label="Our capabilities"
        title={
          <>
            Your whole digital world.
            <br />
            <em>In good hands.</em>
          </>
        }
        text="From the first spark of an idea to the systems that help it grow. One studio, a connected set of services and a shared ambition for your business."
      />
      <section className="section">
        <ServiceList all />
      </section>
      <section className="section">
        <SectionHead
          label="Connected by design"
          title="The right pieces. Working together."
          text="You don’t need every service at once. We’ll help you find the right starting point, then build around it as your business grows."
        />
        <div className="value-grid">
          {[
            "Start where you are",
            "Build what you need",
            "Grow at your pace",
          ].map((x, i) => (
            <article key={x}>
              <span>0{i + 1}</span>
              <h3>{x}</h3>
              <p>
                {
                  [
                    "A new business, an outdated website or a brand ready to scale. We meet you at your current stage.",
                    "We recommend a focused scope with a clear purpose, deliverables and priorities.",
                    "Add channels, content and capabilities when the foundations are ready.",
                  ][i]
                }
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
export function ServiceDetail() {
  const { slug } = useParams();
  const items = useContent("services", services);
  const s = items.find((x) => x.slug === slug);
  if (!s) return <NotFound />;
  const Icon = icons[s.icon] || Sprout;
  return (
    <>
      <PageHero
        label="Our services"
        title={
          <>
            {s.title}.<br />
            <em>{s.short}</em>
          </>
        }
        text={s.description}
      >
        <Button to="/get-a-quote">Let’s talk about your project</Button>
      </PageHero>
      <section className="section detail-grid">
        <div className="detail-art" style={{ background: s.color }}>
          <img
            src={`/images/${["web-design", "branding-content"].includes(slug) ? "sage-waves" : slug === "seo" ? "growth-spiral" : slug === "performance-marketing" ? "emerald-fold" : "glass-ribbon"}.webp`}
            alt=""
            width="736"
            height="1308"
            loading="lazy"
          />
          <Icon size={120} strokeWidth={1} />
          <span>
            Thoughtfully planned.
            <br />
            Carefully made.
          </span>
        </div>
        <div>
          <Label>What’s included</Label>
          <h2>
            A considered approach.
            <br />
            <span>From start to finish.</span>
          </h2>
          <ul className="deliverable-list">
            {s.items.map((x) => (
              <li key={x}>
                <Check size={20} />
                {x}
              </li>
            ))}
          </ul>
          <p>
            Every engagement starts with discovery and a clear scope. We agree
            on priorities, tools, deliverables and milestones before work
            begins.
          </p>
          <div className="tool-tags">
            {(slug === "website-development"
              ? ["React", "Node.js", "MongoDB", "WordPress", "Shopify"]
              : slug === "hosting-cloud"
                ? ["AWS", "Vercel", "DigitalOcean", "Cloudflare"]
                : slug === "web-design"
                  ? ["Figma", "Prototyping", "Design systems"]
                  : ["Strategy", "Measurement", "Collaboration"]
            ).map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <SectionHead
          label="The path forward"
          title="Good work has good roots."
        />
        <Framework />
      </section>
      <section className="section">
        <SectionHead
          label="A little inspiration"
          title="See the thinking in action."
        />
        <ProjectCard project={projects[0]} />
      </section>
      <section className="section faq-section">
        <h2>A little more clarity.</h2>
        <Accordion
          items={[
            {
              question: `Is ${s.title.toLowerCase()} right for my business?`,
              answer:
                "We’ll discuss your goals, current setup and available resources first. If another starting point makes more sense, we’ll explain why.",
            },
            {
              question: "What will I receive?",
              answer: `Your proposal defines the scope. Typical deliverables include ${s.items.join(", ").toLowerCase()}, with handover and support agreed in advance.`,
            },
          ]}
        />
      </section>
      <section className="section related-services">
        <h2>Better, together.</h2>
        {items
          .filter((x) => x.slug !== slug)
          .slice(0, 3)
          .map((x) => (
            <Link
              className="related-service"
              key={x.slug}
              to={"/services/" + x.slug}
            >
              {x.title}
              <ArrowUpRight />
            </Link>
          ))}
      </section>
    </>
  );
}
export function Work() {
  const data = useContent("projects", projects);
  const [filter, setFilter] = useState("All");
  return (
    <>
      <PageHero
        label="Selected work"
        title={
          <>
            Ideas with purpose.
            <br />
            <em>Work with personality.</em>
          </>
        }
        text="A collection of original concept projects exploring how thoughtful design can bring different businesses to life."
      />
      <section className="section">
        <div className="filter-tabs" role="group" aria-label="Filter projects">
          {["All", ...new Set(data.map((x) => x.category))].map((x) => (
            <button
              key={x}
              aria-pressed={filter === x}
              className={filter === x ? "selected" : ""}
              onClick={() => setFilter(x)}
            >
              {x}
            </button>
          ))}
        </div>
        <div className="work-grid">
          {data
            .filter((x) => filter === "All" || x.category === filter)
            .map((p) => (
              <ProjectCard project={p} key={p.slug} />
            ))}
        </div>
        <p className="concept-note">
          All projects shown are illustrative concepts. Replace with
          commissioned work and verified results when available.
        </p>
      </section>
    </>
  );
}
export function WorkDetail() {
  const { slug } = useParams();
  const data = useContent("projects", projects);
  const p = data.find((x) => x.slug === slug);
  if (!p) return <NotFound />;
  const next = data[(data.indexOf(p) + 1) % data.length];
  return (
    <>
      <PageHero
        label={`${p.category} · Concept project`}
        title={
          <>
            {p.name}.<br />
            <em>{p.tag}</em>
          </>
        }
        text={p.description}
      />
      <section className="section case-study">
        <ProjectArt type={p.type} />
        <div className="case-tags">
          {p.services.map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
        <div className="case-copy">
          <div>
            <Label>The challenge</Label>
            <h2>
              Start with
              <br />
              the right question.
            </h2>
            <p>{p.challenge}</p>
          </div>
          <div>
            <Label>Our approach</Label>
            <h2>
              Give the idea
              <br />
              room to breathe.
            </h2>
            <p>{p.solution}</p>
          </div>
        </div>
        <div className="case-results">
          {p.results.map((x) => (
            <div key={x}>
              <Check />
              <h3>{x}</h3>
            </div>
          ))}
        </div>
        <p className="concept-note">
          This is an original design concept, not a client engagement. Outcomes
          describe the proposed design; no measured performance claims are made.
        </p>
        <Link className="next-project" to={"/work/" + next.slug}>
          <span>
            Next concept<h2>{next.name}</h2>
          </span>
          <ArrowUpRight size={48} />
        </Link>
      </section>
    </>
  );
}
export function About() {
  return (
    <>
      <PageHero
        label="The people behind the pixels"
        title={
          <>
            Small studio.
            <br />
            <em>Deeply invested.</em>
          </>
        }
        text="Esgrow Studio is an independent digital partner for businesses with somewhere to go. We bring the strategy, craft and care to help you get there."
      />
      <section className="section detail-grid">
        <div className="about-garden">
          <img
            src="/images/organic-glass.webp"
            width="736"
            height="1472"
            alt="Organic emerald glass sculpture glowing with warm light"
            loading="lazy"
          />
        </div>
        <div>
          <Label>Why we exist</Label>
          <h2>
            Good businesses
            <br />
            deserve <span>good beginnings.</span>
          </h2>
          <p>
            Building an online presence can feel fragmented. A designer here, a
            developer there, campaigns somewhere else. We built Esgrow around a
            more connected way of working.
          </p>
          <p>
            We help businesses find their voice, build their digital home and
            reach the people who need them. Every piece has a role. Every
            decision starts with your goals.
          </p>
          <p>
            Our promise is simple: thoughtful work, clear communication and the
            kind of care we would want for our own business.
          </p>
        </div>
      </section>
      <section className="section">
        <SectionHead
          label="Our roots"
          title={
            <>
              What we stand on.
              <br />
              <span>And what we stand for.</span>
            </>
          }
        />
        <div className="value-grid">
          {[
            [
              "Trust",
              "We do what we say, document the details and keep you informed.",
            ],
            [
              "Growth",
              "We focus on useful progress and outcomes your business can understand.",
            ],
            [
              "Craft",
              "We care about the small details because they shape the whole experience.",
            ],
            [
              "Transparency",
              "Clear scope, honest advice and no mystery around what happens next.",
            ],
          ].map(([title, text], i) => (
            <article key={title}>
              <Sprout size={30} />
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <SectionHead
          label="One connected team"
          title="Different skills. One direction."
          text="Your project brings together the right capabilities, with a clear point of contact throughout."
        />
        <div className="team-grid">
          {[
            "Strategy & partnership",
            "Design & brand",
            "Development & engineering",
            "Content & growth",
          ].map((x, i) => (
            <article key={x}>
              <div className={"team-avatar team-" + i}>
                <Sprout size={70} />
                <span>0{i + 1}</span>
              </div>
              <h3>{x}</h3>
              <p>
                {
                  [
                    "The questions, the roadmap and the bigger picture.",
                    "The identity, the experience and every thoughtful detail.",
                    "The reliable systems behind a seamless experience.",
                    "The words, the channels and the next opportunity.",
                  ][i]
                }
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
export function Process() {
  return (
    <>
      <PageHero
        label="From Roots to Results"
        title={
          <>
            A clear process.
            <br />
            <em>A shared direction.</em>
          </>
        }
        text="Great work grows from a good partnership. Here’s how we turn an initial conversation into a considered digital experience, and keep it moving forward."
      />
      <section className="section">
        <Framework extended />
      </section>
      <section className="section value-grid">
        {[
          [
            "You’re part of the process",
            "Regular check-ins and clear feedback rounds keep the project collaborative.",
          ],
          [
            "No surprises in the scope",
            "Deliverables, timeline, responsibilities and fees are agreed before kickoff.",
          ],
          [
            "A proper handover",
            "Documentation, training and a defined support period help you take the next step confidently.",
          ],
        ].map(([a, b]) => (
          <article key={a}>
            <Check size={24} />
            <h3>{a}</h3>
            <p>{b}</p>
          </article>
        ))}
      </section>
    </>
  );
}
export function Pricing() {
  return (
    <>
      <PageHero
        label="Thoughtful investments"
        title={
          <>
            A foundation for now.
            <br />
            <em>Room for what’s next.</em>
          </>
        }
        text="Transparent starting points for ambitious businesses. We scope every project around what you actually need, with no one-size-fits-all promises."
      />
      <section className="section">
        <PricingCards full />
      </section>
      <section className="section faq-section">
        <h2>
          Before we
          <br />
          <span>get growing.</span>
        </h2>
        <Accordion />
      </section>
    </>
  );
}
export function Blog() {
  const initialPosts = useContent("blog", posts);
  const [search, setSearch] = useState(""),
    [category, setCategory] = useState("All"),
    [items, setItems] = useState(initialPosts),
    [page, setPage] = useState(1),
    [total, setTotal] = useState(1);
  useEffect(() => {
    const controller = new AbortController();
    const t = setTimeout(
      () =>
        api(
          `/blog?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category === "All" ? "" : category)}&page=${page}&limit=6`,
          { signal: controller.signal },
        )
          .then((d) => {
            setItems(d.items);
            setTotal(d.pages);
          })
          .catch(() => {
            if (!controller.signal.aborted) {
              setItems(
                posts.filter(
                  (x) =>
                    (category === "All" || x.category === category) &&
                    `${x.title} ${x.excerpt}`
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                ),
              );
              setTotal(1);
            }
          }),
      200,
    );
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [search, category, page]);
  return (
    <>
      <PageHero
        label="Field notes"
        title={
          <>
            Fresh thinking.
            <br />
            <em>For growing businesses.</em>
          </>
        }
        text="Practical ideas on design, technology and finding your place online. A little clarity for your next step."
      />
      <section className="section">
        <div className="blog-toolbar">
          <div
            className="filter-tabs"
            role="group"
            aria-label="Article categories"
          >
            {[
              "All",
              "Web design",
              "SEO",
              "Marketing",
              "Hosting",
              "Branding",
              "Strategy",
            ].map((x) => (
              <button
                key={x}
                className={category === x ? "selected" : ""}
                aria-pressed={category === x}
                onClick={() => {
                  setCategory(x);
                  setPage(1);
                }}
              >
                {x}
              </button>
            ))}
          </div>
          <label className="search-field">
            <Search size={18} />
            <span className="sr-only">Search field notes</span>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Find a little inspiration…"
            />
          </label>
        </div>
        <div className="journal-grid">
          {items.map((p, i) => (
            <Link className="journal-card" to={"/blog/" + p.slug} key={p.slug}>
              <div className={`journal-art journal-art-${i % 3}`}>
                <img
                  className="journal-media"
                  src={`/images/${["sage-waves", "growth-spiral", "emerald-fold"][i % 3]}.webp`}
                  alt=""
                  loading="lazy"
                  width="736"
                  height="1308"
                />
                <span>
                  {p.category}
                  <br />
                  <em>in focus.</em>
                </span>
                <Sprout size={75} />
              </div>
              <div className="article-meta">
                <span>{p.category}</span>
                <span>{p.read} min read</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
              <span className="text-link">
                Read the story <ArrowUpRight size={15} />
              </span>
            </Link>
          ))}
        </div>
        {!items.length && (
          <div className="empty-state">
            No field notes found. Try a different search.
          </div>
        )}
        {total > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <span>
              {page} / {total}
            </span>
            <button disabled={page === total} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        )}
      </section>
    </>
  );
}
export function BlogDetail() {
  const { slug } = useParams();
  const initialPosts = useContent("blog", posts);
  const [p, setP] = useState(initialPosts.find((x) => x.slug === slug));
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    setP(initialPosts.find((x) => x.slug === slug));
    api("/blog/" + slug)
      .then(setP)
      .catch(() => {});
  }, [slug]);
  if (!p) return <NotFound />;
  return (
    <>
      <PageHero
        label={`${p.category} · ${p.read} min read`}
        title={p.title}
        text={p.excerpt}
      />
      <article className="article-body section">
        <div className="article-byline">
          <span className="avatar">
            <Sprout size={23} />
          </span>
          <div>
            <b>Esgrow Studio</b>
            <span>Ideas from the studio</span>
          </div>
          <button
            className="share-button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(location.href);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            <Copy size={16} />
            {copied ? "Link copied" : "Copy article link"}
          </button>
        </div>
        {p.body.map((paragraph, i) => (
          <section key={i}>
            <h2>
              {[
                "Start with the right foundation",
                "Make the experience useful",
                "Build for real people",
                "Keep learning. Keep growing.",
              ][i] || "The next step"}
            </h2>
            <p>{paragraph}</p>
          </section>
        ))}
        <div className="article-takeaway">
          <Sprout />
          <h3>A little idea to take with you.</h3>
          <p>
            You don’t need to do everything at once. Choose one useful
            improvement, make it well and build from there.
          </p>
          <Link className="text-link" to="/contact">
            Need a hand? Let’s talk <ArrowUpRight size={17} />
          </Link>
        </div>
        <Link className="text-link" to="/blog">
          <ArrowLeft size={17} />
          Back to field notes
        </Link>
      </article>
      <section className="section">
        <h2>Keep the ideas growing.</h2>
        <div className="related-articles">
          {posts
            .filter((x) => x.slug !== slug)
            .slice(0, 3)
            .map((x) => (
              <Link key={x.slug} to={"/blog/" + x.slug}>
                {x.title}
                <ArrowUpRight />
              </Link>
            ))}
        </div>
      </section>
    </>
  );
}
const defaultForm = {
  services: [],
  budget: "",
  timeline: "",
  name: "",
  email: "",
  company: "",
  phone: "",
  message: "",
  website: "",
  consent: false,
};
export function Contact() {
  const location = useLocation();
  const [params] = useSearchParams();
  const [step, setStep] = useState(0),
    [data, setData] = useState({
      ...defaultForm,
      package: params.get("package") || "",
    }),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [done, setDone] = useState(false);
  const quote = location.pathname === "/get-a-quote";
  function set(k, v) {
    setData((x) => ({ ...x, [k]: v }));
    setError("");
  }
  function next(e) {
    e.preventDefault();
    if (step === 0 && !data.services.length) {
      setError(
        "Choose at least one service so we can point you in the right direction.",
      );
      return;
    }
    setStep(step + 1);
    setError("");
  }
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await post(quote ? "/quote" : "/contact", data);
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHero
        label="Good things start with hello"
        title={
          <>
            A big idea?
            <br />
            <em>We’re all ears.</em>
          </>
        }
        text="Tell us where you are and where you’d like to go. We’ll help you figure out the next step."
      />
      <section className="section contact-layout">
        <aside>
          <Label>Let’s connect</Label>
          <h2>
            Your next chapter
            <br />
            starts <span>right here.</span>
          </h2>
          <p>
            No complicated pitches. Just a friendly conversation about your
            business and how we can help.
          </p>
          <a className="contact-detail" href={`mailto:${siteConfig.email}`}>
            <Mail size={20} />
            <span>
              Email us<b>{siteConfig.email}</b>
            </span>
            <ArrowUpRight size={18} />
          </a>
          <div className="contact-detail">
            <Globe size={20} />
            <span>
              Where we work<b>{siteConfig.location}</b>
            </span>
          </div>
          <div className="contact-detail">
            <Clock size={20} />
            <span>
              A thoughtful reply<b>Usually within 2 business days</b>
            </span>
          </div>
          {siteConfig.whatsapp && (
            <a
              className="text-link"
              href={`https://wa.me/${siteConfig.whatsapp}`}
            >
              Chat on WhatsApp <ArrowUpRight size={16} />
            </a>
          )}
          <div
            className="contact-map"
            aria-label="Remote collaboration across locations"
          >
            <div />
            <Globe size={65} />
            <span>
              Different places.
              <br />
              One shared direction.
            </span>
          </div>
        </aside>
        <div className="quote-form-panel">
          {done ? (
            <div className="form-success" role="status">
              <span>
                <Sprout size={55} />
              </span>
              <Label>A good beginning</Label>
              <h2>
                Your idea’s
                <br />
                in good hands.
              </h2>
              <p>
                Thanks, {data.name.split(" ")[0]}. Your enquiry has been saved.
                We’ll review your project and get back to {data.email}.
              </p>
              <Button to="/work">Explore some possibilities</Button>
              <button
                className="text-link"
                onClick={() => {
                  setDone(false);
                  setStep(0);
                  setData(defaultForm);
                }}
              >
                Send another enquiry <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className="form-heading">
                <span>LET’S GET TO KNOW YOUR PROJECT</span>
                <span>0{step + 1} / 03</span>
              </div>
              <div className="form-progress">
                <span style={{ width: `${((step + 1) / 3) * 100}%` }} />
              </div>
              <form onSubmit={step < 2 ? next : submit}>
                {step === 0 ? (
                  <>
                    <h2>
                      What can we
                      <br />
                      <em>help you grow?</em>
                    </h2>
                    <p>Pick one or a few. We’ll connect the dots.</p>
                    <div className="service-options">
                      {services.map((s) => (
                        <label
                          className={
                            data.services.includes(s.title) ? "checked" : ""
                          }
                          key={s.slug}
                        >
                          <input
                            type="checkbox"
                            checked={data.services.includes(s.title)}
                            onChange={(e) =>
                              set(
                                "services",
                                e.target.checked
                                  ? [...data.services, s.title]
                                  : data.services.filter((x) => x !== s.title),
                              )
                            }
                          />
                          <span>{s.title}</span>
                          {data.services.includes(s.title) ? (
                            <Check size={16} />
                          ) : (
                            <Plus size={16} />
                          )}
                        </label>
                      ))}
                    </div>
                  </>
                ) : step === 1 ? (
                  <>
                    <h2>
                      A little about
                      <br />
                      <em>the bigger picture.</em>
                    </h2>
                    <p>
                      A starting point is all we need. Nothing is set in stone.
                    </p>
                    <label className="field">
                      Your estimated budget
                      <select
                        required
                        value={data.budget}
                        onChange={(e) => set("budget", e.target.value)}
                      >
                        <option value="">Select a budget range</option>
                        {[
                          "Under ₹25,000",
                          "₹25,000 – ₹50,000",
                          "₹50,000 – ₹1,00,000",
                          "₹1,00,000+",
                          "Let’s figure it out together",
                        ].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </label>
                    <label className="field">
                      When would you like to start?
                      <select
                        required
                        value={data.timeline}
                        onChange={(e) => set("timeline", e.target.value)}
                      >
                        <option value="">Choose your timeline</option>
                        {[
                          "As soon as possible",
                          "Within a month",
                          "In 1–3 months",
                          "Just exploring for now",
                        ].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </label>
                    {data.package && (
                      <p className="package-note">
                        Interested in the {data.package} package.
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <h2>
                      And who’s behind
                      <br />
                      <em>the good idea?</em>
                    </h2>
                    <div className="field-row">
                      <label className="field">
                        Your name *
                        <input
                          required
                          maxLength={100}
                          value={data.name}
                          onChange={(e) => set("name", e.target.value)}
                          autoComplete="name"
                          placeholder="Alex Smith"
                        />
                      </label>
                      <label className="field">
                        Email address *
                        <input
                          type="email"
                          required
                          value={data.email}
                          onChange={(e) => set("email", e.target.value)}
                          autoComplete="email"
                          placeholder="alex@yourbusiness.com"
                        />
                      </label>
                    </div>
                    <div className="field-row">
                      <label className="field">
                        Business name
                        <input
                          maxLength={160}
                          value={data.company}
                          onChange={(e) => set("company", e.target.value)}
                          autoComplete="organization"
                          placeholder="Your business"
                        />
                      </label>
                      <label className="field">
                        Phone (optional)
                        <input
                          type="tel"
                          maxLength={30}
                          value={data.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          autoComplete="tel"
                          placeholder="Your number"
                        />
                      </label>
                    </div>
                    <label className="field">
                      Tell us a little about your project *
                      <textarea
                        required
                        minLength={10}
                        maxLength={5000}
                        rows={4}
                        value={data.message}
                        onChange={(e) => set("message", e.target.value)}
                        placeholder="Your idea, your goals, what’s on your mind…"
                      />
                    </label>
                    <label className="honeypot" aria-hidden="true">
                      Leave this empty
                      <input
                        tabIndex={-1}
                        autoComplete="off"
                        value={data.website}
                        onChange={(e) => set("website", e.target.value)}
                      />
                    </label>
                    <label className="consent">
                      <input
                        type="checkbox"
                        required
                        checked={data.consent}
                        onChange={(e) => set("consent", e.target.checked)}
                      />
                      <span>
                        I agree to the{" "}
                        <Link to="/privacy-policy" target="_blank">
                          privacy policy
                        </Link>{" "}
                        and to being contacted about this enquiry.
                      </span>
                    </label>
                  </>
                )}
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
                <div className="form-actions">
                  {step > 0 ? (
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => {
                        setStep(step - 1);
                        setError("");
                      }}
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                  ) : (
                    <span>Good growth starts here.</span>
                  )}
                  <Button type="submit" disabled={busy}>
                    {busy
                      ? "Sending…"
                      : step === 2
                        ? "Let’s get growing"
                        : "Next step"}
                  </Button>
                </div>
                <p className="form-small">
                  Your details stay private. No spam, ever.
                </p>
              </form>
            </>
          )}
        </div>
      </section>
    </>
  );
}
export function Legal({ terms = false }) {
  return (
    <>
      <PageHero
        label="The small print"
        title={terms ? "Terms of service." : "Your privacy matters."}
        text="Clear expectations make better partnerships. The following is a starter policy for this website."
      />
      <article className="article-body section">
        <p className="policy-notice">
          Draft policy — business address, jurisdiction, data retention and
          service terms must be reviewed and completed by the studio before
          public launch.
        </p>
        {(terms
          ? [
              [
                "Using this website",
                "The information on this website introduces Esgrow Studio’s services. Concept work, illustrative testimonials and indicative prices are examples and do not represent guarantees or binding offers.",
              ],
              [
                "Projects and payments",
                "Every project requires a separate written proposal covering scope, deliverables, revisions, timeline, fees, ownership and support. Those agreed terms take precedence over general website information.",
              ],
              [
                "Intellectual property",
                "Original website content and illustrations are provided to describe the studio. Rights to commissioned work and third-party materials will be defined in the relevant project agreement.",
              ],
              [
                "Performance and availability",
                "We aim to provide reliable services. Search positions, advertising returns and business results depend on many factors and are not guaranteed.",
              ],
              [
                "Contact and governing terms",
                "For questions, contact the studio at the email below. Governing law, registered business identity and dispute resolution terms must be added before entering client contracts.",
              ],
            ]
          : [
              [
                "What we collect",
                "When you submit an enquiry, we collect the contact information, project details and service preferences you provide. Newsletter signups store your email address.",
              ],
              [
                "How we use it",
                "We use enquiry details to respond to your request, plan potential services and keep a record of our conversations. Newsletter subscriptions are used for studio updates; they are separate from project enquiries.",
              ],
              [
                "Data and service providers",
                "Information is stored in the studio’s database. Configured hosting and email providers may process it to operate the website and deliver messages. We do not sell your personal information.",
              ],
              [
                "Your choices",
                "You can request access, correction or deletion of your information and ask to unsubscribe by emailing the studio. A formal retention schedule and jurisdiction-specific rights must be documented before public launch.",
              ],
              [
                "Cookies and security",
                "The public site uses session storage for an introductory animation. Admin authentication uses browser session storage. No advertising trackers or third-party analytics are enabled by default.",
              ],
            ]
        ).map(([title, text]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
        <a className="text-link" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
          <ArrowUpRight size={16} />
        </a>
      </article>
    </>
  );
}
export function NotFound() {
  return (
    <section className="not-found page-enter">
      <Sprout size={70} />
      <Label>404 · A little off the path</Label>
      <h1>
        This one hasn’t
        <br />
        <em>sprouted yet.</em>
      </h1>
      <p>Let’s get you back to where the good things are growing.</p>
      <Button to="/">Back to our roots</Button>
    </section>
  );
}
