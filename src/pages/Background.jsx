import RevealOnView from "../components/RevealOnView.jsx";
import "../styles/About.css";

function Background() {
  return (
    <section id="about" className="about" data-snap-target>
      <div className="container">
        <RevealOnView className="project-header-wrapper">
          <div className="project-header-card">
            <h2>Background</h2>
          </div>
        </RevealOnView>

        <RevealOnView className="about-card" delay={0.05}>
          <p className="description">
            I am a software engineer focused on AI-assisted tools, full-stack
            applications, data workflows, and automation that streamlines
            repetitive work. My strongest projects involve AI-centric solutions,
            where the user experience is heavily influenced by underlying
            foundations that aren't AI to make the user experience seamless and
            reliable.
            <br></br>
            <br></br>
            Before software, I worked in live production as a touring guitarist,
            stage manager, and stage automation engineer. That meant programming
            show-control systems, synchronizing lights with live instruments and
            vocals, troubleshooting under venue constraints, and owning
            execution in front of large nightly audiences. The work demanded the
            same habits good software does such as domain understanding,
            repeatable systems, fast debugging, and calm ownership when timing
            matters.
            <br></br>
            <br></br>
            Today I bring that operating background into engineering work for AI
            systems, internal tooling, client applications, and product
            workflows. I care about shipping software that is understandable,
            maintainable, and useful enough to change how people actually work.
          </p>
        </RevealOnView>
      </div>
    </section>
  );
}

export default Background;
