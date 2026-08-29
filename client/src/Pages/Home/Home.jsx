import { Link } from "react-router-dom";
import useProjects from "../../hooks/useProjects";
import { services } from "../../constants/services";
import { engineeringProcess, engineeringSystems, studioContent } from "../../constants/siteContent";
import { selectFeaturedWork, selectProducts } from "../../lib/projectSelectors";
import { FinalCta, PageMeta, ProjectCollection, SectionHeading, SplitSection } from "../../components/Studio/Studio";

const Home = () => {
  const { data, isLoading, isError } = useProjects();
  const projects = Array.isArray(data) ? data : data?.data || [];
  const featuredWork = selectFeaturedWork(projects);
  const products = selectProducts(projects).slice(0, 4);

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
              <Link className="studio-button studio-button--primary" to="/book-a-call">Book a Call</Link>
              <Link className="studio-button studio-button--secondary" to="/work">Explore My Work</Link>
            </div>
          </div>
        </div>
      </section>

      <SplitSection {...studioContent.problem} alt="AI engineering workflow and system visual" />

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
          <SectionHeading eyebrow="Services" title="Senior AI engineering capability, shaped around the problem." body="AI Systems Engineering is the flagship. Product engineering, agentic workflows, integrations, context systems, and ongoing support extend that core capability." />
          <div className="studio-service-list">
            {services.slice(1).map((service) => <article className="studio-service-item" key={service.id}><p className="studio-eyebrow">{service.eyebrow}</p><h3>{service.title}</h3><p>{service.description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="studio-projects-section">
        <div className="studio-container">
          <SectionHeading eyebrow="Selected work" title="Systems that prove the engineering." body="A curated set of AI engineering work, focused on architecture, agent behaviour, context, verification, and production constraints." />
          {isLoading ? <p className="studio-empty">Loading selected work...</p> : isError ? <p className="studio-empty">Selected work is temporarily unavailable. Explore the Work page or repository links directly.</p> : <ProjectCollection projects={featuredWork} emptyMessage="Selected AI engineering work will appear here as project classification data is completed." />}
          <div className="studio-actions"><Link className="studio-link" to="/work">View all engineering work</Link></div>
        </div>
      </section>

      <SplitSection {...studioContent.systems} alt="AI engineering workflow visual" mediaLeft>
        <div className="studio-system-grid">
          {engineeringSystems.slice(0, 2).map((system) => <article className="studio-system-item" key={system.title}><h3>{system.title}</h3><p>{system.body}</p></article>)}
        </div>
        <div className="studio-actions"><Link className="studio-link" to="/engineering-systems">Explore Engineering Systems</Link></div>
      </SplitSection>

      <section className="studio-projects-section">
        <div className="studio-container">
          <SectionHeading eyebrow="Products" title="Built using the engineering system." body="AI and full-stack applications built through the same disciplined planning, implementation, and verification workflows." />
          {isLoading ? <p className="studio-empty">Loading products...</p> : <ProjectCollection projects={products} emptyMessage="Products will appear here when project classification data is available." />}
          <div className="studio-actions"><Link className="studio-link" to="/products">Explore Products</Link></div>
        </div>
      </section>

      <section className="studio-process">
        <div className="studio-container">
          <SectionHeading eyebrow="Process" title="From opportunity to dependable system." body="The model choice matters, but so do the decisions around architecture, integration, evaluation, and operation." />
          <div className="studio-process__steps">{engineeringProcess.map((step, index) => <div className="studio-process__step" key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</div>)}</div>
        </div>
      </section>

      <SplitSection {...studioContent.viewpoint} alt="Kofi working on software engineering" />
      <FinalCta />
    </main>
  );
};

export default Home;
