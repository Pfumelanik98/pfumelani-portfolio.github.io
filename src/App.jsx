import { useEffect, useState } from "react";
import { API_BASE, getList, getProfile } from "./api";

const sections = [
  ["home", "Home"], ["about", "About"], ["skills", "Skills"],
  ["education", "Education"], ["projects", "Projects"], ["certificates", "Certificates"],
];

function Header({ profile }) {
  const name = profile?.full_name || "Portfolio";
  return <header className="site-header">
    <a className="brand" href="#home" aria-label="Go to home">
      <span className="brand-mark">P</span>
      <span><strong>{name}</strong><small>{profile?.professional_title || "Software Development Portfolio"}</small></span>
    </a>
    <nav aria-label="Main navigation">
      {sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
    </nav>
  </header>;
}

function SectionHeading({ eyebrow, title, text }) {
  return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

function Loading({ label = "Loading portfolio data…" }) {
  return <div className="state-card" role="status"><span className="loader" />{label}</div>;
}

function Empty({ children }) { return <div className="empty-state">{children}</div>; }

export default function App() {
  const [data, setData] = useState({ profile: null, skills: [], education: [], projects: [], certificates: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPortfolio() {
    setLoading(true);
    setError("");
    try {
      const [profile, skills, education, projects, certificates] = await Promise.all([
        getProfile(), getList("skills/"), getList("education/"),
        getList("projects/"), getList("certificates/"),
      ]);
      setData({ profile, skills, education, projects, certificates });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load portfolio data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPortfolio(); }, []);

  const { profile, skills, education, projects, certificates } = data;
  const displayName = profile?.full_name || "Portfolio owner";
  const skillGroups = skills.reduce((groups, skill) => {
    const category = skill.category || "Other";
    (groups[category] ||= []).push(skill);
    return groups;
  }, {});

  return <>
    <Header profile={profile} />
    <main>
      {error && <div className="api-alert" role="alert">
        <div><strong>Portfolio API unavailable</strong><p>{error}. Check that the Django server is running and that its CORS settings allow this website.</p></div>
        <button className="button button-small" onClick={loadPortfolio}>Try again</button>
      </div>}
      {loading ? <div className="page-loader"><Loading /></div> : <>
        <section id="home" className="hero section-wrap">
          <div className="hero-copy">
            <span className="eyebrow">WELCOME TO MY PORTFOLIO</span>
            <h1>{profile?.full_name || "Building useful digital experiences."}</h1>
            <h2>{profile?.professional_title || "Software Development & Information Technology"}</h2>
            <p>{profile?.biography || "Explore my skills, education and selected projects below."}</p>
            <div className="hero-actions">
              <a className="button" href="#projects">Explore projects <span aria-hidden="true">↗</span></a>
              {profile?.email && <a className="button button-quiet" href={`mailto:${profile.email}`}>Contact me</a>}
            </div>
            <div className="hero-meta">
              {profile?.location && <span>⌖ {profile.location}</span>}
              {profile?.email && <a href={`mailto:${profile.email}`}>{profile.email}</a>}
            </div>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-monogram">{(profile?.full_name || "P").trim().charAt(0).toUpperCase()}</div><span className="art-caption">LEARN · BUILD · GROW</span></div>
        </section>

        <section id="about" className="section-wrap section-block">
          <SectionHeading eyebrow="A LITTLE ABOUT ME" title="Curious by nature. Developer by practice." />
          <div className="about-panel">
            <p>{profile?.biography || "Profile information will appear here once it has been added in the portfolio admin."}</p>
            <div className="social-links">
              {profile?.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer">GitHub ↗</a>}
              {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer">LinkedIn ↗</a>}
            </div>
          </div>
        </section>

        <section id="skills" className="section-wrap section-block tinted">
          <SectionHeading eyebrow="WHAT I WORK WITH" title="Skills & technologies" text="Skills are loaded directly from the portfolio API." />
          {skills.length ? <div className="skill-groups">{Object.entries(skillGroups).map(([category, items]) =>
            <article className="content-card" key={category}><h3>{category}</h3><div className="tag-list">{items.map(skill =>
              <span className="tag" key={skill.id ?? skill.name}>{skill.name}{skill.proficiency ? <small>{skill.proficiency}</small> : null}</span>
            )}</div></article>
          )}</div> : <Empty>No published skills have been added yet.</Empty>}
        </section>

        <section id="education" className="section-wrap section-block">
          <SectionHeading eyebrow="MY LEARNING JOURNEY" title="Education" />
          {education.length ? <div className="timeline">{education.map(item =>
            <article className="timeline-item" key={item.id}><span className="timeline-dot" /><div className="content-card">
              <div className="card-kicker">{[item.start_year, item.end_year || item.status].filter(Boolean).join(" — ")}</div>
              <h3>{item.qualification}</h3><p className="institution">{item.institution}</p>
              {item.field_of_study && <p>{item.field_of_study}</p>}{item.description && <p>{item.description}</p>}
            </div></article>
          )}</div> : <Empty>No education records have been published yet.</Empty>}
        </section>

        <section id="projects" className="section-wrap section-block tinted">
          <SectionHeading eyebrow="SELECTED WORK" title="Projects" text="A selection of projects and practical work." />
          {projects.length ? <div className="project-grid">{projects.map(project =>
            <article className="project-card" key={project.id}>
              <div className="project-number">{String(project.display_order ?? 0).padStart(2, "0")}</div>
              <div className="card-kicker">{project.status || "PROJECT"}</div>
              <h3>{project.title}</h3>
              <p>{project.short_description || project.description || project.solution || "Project details will be added soon."}</p>
              {project.technologies?.length > 0 && <div className="tag-list">{project.technologies.map(tech => <span className="tag" key={tech.id}>{tech.name}</span>)}</div>}
              <div className="project-links">
                {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer">Source code ↗</a>}
                {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer">Live project ↗</a>}
              </div>
            </article>
          )}</div> : <Empty>No published projects yet. Add projects through the Django admin to display them here.</Empty>}
        </section>

        <section id="certificates" className="section-wrap section-block">
          <SectionHeading eyebrow="CONTINUOUS LEARNING" title="Certificates" />
          {certificates.length ? <div className="certificate-grid">{certificates.map(cert =>
            <article className="content-card certificate-card" key={cert.id}><span className="certificate-icon">✳</span><div><h3>{cert.title}</h3><p>{cert.issuer}</p>{cert.issue_date && <small>{cert.issue_date}</small>}{cert.credential_url && <a href={cert.credential_url} target="_blank" rel="noreferrer">View credential ↗</a>}</div></article>
          )}</div> : <Empty>Certificates will appear here after their details have been confirmed and published.</Empty>}
        </section>
      </>}
    </main>
    <footer className="site-footer"><div><strong>{displayName}</strong><span>Built with care · React + Django REST API</span></div><a href="#home">Back to top ↑</a></footer>
    <div className="api-note">Data source: {API_BASE}</div>
  </>;
}
