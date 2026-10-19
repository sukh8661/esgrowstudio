import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Code2,
  PenTool,
  Search,
  Compass,
  Heart,
  TrendingUp,
  Cloud,
  Sparkles,
  ShieldCheck,
  Check,
  Globe,
  MousePointer2,
} from "lucide-react";
import {
  Button,
  Label,
  SectionHead,
  PricingCards,
  Testimonials,
  Accordion,
  FinalCTA,
  useContent,
} from "./components";
import { Garden, Sprout, ProjectArt } from "./Art";
import {
  services as serviceData,
  projects as projectData,
  steps,
  posts,
} from "./content";
export const icons = {
  Code2,
  PenTool,
  Search,
  Compass,
  Heart,
  TrendingUp,
  Cloud,
  Sparkles,
  ShieldCheck,
};
export function ServiceList({ all = false }) {
  const services = useContent("services", serviceData);
  const [active, setActive] = useState(0);
  return (
    <div className="services-layout">
      <div className="service-illustration">
        <img
          className="service-reference-image"
          src="/images/glass-ribbon.webp"
          width="533"
          height="1066"
          alt=""
          loading="lazy"
        />
        <div className="service-circle" />
        <div className="browser-art">
          <div className="browser-dots">
            <i />
            <i />
            <i />
            <span>made to make a difference.</span>
          </div>
          <div className="browser-body">
            <Sprout size={32} />
            <h3>
              Your next
              <br />
              big thing.
            </h3>
            <div className="browser-pill">
              Built with purpose <ArrowUpRight size={13} />
            </div>
            <div className="browser-shape" />
          </div>
        </div>
        <div className="code-tag">&lt; ideas into impact /&gt;</div>
        <div className="design-tag">
          <PenTool size={15} /> A little craft. A lot of care.
        </div>
        <div className="service-caption">
          <span>01 — 09</span>
          <span>
            Everything connected.
            <br />
            Everything considered.
          </span>
        </div>
      </div>
      <div className="service-list">
        {(all ? services : services.slice(0, 7)).map((s, i) => {
          const Icon = icons[s.icon] || Code2;
          return (
            <Link
              to={"/services/" + s.slug}
              className={`service-row ${active === i ? "selected" : ""}`}
              key={s.slug}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="service-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="service-row-copy">
                <h3>{s.title}</h3>
                <p>{s.short}</p>
              </span>
              <span className="service-icon">
                <Icon size={19} />
              </span>
              <ArrowUpRight className="service-arrow" size={21} />
            </Link>
          );
        })}
        {!all && (
          <Link className="text-link service-all" to="/services">
            Explore all our services <ArrowUpRight size={17} />
          </Link>
        )}
      </div>
    </div>
  );
}
export function Framework({ extended = false }) {
  const [active, setActive] = useState(0);
  return (
    <div className="framework-layout">
      <div className="framework-art">
        <div className="growth-ring ring1" />
        <div className="growth-ring ring2" />
        <img
          className="framework-reference-image"
          src="/images/growth-spiral.webp"
          width="736"
          height="1308"
          alt="Sculptural pleated green ribbon twisting upward, representing a connected growth process"
          loading="lazy"
        />
        <div className="framework-tag">
          <Sprout size={18} />
          <span>
            Good growth
            <br />
            <b>takes good roots.</b>
          </span>
        </div>
        <div className="stage-tabs">
          {steps.map((s, i) => (
            <button
              key={s.name}
              onClick={() => {
                setActive(i);
                document.getElementById("step-" + i)?.scrollIntoView({
                  behavior: matchMedia("(prefers-reduced-motion:reduce)")
                    .matches
                    ? "auto"
                    : "smooth",
                  block: "center",
                });
              }}
              className={active === i ? "current" : ""}
              aria-label={`${i + 1}. Go to ${s.name}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="framework-steps">
        <div className="framework-line">
          <div className="framework-line-fill" />
        </div>
        {steps.map((s, i) => (
          <article
            className={`step reveal ${active === i ? "current" : ""}`}
            id={"step-" + i}
            key={s.name}
            onMouseEnter={() => setActive(i)}
          >
            <span className="step-number">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="step-stage">{s.stage}</span>
            <h3>{s.name}</h3>
            <p>{s.text}</p>
            {extended && (
              <small>
                Deliverable:{" "}
                {
                  [
                    "Discovery brief & project goals",
                    "Approved roadmap & project scope",
                    "Reviewed designs & tested build",
                    "Launch checklist & handover",
                    "Actionable performance review",
                  ][i]
                }
              </small>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
export function ProjectCard({ project, index = 0 }) {
  return (
    <Link className="project-card reveal" to={"/work/" + project.slug}>
      <div className="project-image">
        <ProjectArt type={project.type} />
        <span className="project-view">
          <ArrowUpRight size={22} />
        </span>
        <span className="concept-label">CONCEPT PROJECT</span>
      </div>
      <div className="project-info">
        <div>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
        </div>
        <span>{project.category}</span>
      </div>
    </Link>
  );
}
export function Home() {
  const projects = useContent("projects", projectData);
  const articles = useContent("blog", posts);
  const hero = useRef();
  const [intro, setIntro] = useState(false);
  useEffect(() => {
    if (!sessionStorage.getItem("esgrow-intro")) setIntro(true);
    const t = setTimeout(() => {
      setIntro(false);
      sessionStorage.setItem("esgrow-intro", "1");
    }, 1100);
    return () => clearTimeout(t);
  }, []);
  function parallax(e) {
    if (
      !matchMedia("(pointer:fine) and (prefers-reduced-motion:no-preference)")
        .matches
    )
      return;
    const r = e.currentTarget.getBoundingClientRect();
    hero.current?.style.setProperty(
      "--mx",
      `${(e.clientX - r.left - r.width / 2) / 65}px`,
    );
    hero.current?.style.setProperty(
      "--my",
      `${(e.clientY - r.top - r.height / 2) / 65}px`,
    );
  }
  return (
    <>
      {intro && (
        <div className="intro" aria-hidden="true">
          <Sprout size={58} />
          <span>esgrow studio</span>
        </div>
      )}
      <section
        className="hero page-enter"
        onMouseMove={parallax}
        onMouseLeave={() => {
          hero.current?.style.setProperty("--mx", "0px");
          hero.current?.style.setProperty("--my", "0px");
        }}
      >
        <picture className="hero-artwork">
          <img
            src="/images/esgrow-glass-sprout.webp"
            srcSet="/images/esgrow-glass-sprout-800.webp 800w, /images/esgrow-glass-sprout.webp 1536w"
            sizes="(max-width:700px) 100vw, 65vw"
            width="1536"
            height="1024"
            alt="An original emerald glass sprout rising beside stone steps — from roots to results"
            fetchPriority="high"
          />
        </picture>
        <div className="hero-grain" />
        <div className="hero-copy">
          <Label>Independent minds. Shared ambition.</Label>
          <h1>
            <span>Rooted in</span>
            <span>strategy.</span>
            <span>
              Designed to <em>grow.</em>
              <svg viewBox="0 0 330 20" aria-hidden="true">
                <path d="M4 14Q160-6 325 8" />
              </svg>
            </span>
          </h1>
          <p>
            We design, develop, and optimize websites that attract customers,
            convert traffic, and sustain long-term growth.
          </p>
          <div className="button-row">
            <Button to="/contact">Let’s grow your business</Button>
            <Button to="/work" outline>
              Explore our work
            </Button>
          </div>
          <div className="hero-footnote">
            <span className="little-sprout">
              <Sprout size={21} />
            </span>
            <span>
              Your ambition. Our craft.
              <br />
              <b>From Roots to Results.</b>
            </span>
          </div>
        </div>
        <div className="hero-visual" ref={hero}>
          <div className="hero-visual-ring" />
          <div className="growth-card float-one">
            <span className="card-top">
              <i /> Your next chapter
            </span>
            <div className="growth-card-title">
              Looking up.
              <span>
                <ArrowUpRight size={15} />
              </span>
            </div>
            <div className="mini-chart">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <svg viewBox="0 0 170 55">
                <path d="M0 51L26 44L44 47L66 25L90 31L115 14L136 19L168 2" />
              </svg>
            </div>
            <span className="chart-footer">
              A strong foundation. A brighter future.
            </span>
          </div>
          <div className="craft-card float-two">
            <span>
              <Check size={17} />
            </span>
            <div>
              Thoughtfully made.<small>Built for what’s next.</small>
            </div>
          </div>
          <span className="hero-coordinate">
            STRATEGY + DESIGN + TECHNOLOGY
          </span>
        </div>
        <div className="hero-bottom">
          <span>
            <i />
            Ready for your next chapter
          </span>
          <a href="#intro">
            A little scroll. A lot of possibilities. <span>↓</span>
          </a>
          <span>EST. TO HELP YOU GROW ↗</span>
        </div>
      </section>
      <div className="brand-strip">
        <span>
          BIG IDEAS.
          <br />
          <b>BETTER TOGETHER.</b>
        </span>
        <div className="marquee">
          <div className="marquee-track">
            {[0, 1].map((n) => (
              <div className="marquee-group" aria-hidden={n === 1} key={n}>
                {[
                  "Strategy",
                  "Design",
                  "Development",
                  "Search",
                  "Social",
                  "Growth",
                ].map((x, i) => (
                  <span key={x}>
                    <span className="marquee-star">✳</span>
                    {x}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <span className="strip-note">
          One studio.
          <br />
          Your whole digital world.
        </span>
      </div>
      <section id="intro" className="section about-intro">
        <div>
          <Label>A little about us</Label>
          <span className="intro-index">01 / THE STUDIO</span>
        </div>
        <div className="about-statement reveal">
          <h2>
            {"Your business has potential.".split(" ").map((word, i) => (
              <span className="reveal-word" key={"a" + i}>
                {word}{" "}
              </span>
            ))}
            <br />
            {"Let’s give it room to grow.".split(" ").map((word, i) => (
              <span className="reveal-word" key={"b" + i}>
                {word}{" "}
              </span>
            ))}
          </h2>
          <p>
            We believe a website shouldn’t just exist. It should work. Esgrow
            Studio brings design, development and digital strategy together to
            turn your next big idea into your next chapter of growth.
          </p>
          <Link className="text-link" to="/about">
            Meet your growth partners <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="bento-grid">
          <div className="bento bento-main reveal">
            <span>One partner. Every possibility.</span>
            <h3>
              Your digital world.
              <br />
              <em>All connected.</em>
            </h3>
            <div className="connected-icons">
              <span>
                <PenTool />
              </span>
              <i />
              <span>
                <Code2 />
              </span>
              <i />
              <span>
                <TrendingUp />
              </span>
            </div>
            <span className="bento-bottom">
              From your first website to your next big move.{" "}
              <ArrowUpRight size={20} />
            </span>
          </div>
          <div className="bento bento-lime reveal">
            <Sprout size={40} />
            <strong>
              <span data-count="9">9</span>
              <span>+</span>
            </strong>
            <span>
              Connected services.
              <br />
              One shared direction.
            </span>
          </div>
          <div className="bento bento-cream reveal">
            <Globe size={30} />
            <strong>
              Built here.
              <br />
              Growing <em>everywhere.</em>
            </strong>
            <span>
              Remote by nature.
              <br />
              Collaborative by choice.
            </span>
            <div className="globe-lines" />
          </div>
        </div>
      </section>
      <section className="section services-section">
        <SectionHead
          label="What we bring to the table"
          title={
            <>
              Everything you need.
              <br />
              <span>Nothing in the way.</span>
            </>
          }
          text="A strong brand. A better website. The right people finding you. We connect the dots, so you can focus on your business."
        />
        <ServiceList />
      </section>
      <section className="section work-section">
        <SectionHead
          label="Ideas, brought to life"
          title={
            <>
              Good thinking.
              <br />
              <span>Even better making.</span>
            </>
          }
          text="A glimpse into the brands and digital experiences we can build. Thoughtfully imagined. Purposefully designed."
          link="/work"
          linkText="View selected work"
        />
        <div className="work-grid">
          {projects.slice(0, 2).map((p, i) => (
            <ProjectCard project={p} index={i} key={p.slug} />
          ))}
        </div>
        <p className="concept-note">
          Selected concept work — a look at our design direction, not
          commissioned client projects.
        </p>
      </section>
      <section className="section process-section">
        <SectionHead
          label="The way we grow"
          title={
            <>
              Good things don’t
              <br />
              <span>happen by chance.</span>
            </>
          }
          text="A thoughtful process. A clear path forward. From the first conversation to the next milestone, you’ll always know where we’re going."
          link="/process"
          linkText="Our approach"
        />
        <Framework />
      </section>
      <section className="results-section reveal">
        <div>
          <Label light>Built around your business</Label>
          <h2>
            Pretty is a start.
            <br />
            <em>Progress is the goal.</em>
          </h2>
          <p>
            We connect good design with the things that matter: the right
            visitors, better conversations and a business ready for what comes
            next.
          </p>
          <Button to="/services" light>
            Make your next move
          </Button>
        </div>
        <div className="results-chart">
          <div className="chart-heading">
            <span>A CONNECTED GROWTH APPROACH</span>
            <TrendingUp size={21} />
          </div>
          <div className="chart-canvas">
            <div className="chart-gridlines" />
            <svg
              viewBox="0 0 500 210"
              role="img"
              aria-label="Illustrative growth curve, not measured performance"
            >
              <defs>
                <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#d9ed8b" stopOpacity=".25" />
                  <stop offset="1" stopColor="#d9ed8b" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 190C70 190 65 145 140 150S220 93 280 110S367 23 414 44S470 13 500 4V210H0Z"
                fill="url(#chart-fill)"
              />
              <path
                className="chart-line"
                d="M0 190C70 190 65 145 140 150S220 93 280 110S367 23 414 44S470 13 500 4"
                fill="none"
                stroke="#dbf093"
                strokeWidth="3"
              />
            </svg>
            <span className="chart-growth-tag">
              <Sprout size={15} /> Room to grow
            </span>
          </div>
          <div className="chart-axis">
            <span>GOOD FOUNDATIONS</span>
            <ArrowRight size={18} />
            <span>LONG-TERM THINKING</span>
          </div>
          <small>
            Illustration of our approach, not a performance projection.
          </small>
        </div>
      </section>
      <Testimonials />
      <section className="section pricing-section">
        <SectionHead
          label="A plan for your next chapter"
          title={
            <>
              Small beginnings.
              <br />
              <span>Big possibilities.</span>
            </>
          }
          text="Clear starting points, thoughtfully scoped. Choose your foundation and we’ll shape the details around your business."
        />
        <PricingCards />
      </section>
      <section className="section journal-section">
        <SectionHead
          label="Fresh from the studio"
          title={
            <>
              A few things
              <br />
              <span>worth growing on.</span>
            </>
          }
          link="/blog"
          linkText="All field notes"
        />
        <div className="journal-grid">
          {articles.slice(0, 3).map((p, i) => (
            <Link
              to={"/blog/" + p.slug}
              className="journal-card reveal"
              key={p.slug}
            >
              <div className={"journal-art journal-art-" + i}>
                <img
                  className="journal-media"
                  src={`/images/${["sage-waves", "growth-spiral", "emerald-fold"][i % 3]}.webp`}
                  alt=""
                  loading="lazy"
                  width="736"
                  height="1308"
                />
                {i === 0 ? (
                  <>
                    <span>
                      A better
                      <br />
                      web.
                    </span>
                    <MousePointer2 size={65} />
                  </>
                ) : i === 1 ? (
                  <>
                    <Search size={80} />
                    <span>
                      Find your
                      <br />
                      people.
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      Make it
                      <br />
                      <em>click.</em>
                    </span>
                    <ArrowUpRight size={90} />
                  </>
                )}
              </div>
              <div className="article-meta">
                <span>{p.category}</span>
                <span>{p.read} min read</span>
              </div>
              <h3>{p.title}</h3>
              <span className="text-link">
                Read the story <ArrowUpRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section faq-section">
        <div>
          <Label>A little clarity</Label>
          <h2>
            Good questions.
            <br />
            <span>Honest answers.</span>
          </h2>
          <p>Something else on your mind?</p>
          <Link to="/contact" className="text-link">
            We’re happy to help <ArrowUpRight size={18} />
          </Link>
        </div>
        <Accordion />
      </section>
    </>
  );
}

export default Home;
