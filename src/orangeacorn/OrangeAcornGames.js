import React from 'react';
import './OrangeAcornGames.css';

const projects = [
  {
    title: 'Holding Pattern',
    description:
      'Holding Pattern is a minimal incremental game about protecting your galaxy from invaders.',
    image: 'images/holding_pattern.png',
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

function ProjectCard({ project }) {
  return (
    <div className="oag-project-card">
      <img
        src={project.image}
        alt={project.title}
        className="oag-project-image"
      />
      <div className="oag-project-info">
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
    </div>
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
      </header>

      <section className="oag-hero">
        <h1 className="oag-hero-title">Orange Acorn Games</h1>
        <p className="oag-hero-subtitle">
          Crafting cozy, memorable experiences — one game at a time.
        </p>
      </section>

      <section className="oag-about">
        <h2 className="oag-section-title">About Us</h2>
        <p className="oag-about-text">
          Orange Acorn Games is a small indie studio with a passion for creating
          games that are equal parts charming and engaging. We believe the best
          games are the ones that make you smile, think, and come back for just
          one more round.
        </p>
      </section>

      <section className="oag-projects">
        <h2 className="oag-section-title">Our Projects</h2>
        <div className="oag-projects-list">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </div>
      </section>

      <footer className="oag-footer">
        <p>
          &copy; {new Date().getFullYear()} Orange Acorn Games. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

export default OrangeAcornGames;
