import { Link } from "react-router-dom";
import "./LandingPage.css";
import dashboardChartsImg from "../assets/screenshots/dashboard-charts.png";
import workoutsDayImg from "../assets/screenshots/workouts-day.png";
import exerciseHistoryImg from "../assets/screenshots/exercise-history.png";
import createExerciseImg from "../assets/screenshots/create-exercise.png";

const FEATURES = [
  {
    title: "Know where your volume goes",
    description:
      "Category breakdowns show exactly how your week splits — back, legs, shoulders — so you spot the muscle group you keep skipping.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 1 9 9h-9z" />
      </svg>
    ),
  },
  {
    title: "PRs that track themselves",
    description:
      "Every heaviest lift and highest rep set gets flagged the moment you log it. No manual math, no forgetting your own numbers.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
        <path d="M17 5h3a2 2 0 0 1-2 5M7 5H4a2 2 0 0 0 2 5" />
      </svg>
    ),
  },
  {
    title: "See the climb, not just the number",
    description:
      "Full history for every exercise, laid out set by set — so the jump from 100kg to 130kg actually feels earned.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M18.7 8l-5.1 5.1-3-3L3 17.4" />
      </svg>
    ),
  },
  {
    title: "Metrics that fit the exercise",
    description:
      "Weight and reps for lifting, distance and pace for cardio. Switch between kg/lb or km/mi anytime — even your old records convert instantly. Build categories with only the metrics that actually apply.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 21v-7M4 10V3M12 21v-11M12 6V3M20 21v-5M20 12V3" />
        <path d="M1 14h6M9 8h6M17 16h6" />
      </svg>
    ),
  },
];

const SHOWCASE = [
  {
    image: workoutsDayImg,
    alt: "Workouts day view with logged sets and PR trophies",
    title: "Log a full day in seconds",
    description:
      "Every exercise, every set, with PR trophies flagged automatically as you go.",
  },
  {
    image: exerciseHistoryImg,
    alt: "Exercise history showing progressive overload over time",
    title: "Progress, laid out by date",
    description:
      "Scroll back through every session for an exercise and watch the numbers climb.",
  },
  {
    image: createExerciseImg,
    alt: "Create exercise modal with configurable metrics",
    title: "Metrics you actually need",
    description:
      "Toggle weight, reps, duration, distance, or heart rate per exercise — nothing forced.",
  },
];

function ForgeFitMark({ size = 26 }) {
  return (
    <svg
      className="ff-logo-icon"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="22,82 50,54 78,82" opacity="0.35" />
      <polyline points="22,64 50,36 78,64" opacity="0.65" />
      <polyline points="22,46 50,18 78,46" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="ff-landing">
      <nav className="ff-nav">
        <div className="ff-wrap ff-nav-inner">
          <div className="ff-logo">
            <ForgeFitMark />
            ForgeFit
          </div>
          <div className="ff-nav-links">
            <a href="#features">Features</a>
            <a href="#showcase">Showcase</a>
            <a href="https://github.com/Shaurya03/forgefit.git" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
          <Link to="/signup" className="ff-btn ff-btn-primary ff-btn-sm">
            Get started
          </Link>
        </div>
      </nav>

      <section className="ff-hero">
        <div className="ff-hero-glow" aria-hidden="true" />
        <div className="ff-wrap ff-hero-inner">
          <div className="ff-eyebrow">
            <span className="ff-dot" aria-hidden="true" />
            Built for lifters who track everything
          </div>
          <h1>
            Every set. Every rep.
            <br />
            Every <span>record</span>, in one place.
          </h1>
          <p className="ff-sub">
            ForgeFit turns your training log into a real dashboard — category
            breakdowns, volume trends, and personal records that track
            themselves. No spreadsheets.
          </p>
          <div className="ff-hero-ctas">
            <Link to="/signup" className="ff-btn ff-btn-primary">
              Start training
            </Link>
            <a
              href="https://github.com/Shaurya03/forgefit.git"
              target="_blank"
              rel="noreferrer"
              className="ff-btn ff-btn-ghost"
            >
              View on GitHub
            </a>
          </div>


          <div className="ff-hero-visual">
            <div className="ff-floating-card ff-fc-1">
              <div className="ff-fc-label">Highest weight</div>
              <div className="ff-fc-value ff-ember">160 kg</div>
              <div className="ff-fc-sub">Conventional deadlift</div>
            </div>
            <div className="ff-hero-shot-frame">
              <div className="ff-hero-shot-topbar">
                <span />
                <span />
                <span />
              </div>
              <img
                src={dashboardChartsImg}
                alt="ForgeFit dashboard category breakdown chart"
              />
            </div>
            <div className="ff-floating-card ff-fc-2">
              <div className="ff-fc-label">This week's volume</div>
              <div className="ff-fc-value ff-teal">15,582 kg</div>
              <div className="ff-fc-sub">Across 5 workouts</div>
            </div>
          </div>
        </div>
      </section>

      <section className="ff-section" id="features">
        <div className="ff-wrap">
          <div className="ff-section-head">
            <div className="ff-kicker">Why ForgeFit</div>
            <h2>Built to feel like a coach, not a spreadsheet</h2>
            <p>
              Every screen is designed around one question: what should I do
              next week?
            </p>
          </div>
          <div className="ff-features">
            {FEATURES.map((f) => (
              <div className="ff-feature-card" key={f.title}>
                <div className="ff-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ff-section ff-section-tight" id="showcase">
        <div className="ff-wrap">
          <div className="ff-section-head">
            <div className="ff-kicker">Inside the app</div>
            <h2>Every screen, built for the gym floor</h2>
            <p>
              Fast to log, dense with the numbers that matter — nothing
              decorative in your way.
            </p>
          </div>
          <div className="ff-showcase-grid">
            {SHOWCASE.map((item) => (
              <div className="ff-showcase-item" key={item.title}>
                <img src={item.image} alt={item.alt} />
                <div className="ff-showcase-caption">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ff-section ff-section-cta-wrap">
        <div className="ff-wrap">
          <div className="ff-final-cta">
            <h2>Your training deserves better than a notes app.</h2>
            <p>Start logging in under a minute. Forge your strongest self.</p>
            <div className="ff-hero-ctas">
              <Link to="/signup" className="ff-btn ff-btn-primary">
                Get started
              </Link>
              <a
                href="https://github.com/Shaurya03/forgefit.git"
                target="_blank"
                rel="noreferrer"
                className="ff-btn ff-btn-ghost"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="ff-footer">
        <div className="ff-wrap ff-footer-inner">
          <div>
            <div className="ff-logo ff-logo-sm">
              <ForgeFitMark size={20} />
              ForgeFit
            </div>
            <div className="ff-footer-copy">
              A fitness tracker built to feel like a real product.
            </div>
          </div>
          <div className="ff-footer-links">
            <a href="https://github.com/Shaurya03/forgefit.git" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="#features">Features</a>
            <a href="#showcase">Showcase</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
