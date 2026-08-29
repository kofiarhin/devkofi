import { profileImage, personCoding } from "../../constants/constants";
import { engineeringProcess } from "../../constants/siteContent";
import { FinalCta, PageMeta, SectionHeading, SplitSection, StudioPageHero } from "../../components/Studio/Studio";

const About = () => (
  <main>
    <PageMeta title="About" description="About Kofi and the engineering philosophy behind DevKofi AI Engineering Studio." />
    <StudioPageHero
      eyebrow="About DevKofi"
      title="Software engineering discipline, applied to AI systems."
      body="I’m Kofi, a full-stack engineer focused on designing and building AI systems, agentic workflows, and AI-native products that have to work in the real world."
      image={profileImage}
      alt="Kofi, founder and AI systems engineer at DevKofi"
    />

    <SplitSection
      eyebrow="The shift"
      title="From full-stack delivery to AI systems engineering."
      body="My background is building complete software systems across frontend, APIs, databases, deployment, testing, and product UX. AI engineering extends that responsibility rather than replacing it: models still need architecture, context, tools, permissions, verification, and interfaces around them."
      image={personCoding}
      alt="Kofi working on software engineering"
      mediaLeft
    />

    <section className="studio-process">
      <div className="studio-container">
        <SectionHeading eyebrow="How I work" title="The process stays engineering-led." body="I treat AI as a powerful component inside a wider software system. The work starts with the problem and ends with verification, not with a prompt." />
        <div className="studio-process__steps">{engineeringProcess.map((step, index) => <div className="studio-process__step" key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</div>)}</div>
      </div>
    </section>

    <SplitSection
      eyebrow="Engineering philosophy"
      title="AI isn’t the whole system."
      body="A dependable AI product needs the surrounding engineering to be explicit: context, data, APIs, tool boundaries, application state, human approvals, evaluation, fallbacks, observability, security, and user experience. That is the layer I focus on building well."
      image={profileImage}
      alt="Kofi, DevKofi founder"
    />

    <FinalCta title="Have a system that needs senior AI engineering?" />
  </main>
);

export default About;
