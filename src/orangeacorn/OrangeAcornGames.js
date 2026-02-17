import React, { useCallback, useEffect, useRef, useState } from 'react';
import './OrangeAcornGames.css';

const projects = [
  {
    title: 'Holding Pattern',
    description:
      'Holding Pattern is a minimal incremental game about protecting your galaxy from invaders.',
    image: 'images/holding_pattern.png',
    trailer: 'https://www.youtube-nocookie.com/embed/1oi_eQVmBBY?rel=0&modestbranding=1&iv_load_policy=3&autoplay=0&mute=1&loop=1&playlist=1oi_eQVmBBY&enablejsapi=1',
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

function ContactButton({ className, label = 'Contact Us' }) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(() => {
    const addr = 'test' + '@' + 'gmail.com';
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

function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('oag-visible');
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function ProjectSection({ project }) {
  const sectionRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('oag-visible');
        }

        const iframe = iframeRef.current;
        if (!iframe || !iframe.contentWindow) return;

        const cmd = entry.isIntersecting ? 'playVideo' : 'pauseVideo';
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: cmd, args: '' }),
          '*'
        );
      },
      { threshold: 0.5 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="oag-snap-section oag-project-section" ref={sectionRef}>
      <div className="oag-project-media-wrap">
        {project.trailer ? (
          <iframe
            ref={iframeRef}
            src={project.trailer}
            title={`${project.title} trailer`}
            className="oag-project-trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img
            src={project.image}
            alt={project.title}
            className="oag-project-image"
          />
        )}
      </div>
      <div className="oag-project-content">
        <h3 className="oag-project-title">{project.title}</h3>
        <p className="oag-project-description">{project.description}</p>
        <div className="oag-project-links">
          {project.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="oag-project-link"
            >
              <i className={link.icon}></i> {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrangeAcornGames() {
  return (
    <div className="oag-page">
      <header className="oag-header">
        <div className="oag-header-inner">
          <img
            src="images/orange_acorn_logo.png"
            alt="Orange Acorn Games"
            className="oag-logo"
          />
          <span className="oag-header-title">Orange Acorn Games</span>
        </div>
        <ContactButton className="oag-header-contact" />
      </header>

      <div className="oag-scroll-container">
      <section className="oag-snap-section oag-intro">
        <div className="oag-intro-body">
          <h1 className="oag-hero-title">Orange Acorn Games</h1>
          <p className="oag-hero-subtitle">
            Crafting memorable experiences.
          </p>

          <div className="oag-about">
            <h2 className="oag-section-title">About Us</h2>
            <p className="oag-about-text">
              Orange Acorn Games is a small indie studio with a passion for
              creating games that are equal parts charming and engaging. We
              believe the best games are the ones that make you smile, think,
              and come back for just one more round.
            </p>
          </div>

          <ContactButton />
        </div>

        <div className="oag-divider">
          <span className="oag-divider-text">Check out our projects</span>
          <div className="oag-divider-arrow">&#8595;</div>
        </div>
      </section>

      {projects.map((project, i) => (
        <ProjectSection key={i} project={project} />
      ))}

      <footer className="oag-footer">
        <p>
          &copy; {new Date().getFullYear()} Orange Acorn Games. All rights
          reserved.
        </p>
      </footer>
      </div>
    </div>
  );
}

export default OrangeAcornGames;
