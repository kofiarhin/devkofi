import useProjects from "../../hooks/useProjects";
import { selectProducts } from "../../lib/projectSelectors";
import { workStation } from "../../constants/constants";
import { FinalCta, PageMeta, ProjectCollection, StudioPageHero } from "../../components/Studio/Studio";

const Products = () => {
  const { data, isLoading, isError, refetch } = useProjects();
  const projects = Array.isArray(data) ? data : data?.data || [];
  const products = selectProducts(projects);

  return (
    <main>
      <PageMeta title="Products" description="Applications and products built using DevKofi engineering systems and workflows." />
      <StudioPageHero eyebrow="Products" title="Software built using the engineering system." body="A broader view of applications I have built and shipped. Some are AI-native; others prove the full-stack delivery workflows behind the studio." image={workStation} alt="DevKofi product engineering workspace" />
      <section className="studio-projects-section">
        <div className="studio-container">
          {isLoading && <p className="studio-empty">Loading products...</p>}
          {isError && <div className="studio-empty"><p>Products could not be loaded.</p><button type="button" className="studio-button studio-button--secondary" onClick={() => refetch()}>Try again</button></div>}
          {!isLoading && !isError && <ProjectCollection projects={products} emptyMessage="No products are classified for this view yet." />}
        </div>
      </section>
      <FinalCta title="Want to turn an idea into a real product?" />
    </main>
  );
};

export default Products;
