import { services } from "../../constants/services";
import { aiImage, codeSnippetImage, personCoding, workStation } from "../../constants/constants";
import { FinalCta, PageMeta, SplitSection, StudioPageHero } from "../../components/Studio/Studio";

const visuals = [codeSnippetImage, aiImage, workStation, personCoding, codeSnippetImage, workStation];

const Services = () => (
  <main>
    <PageMeta title="AI Engineering Services" description="AI systems engineering, AI product engineering, agentic workflows, integrations, context systems and ongoing AI engineering support." />
    <StudioPageHero eyebrow="Services" title="AI engineering for systems that need to work beyond the demo." body="I help founders and product teams turn AI opportunities into dependable software connected to real data, tools, workflows and users." image={aiImage} alt="AI engineering system visual" />
    {services.map((service, index) => (
      <SplitSection
        key={service.id}
        eyebrow={service.eyebrow}
        title={service.title}
        body={`${service.problem} ${service.description}`}
        image={visuals[index % visuals.length]}
        alt={`${service.title} engineering visual`}
        mediaLeft={index % 2 === 1}
      >
        <ul className="studio-service-points">{service.useCases.map((item) => <li key={item}>{item}</li>)}</ul>
      </SplitSection>
    ))}
    <FinalCta />
  </main>
);

export default Services;
