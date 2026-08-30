import { Link } from "react-router-dom";
import useProjects from "../../hooks/useProjects";
import { services } from "../../constants/services";
import { studioContent } from "../../constants/siteContent";
import { selectFeaturedWork } from "../../lib/projectSelectors";
import { FinalCta, PageMeta, ProjectCollection, SectionHeading, SplitSection } from "../../components/Studio/Studio";

const Home = () => {
  const { data, isLoading, isError } = useProjects();
  const projects = Array.isArray(data) ? data : data?.data || [];
  const featuredWork = selectFeaturedWork(projects);

  return (
    <main>
      <PageMeta title="AI Engineering Studio" description="DevKofi engineers production AI systems, agentic workflows and AI-native products around real software, data and business processes." />

      <section className="studio-page-hero">
        <div className="studio-container studio-page-hero__grid">
          <div className="studio-page-hero__media"><img src={studioContent.hero.image} alt="Kofi, founder and AI systems engineer at DevKofi" /></div>
          <div className="studio-page-hero__copy">
            <p className="studio-eyebrow">{studioContent.hero.eyebrow}</p>
            <h1>{studioContent.hero.title}</h1>
            <p>{studioContent.hero.body}</p>
            <div className="studio-actions">
              <Link className="studio-button studio-button--primary" to="/contact">Contact</Link>
              <Link className="studio-button studio-button--secondary" to="/work">Explore My Work</Link>
            </div>
          </div>
        </div>
      </section>

      <SplitSection
        eyebrow={services[0].eyebrow}
        title={services[0].title}
        body={`${services[0].description} ${services[0].problem}`}
        image={studioContent.systems.image}
        alt="Code and engineering system used to build AI software"
        mediaLeft
      >
        <div className="studio-actions"><Link className="studio-link" to="/services">Explore AI Systems Engineering</Link></div>
      </SplitSection>

      <section className="studio-projects-section">
        <div className="studio-container">
          <SectionHeading eyebrow="Selected work" title="Things I have engineered." body="Three selected products spanning agent engineering, full-stack architecture, and practical planning tools." />
          {isLoading ? <p className="studio-empty">Loading selected work...</p> : isError ? <p className="studio-empty">Selected work is temporarily unavailable.</p> : <ProjectCollection projects={featuredWork} emptyMessage="Selected engineering work is temporarily unavailable." />}
          <div className="studio-actions"><Link className="studio-link" to="/work">View all engineering work</Link></div>
        </div>
      </section>

      <section className="studio-projects-section">
        <div className="studio-container">
          <SectionHeading eyebrow="Engineering systems" title="The systems behind how I build." body="Reusable workflows, agent infrastructure, context systems, and delivery controls that make AI-assisted engineering repeatable and reviewable." />
          <div className="studio-actions"><Link className="studio-link" to="/engineering-systems">Explore Engineering Systems</Link></div>
        </div>
      </section>

      <SplitSection {...studioContent.viewpoint} alt="Kofi working on software engineering" />
      <FinalCta />
    </main>
  );
};

export default Home;
