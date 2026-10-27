import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './OrangeAcornGames.css';
import useStudioTab from './useStudioTab';

const embed = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&iv_load_policy=3&controls=0&disablekb=1&playsinline=1&autoplay=0&mute=1&loop=1&playlist=${id}&enablejsapi=1`;

// Newest first. `world` picks the per-game theme in the CSS (oag-world--<world>).
const projects = [
  {
    world: 'gunboat8',
    title: 'GUNBOAT-8',
    logo: 'images/gunboat8_logo.png',
    tags: ['Naval bullet-heaven roguelike', '1-4 players'],
    description:
      'Command the ultimate vessel in this fast-paced naval bullet-heaven roguelike. Blast through enemy fleets, collect powerful upgrades, and combine devastating synergies to create wildly overpowered builds before the waves overwhelm you.',
    youtube: 'tiSlXhgKisw',
    links: [
      {
        label: 'Wishlist on Steam',
        url: 'https://store.steampowered.com/app/4783980/GUNBOAT8/',
        icon: 'fab fa-steam',
      },
    ],
  },
  {
    world: 'holding-pattern',
    title: 'Holding Pattern',
    image: 'images/holding_pattern.png',
    tags: ['A minimal incremental game'],
    description:
      'Holding Pattern is a minimal incremental game about protecting your galaxy from invaders.',
    youtube: '1oi_eQVmBBY',
    links: [
      {
        label: 'Steam',
        url: 'https://store.steampowered.com/app/4309180/Holding_Pattern/',
        icon: 'fab fa-steam',
      },
      {
        label: 'Itch.io',
        url: 'https://matt-neave.itch.io/holding-pattern',
        icon: 'fab fa-itch-io',
      },
    ],
  },
];

const clamp01 = (v) => Math.min(1, Math.max(0, v));

// Where in a world's scroll the game is fully revealed — its resting stop.
const WORLD_REST = 0.5;
const STEP_MS = 700;

// Ease-out, so the page moves the instant you scroll.
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

// Scroll positions of every [data-oag-stop] element, in page order. The value
// is how far through the element's pinned scroll to stop, or "end" for the
// bottom of the page.
function getStops() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  return [...document.querySelectorAll('[data-oag-stop]')].map((el) => {
    const at = el.dataset.oagStop;
    if (at === 'end') return maxScroll;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const pinned = Math.max(0, el.offsetHeight - window.innerHeight);
    return Math.min(maxScroll, Math.round(top + parseFloat(at) * pinned));
  });
}

const nearestStop = (stops, y) =>
  stops.reduce((best, s, i) => (Math.abs(s - y) < Math.abs(stops[best] - y) ? i : best), 0);

// Wheel, keys and swipes move one stop at a time with an eased glide, so you
// always land exactly on a game. Anything else (scrollbar drag, find-in-page)
// settles to the nearest stop once scrolling stops.
function useStepScroll() {
  const [active, setActive] = useState(0);
  const animRef = useRef(null);
  const activeRef = useRef(0);

  const goTo = useCallback((index) => {
    const stops = getStops();
    const i = Math.max(0, Math.min(stops.length - 1, index));
    const from = window.scrollY;
    const to = stops[i];
    activeRef.current = i;
    setActive(i);
    cancelAnimationFrame(animRef.current?.frame);
    if (Math.abs(to - from) < 2) {
      animRef.current = null;
      return;
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduce ? 1 : STEP_MS;
    const start = performance.now();
    const anim = { frame: 0 };
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      window.scrollTo({ top: from + (to - from) * easeOutCubic(t), behavior: 'instant' });
      if (t < 1) {
        anim.frame = requestAnimationFrame(tick);
      } else {
        animRef.current = null;
      }
    };
    animRef.current = anim;
    anim.frame = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    let lastWheel = 0;
    let gestureStart = 0;
    let avgMag = 0;
    let stepped = true;
    let touchY = null;
    let settle = 0;

    // Mid-glide input retargets from wherever the page is, so it never feels ignored.
    const step = (dir) => goTo(activeRef.current + dir);

    const onWheel = (e) => {
      if (e.ctrlKey) return; // pinch-zoom
      e.preventDefault();
      const now = performance.now();
      const mag = Math.abs(e.deltaY);
      // Trackpads keep firing ever-weaker inertial events after a swipe. A new
      // gesture is either a pause, or — once a swipe has had time to ramp up and
      // start coasting — a sudden jump in strength out of that tail.
      const paused = now - lastWheel > 150;
      const coasting = now - gestureStart > 300;
      lastWheel = now;
      if (paused || (coasting && mag > avgMag * 2.5 && mag > 30)) {
        gestureStart = now;
        avgMag = mag;
        stepped = false;
      } else {
        avgMag = avgMag * 0.7 + mag * 0.3;
      }
      // One step per gesture, on its first meaningful event.
      if (!stepped && mag > 2) {
        stepped = true;
        step(Math.sign(e.deltaY));
      }
    };

    const onKey = (e) => {
      if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
      const keys = {
        ArrowDown: 1, PageDown: 1, ' ': e.shiftKey ? -1 : 1,
        ArrowUp: -1, PageUp: -1,
      };
      if (e.key === 'Home') { e.preventDefault(); goTo(0); return; }
      if (e.key === 'End') { e.preventDefault(); goTo(getStops().length - 1); return; }
      if (keys[e.key]) {
        e.preventDefault();
        step(keys[e.key]);
      }
    };

    const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e) => { if (touchY !== null) e.preventDefault(); };
    const onTouchEnd = (e) => {
      if (touchY === null) return;
      const dy = touchY - e.changedTouches[0].clientY;
      touchY = null;
      if (Math.abs(dy) > 40) step(Math.sign(dy));
    };

    const onScroll = () => {
      if (animRef.current) return;
      clearTimeout(settle);
      settle = setTimeout(() => {
        if (!animRef.current) goTo(nearestStop(getStops(), window.scrollY));
      }, 180);
    };

    activeRef.current = nearestStop(getStops(), window.scrollY);
    setActive(activeRef.current);

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(settle);
      cancelAnimationFrame(animRef.current?.frame);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('scroll', onScroll);
    };
  }, [goTo]);

  return [active, goTo];
}

function Stepper({ labels, active, onSelect }) {
  return (
    <nav className="oag-stepper" aria-label="Sections">
      {labels.map((label, i) => (
        <button
          key={label}
          className={`oag-step ${i === active ? 'oag-step-active' : ''}`}
          onClick={() => onSelect(i)}
          aria-current={i === active ? 'true' : undefined}
        >
          <span className="oag-step-label">{label}</span>
          <span className="oag-step-dot" />
        </button>
      ))}
    </nav>
  );
}

function ContactButton({ className, label = 'Contact Us' }) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(() => {
    const addr = 'matt' + '@' + 'orangeacorngames.com';
    navigator.clipboard.writeText(addr).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <button
      className={`oag-contact-btn ${copied ? 'oag-copied' : ''} ${className || ''}`}
      onClick={handleClick}
    >
      <i className="fas fa-envelope"></i>
      <span className="oag-contact-label">{label}</span>
      <span className="oag-contact-hover">Copy Email</span>
      <span className="oag-contact-copied">Copied!</span>
    </button>
  );
}

// A tall section whose stage pins to the viewport. Scrolling through it grows
// the trailer from a framed window to full-bleed, then reveals the game's info.
function GameWorld({ project, latest }) {
  const sectionRef = useRef(null);
  const iframeRef = useRef(null);
  const playingRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp01(-rect.top / (rect.height - vh));

      section.style.setProperty('--enter', clamp01(p / 0.3).toFixed(4));
      section.style.setProperty('--show', clamp01((p - 0.32) / 0.15).toFixed(4));
      section.style.setProperty('--leave', clamp01((p - 0.88) / 0.12).toFixed(4));

      // Start a screen early so the trailer is already rolling when you arrive.
      const inView = rect.top < 2 * vh && rect.bottom > -vh;
      const iframe = iframeRef.current;
      if (inView !== playingRef.current && iframe && iframe.contentWindow) {
        playingRef.current = inView;
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: inView ? 'playVideo' : 'pauseVideo', args: '' }),
          '*'
        );
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    section.addEventListener('oag-sync', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      section.removeEventListener('oag-sync', onScroll);
    };
  }, []);

  const retryRef = useRef(0);
  useEffect(() => () => clearInterval(retryRef.current), []);

  // The iframe may finish loading while already in range; start it then. The
  // player ignores commands until it's ready, so resend for the first few seconds.
  const onTrailerLoad = useCallback(() => {
    let tries = 0;
    clearInterval(retryRef.current);
    retryRef.current = setInterval(() => {
      playingRef.current = false;
      sectionRef.current.dispatchEvent(new Event('oag-sync'));
      if (++tries >= 12) clearInterval(retryRef.current);
    }, 250);
  }, []);

  return (
    <section
      className={`oag-world oag-world--${project.world}`}
      ref={sectionRef}
      data-oag-stop={WORLD_REST}
    >
      <div className="oag-stage">
        <div className="oag-window">
          {project.image && <img src={project.image} alt="" className="oag-window-fallback" />}
          <iframe
            ref={iframeRef}
            src={embed(project.youtube)}
            title={`${project.title} trailer`}
            className="oag-window-trailer"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            tabIndex={-1}
            onLoad={onTrailerLoad}
          />
          <div className="oag-window-atmosphere" />
        </div>

        <div className="oag-world-content">
          {latest && <span className="oag-world-new">New!</span>}
          {project.logo ? (
            <h3 className="oag-world-title">
              <img src={project.logo} alt={project.title} />
            </h3>
          ) : (
            <h3 className="oag-world-title">
              {project.title.split(' ').map((word) => (
                <span key={word}>{word}</span>
              ))}
            </h3>
          )}
          <p className="oag-world-tagline">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </p>
          <p className="oag-world-description">{project.description}</p>
          <div className="oag-world-links">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="oag-world-link"
              >
                <i className={link.icon}></i> {link.label}
              </a>
            ))}
            <a
              href={`https://www.youtube.com/watch?v=${project.youtube}`}
              target="_blank"
              rel="noopener noreferrer"
              className="oag-world-link oag-world-link-secondary"
            >
              <i className="fas fa-play"></i> Watch trailer
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const stepLabels = ['Home', ...projects.map((p) => p.title), 'Say hello'];

function OrangeAcornGames() {
  const [active, goTo] = useStepScroll();
  useStudioTab();

  return (
    <div className="oag-page">
      <Stepper labels={stepLabels} active={active} onSelect={goTo} />

      <section className="oag-intro" data-oag-stop="0">
        <header className="oag-header">
          <span className="oag-header-title">Orange Acorn Games</span>
          <nav className="oag-header-nav">
            <Link to="/orange-acorn-games/blog" className="oag-header-link">Blog</Link>
            <ContactButton className="oag-header-contact" />
          </nav>
        </header>

        <div className="oag-intro-body">
          <img
            src="images/orange_acorn_logo.png"
            alt=""
            className="oag-intro-logo"
          />
          <h1 className="oag-hero-title">Orange Acorn Games</h1>
          <p className="oag-hero-subtitle">Crafting memorable experiences.</p>
          <p className="oag-about-text">
            Orange Acorn Games is a small indie studio with a passion for
            creating games that are equal parts charming and engaging. We
            believe the best games are the ones that make you smile, think,
            and come back for just one more round.
          </p>
        </div>

        <div className="oag-divider">
          <span className="oag-divider-text">Check out our projects</span>
          <div className="oag-divider-arrow">&#8595;</div>
        </div>
      </section>

      {projects.map((project, i) => (
        <GameWorld key={project.world} project={project} latest={i === 0} />
      ))}

      <section className="oag-outro" data-oag-stop="end">
        <img src="images/orange_acorn_logo.png" alt="" className="oag-outro-logo" />
        <h2 className="oag-outro-title">Say hello!</h2>
        <p className="oag-outro-text">
          Press, collaborations, bug reports, or just to say hi.
        </p>
        <ContactButton />
      </section>

      <footer className="oag-footer">
        &copy; {new Date().getFullYear()} Orange Acorn Games. All rights reserved.
      </footer>
    </div>
  );
}

export default OrangeAcornGames;
