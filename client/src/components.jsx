import React, { useContext, useEffect, useRef, useState } from "react";
import { ContentContext } from "./ContentContext";
import useFocusTrap from "./useFocusTrap";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  Minus,
  Menu,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Instagram,
  MessageCircle,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Sprout, Garden } from "./Art";
import { siteConfig } from "./siteConfig";
import { faqs, testimonials as samples } from "./content";
import { api, post } from "./api";
gsap.registerPlugin(ScrollTrigger);
export function Button({
  to,
  children,
  light = false,
  outline = false,
  className = "",
  ...props
}) {
  const cl = `button ${light ? "light" : ""} ${outline ? "outline" : ""} ${className}`;
  return to ? (
    <Link className={cl} to={to} {...props}>
      {children}
      <ArrowUpRight size={17} />
    </Link>
  ) : (
    <button className={cl} {...props}>
      {children}
      <ArrowUpRight size={17} />
    </button>
  );
}
export function Label({ children, light = false }) {
  return (
    <span className={`eyebrow ${light ? "on-dark" : ""}`}>
      <span />
      {children}
    </span>
  );
}
export function SectionHead({
  label,
  title,
  text,
  link,
  linkText = "Explore more",
}) {
  return (
    <div className="section-head reveal">
      <div>
        <Label>{label}</Label>
        <h2>{title}</h2>
      </div>
      <div className="section-head-right">
        {text && <p>{text}</p>}
        {link && (
          <Link className="text-link" to={link}>
            {linkText}
            <ArrowUpRight size={18} />
          </Link>
        )}
      </div>
    </div>
  );
}
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const headerRef = useRef();
  useFocusTrap(headerRef, open, () => setOpen(false));
  useEffect(() => {
    setOpen(false);
  }, [location]);
  useEffect(() => {
    let prev = window.scrollY;
    const listener = () => {
      setHidden(window.scrollY > 180 && window.scrollY > prev && !open);
      prev = window.scrollY;
    };
    window.addEventListener("scroll", listener, { passive: true });
    return () => window.removeEventListener("scroll", listener);
  }, [open]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header
        ref={headerRef}
        onFocusCapture={() => setHidden(false)}
        className={`nav-shell ${hidden ? "nav-hidden" : ""}`}
      >
        <Link to="/" className="brand" aria-label="Esgrow Studio home">
          <Sprout />
          <span>
            esgrow <span className="brand-studio">STUDIO</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className={open ? "open" : ""}>
          {[
            "Services",
            "Work",
            "Process",
            "Pricing",
            "About",
            "Blog",
            "Contact",
          ].map((x) => (
            <Link
              key={x}
              className={
                location.pathname.startsWith("/" + x.toLowerCase())
                  ? "active"
                  : ""
              }
              to={"/" + x.toLowerCase()}
            >
              {x}
            </Link>
          ))}
        </nav>
        <Link to="/get-a-quote" className="nav-cta">
          Let’s talk <ArrowUpRight size={16} />
        </Link>
        <button
          className="menu-button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </header>
    </>
  );
}
export function Motion() {
  const { pathname } = useLocation();
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo(0, 0);
    if (reduce) return;
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      anchors: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    const cleanupListeners = [];
    const ctx = gsap.context(() => {
      if (document.querySelector(".hero-artwork"))
        gsap.to(".hero-artwork", {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      gsap.fromTo(
        ".footer-landscape",
        { "--landscape-drift": "0px" },
        {
          "--landscape-drift": "-35px",
          ease: "none",
          scrollTrigger: {
            trigger: ".footer-landscape",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
          },
        },
      );
      if (document.querySelector(".reveal-word"))
        gsap.fromTo(
          ".reveal-word",
          { color: "#9aa58b" },
          {
            color: "#243e33",
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: ".about-statement",
              start: "top 85%",
              end: "top 35%",
              scrub: 1,
            },
          },
        );
      if (matchMedia("(pointer:fine)").matches)
        document.querySelectorAll(".button").forEach((button) => {
          const xTo = gsap.quickTo(button, "x", {
              duration: 0.4,
              ease: "power3.out",
            }),
            yTo = gsap.quickTo(button, "y", {
              duration: 0.4,
              ease: "power3.out",
            });
          const move = (e) => {
            const r = button.getBoundingClientRect();
            xTo((e.clientX - r.left - r.width / 2) * 0.12);
            yTo((e.clientY - r.top - r.height / 2) * 0.15);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
          };
          button.addEventListener("pointermove", move);
          button.addEventListener("pointerleave", leave);
          cleanupListeners.push(() => {
            button.removeEventListener("pointermove", move);
            button.removeEventListener("pointerleave", leave);
          });
        });
      gsap.fromTo(
        ".page-enter",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      );
      document.querySelectorAll(".reveal").forEach((el) =>
        gsap.fromTo(
          el,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 94%", once: true },
          },
        ),
      );
      document.querySelectorAll("[data-count]").forEach((el) => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: Number(el.dataset.count),
          duration: 1.5,
          roundProps: "v",
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
          onUpdate: () => {
            el.textContent = obj.v;
          },
        });
      });
      if (document.querySelector(".framework-line-fill"))
        gsap.to(".framework-line-fill", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".framework-steps",
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        });
    });
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 350);
    return () => {
      clearTimeout(refresh);
      cleanupListeners.forEach((cleanup) => cleanup());
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove(tick);
    };
  }, [pathname]);
  return null;
}
export function Cursor() {
  const ref = useRef();
  useEffect(() => {
    if (
      !matchMedia("(pointer:fine) and (prefers-reduced-motion:no-preference)")
        .matches
    )
      return;
    const move = (e) => {
      const el = ref.current;
      if (!el) return;
      el.style.opacity = "1";
      el.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
      const project = e.target.closest(".project-card");
      el.classList.toggle("view", !!project);
      el.classList.toggle("hovering", !!e.target.closest("a,button"));
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return (
    <div className="cursor" ref={ref}>
      <span>View ↗</span>
    </div>
  );
}
export function ScrollProgress() {
  const ref = useRef();
  useEffect(() => {
    const f = () => {
      if (ref.current)
        ref.current.style.transform = `scaleY(${window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`;
    };
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <div className="scroll-vine" aria-hidden="true">
      <div ref={ref} />
    </div>
  );
}
export function Accordion({ items: suppliedItems }) {
  const entries = useContent("faqs", faqs);
  const items = suppliedItems || entries;
  const [active, setActive] = useState(0);
  return (
    <div className="accordion">
      {items.map((x, i) => (
        <div
          className={`faq-item ${active === i ? "expanded" : ""}`}
          key={x.question}
        >
          <h3>
            <button
              aria-expanded={active === i}
              aria-controls={`faq-${i}`}
              onClick={() => setActive(active === i ? -1 : i)}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {x.question}
              {active === i ? <Minus size={18} /> : <Plus size={18} />}
            </button>
          </h3>
          <div id={`faq-${i}`} hidden={active !== i}>
            <p>{x.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
export function PricingCards({ full = false }) {
  const [monthly, setMonthly] = useState(false);
  return (
    <>
      <div
        className="pricing-toggle"
        role="group"
        aria-label="Pricing billing period"
      >
        <button
          className={!monthly ? "selected" : ""}
          aria-pressed={!monthly}
          onClick={() => setMonthly(false)}
        >
          Project-based
        </button>
        <button
          className={monthly ? "selected" : ""}
          aria-pressed={monthly}
          onClick={() => setMonthly(true)}
        >
          Monthly care
        </button>
      </div>
      <div className="pricing-grid">
        {siteConfig.pricing.map((p, i) => (
          <article
            className={`price-card reveal ${p.featured ? "featured" : ""}`}
            key={p.name}
          >
            {p.featured && (
              <span className="recommended">A LITTLE ROOM TO GROW</span>
            )}
            <Sprout size={34} />
            <h3>{p.name}</h3>
            <p>{p.subtitle}</p>
            <div className="price">
              <small>From</small>₹
              {(monthly ? p.monthly : p.once).toLocaleString("en-IN")}
              <span>/{monthly ? "month" : "project"}</span>
            </div>
            <Button
              to={`/get-a-quote?package=${p.name}`}
              light={p.featured}
              outline={!p.featured}
            >
              Let’s plant the seed
            </Button>
            <ul>
              {(monthly
                ? [
                    "Monthly planning & reporting",
                    i === 0
                      ? "Website care & updates"
                      : "Website & conversion improvements",
                    i === 2
                      ? "Multi-channel growth support"
                      : "Content & search improvements",
                    "A clear monthly scope",
                    ...p.features.slice(-1),
                  ]
                : p.features
              ).map((x) => (
                <li key={x}>
                  <Check size={15} />
                  {x}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="fine-print">
        Indicative pricing in INR. Final scope, taxes, platform costs and ad
        spend are quoted separately.{" "}
        <Link to="/contact">Need something custom? Let’s talk ↗</Link>
      </p>
      {full && (
        <div className="addon-row">
          <h3>A little extra support.</h3>
          <p>
            Content writing · Brand identity · Managed hosting · Ongoing SEO ·
            Campaign management
          </p>
          <Link to="/get-a-quote" className="text-link">
            Build your own package <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
    </>
  );
}
export function Testimonials() {
  const initial = useContext(ContentContext);
  const [items, setItems] = useState(initial.testimonials || samples),
    [active, setActive] = useState(0),
    [paused, setPaused] = useState(false);
  useEffect(() => {
    api("/testimonials")
      .then((d) => {
        if (d.length) setItems(d);
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (paused || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const t = setInterval(() => setActive((x) => (x + 1) % items.length), 6500);
    return () => clearInterval(t);
  }, [paused, items.length]);
  const item = items[active % items.length];
  return (
    <section
      className="section testimonial-section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="testimonial-intro">
        <Label>The partnership</Label>
        <h2>
          Good work starts
          <br />
          with good people.
        </h2>
        <p>
          Clear conversations. Shared ambitions.
          <br />A team in your corner.
        </p>
        <small>
          Illustrative client perspectives — replace with
          <br />
          verified testimonials before public launch.
        </small>
        <div className="carousel-controls">
          <button
            aria-label="Previous perspective"
            onClick={() =>
              setActive((active - 1 + items.length) % items.length)
            }
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Next perspective"
            onClick={() => setActive((active + 1) % items.length)}
          >
            <ChevronRight size={18} />
          </button>
          <span>
            {String(active + 1).padStart(2, "0")}{" "}
            <span> / {String(items.length).padStart(2, "0")}</span>
          </span>
          <button className="carousel-pause" onClick={() => setPaused(!paused)}>
            {paused ? "Play" : "Pause"}
          </button>
        </div>
      </div>
      <div className="testimonial-visual">
        <img
          src="/images/sage-waves.webp"
          width="736"
          height="1309"
          alt="Soft translucent sage glass ribbons"
          loading="lazy"
        />
        <span className="partnership-sprout" aria-hidden="true">
          <Sprout size={64} />
        </span>
        <span className="visual-note">Better together. By design.</span>
      </div>
      <article className="quote-card" aria-live="polite">
        <span className="quote-mark">“</span>
        <span className="result-badge">{item.result}</span>
        <blockquote>“{item.quote}”</blockquote>
        <div className="quote-person">
          <span className="avatar">
            <Sprout size={21} />
          </span>
          <div>
            <b>{item.name}</b>
            <small>{item.role}</small>
          </div>
        </div>
      </article>
    </section>
  );
}
export function FinalCTA() {
  return (
    <section className="final-cta reveal" aria-label="Grow with Esgrow Studio">
      <span className="cta-flower" aria-hidden="true">
        ✳
      </span>
      <Label>Big ambitions start with a small conversation</Label>
      <h2>
        Let’s grow something
        <br />
        <em>good.</em> Together.
      </h2>
      <p>Your next chapter deserves a better digital beginning.</p>
      <div className="button-row">
        <Button to="/contact">Book a free call</Button>
        <Button to="/get-a-quote" outline>
          Tell us about your project
        </Button>
      </div>
      <div className="cta-orbit" aria-hidden="true" />
    </section>
  );
}
export function Footer() {
  const [email, setEmail] = useState(""),
    [state, setState] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setState("");
    try {
      await post("/newsletter/subscribe", { email, website: "" });
      setState("You’re on the list. Here’s to good growth.");
      setEmail("");
    } catch (err) {
      setState(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="footer-landscape">
      <FinalCTA />
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-intro">
            <Link className="brand" to="/">
              <Sprout />
              <span>
                esgrow <span className="brand-studio">STUDIO</span>
              </span>
            </Link>
            <h3>
              A little insight.
              <br />A lot of possibility.
            </h3>
            <p>Thoughts on design, business and growing online.</p>
            <form onSubmit={submit} className="newsletter">
              <label className="sr-only" htmlFor="newsletter-email">
                Your email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
              />
              <button disabled={busy} aria-label="Subscribe to newsletter">
                {busy ? "…" : <ArrowUpRight size={20} />}
              </button>
            </form>
            <div role="status" className="newsletter-status">
              {state}
            </div>
          </div>
          <div className="footer-links">
            <div>
              <h4>What we do</h4>
              <Link to="/services/web-design">Web design</Link>
              <Link to="/services/website-development">Development</Link>
              <Link to="/services/seo">SEO & strategy</Link>
              <Link to="/services/performance-marketing">
                Performance marketing
              </Link>
              <Link to="/services/hosting-cloud">Hosting & cloud</Link>
            </div>
            <div>
              <h4>The studio</h4>
              <Link to="/about">Our story</Link>
              <Link to="/work">Selected work</Link>
              <Link to="/process">Our process</Link>
              <Link to="/blog">Field notes</Link>
              <Link to="/pricing">Packages</Link>
            </div>
            <div>
              <h4>Say hello</h4>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              <Link to="/contact">Let’s connect ↗</Link>
              <Link to="/get-a-quote">Start a project ↗</Link>
              <span className="availability">
                <i />
                Open for good collaborations
              </span>
              <div className="footer-socials">
                {Object.entries(siteConfig.socials)
                  .filter(([, url]) => url)
                  .map(([name, url]) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {name}
                      <ArrowUpRight size={12} />
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          esgrow<span>✳</span>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Esgrow Studio. From Roots to Results.
          </span>
          <div>
            <Link to="/privacy-policy">Privacy policy</Link>
            <Link to="/terms">Terms of service</Link>
            <a href="#main" aria-label="Back to top">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
export function ContactFloat() {
  return (
    <Link
      className="contact-float"
      to={
        siteConfig.whatsapp
          ? `https://wa.me/${siteConfig.whatsapp}`
          : "/contact"
      }
      aria-label="Chat with Esgrow Studio"
    >
      <MessageCircle size={22} />
    </Link>
  );
}
export function useContent(resource, fallback) {
  const initial = useContext(ContentContext);
  const [data, setData] = useState(initial[resource] || fallback);
  useEffect(() => {
    let active = true;
    api("/" + resource)
      .then((d) => {
        if (active) setData(Array.isArray(d) ? d : d.items);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [resource]);
  return data;
}
