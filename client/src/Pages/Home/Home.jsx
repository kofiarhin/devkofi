import { ArrowDown, ArrowUpRight, CircleNotch } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { profileImage, workStation } from "../../constants/constants";
import "./home.styles.scss";

const selectedWork = [
  { index: "01", name: "Hibachi", label: "Building now", detail: "A focused product experiment moving from idea to tested release." },
  { index: "02", name: "ThriftChef", label: "Product system", detail: "A practical digital product shaped around everyday decisions." },
  { index: "03", name: "KareBraids", label: "Commerce experience", detail: "A distinct customer journey built for a specialist brand." },
];

const Home = () => (
  <main className="studio-home">
    <section className="studio-hero">
      <div className="studio-hero__copy">
        <p className="studio-kicker"><span /> Independent creative technology studio</p>
        <h1>Ideas become <em>useful</em> digital products.</h1>
        <p className="studio-hero__lead">DevKofi partners with ambitious founders and teams to shape, design, and build distinctive software—from the first hard question to the first real user.</p>
        <div className="studio-actions">
          <Link className="studio-button studio-button--solid" to="/start-a-project">Start a project <ArrowUpRight /></Link>
          <Link className="studio-button studio-button--text" to="/work">Explore selected work <ArrowDown /></Link>
        </div>
      </div>
      <figure className="studio-hero__visual">
        <img src={workStation} alt="Kofi's development workspace" />
        <figcaption><span>DevKofi / London</span><span>Design · Build · Launch</span></figcaption>
      </figure>
      <p className="studio-hero__note">Small by design.<br />Close to the work.</p>
    </section>
    <section className="studio-manifesto" aria-labelledby="manifesto-title">
      <p className="studio-index">01 / Point of view</p>
      <div><h2 id="manifesto-title">The best digital work feels inevitable only after someone has done the difficult thinking.</h2><p>We bring product strategy, interface craft, and full-stack engineering into one room. Fewer handoffs. Clearer decisions. Products with a reason to exist.</p></div>
    </section>
    <section className="studio-work" aria-labelledby="work-title">
      <header className="studio-section-heading"><div><p className="studio-index">02 / Selected work</p><h2 id="work-title">Built with intent.</h2></div><Link to="/work">View all work <ArrowUpRight /></Link></header>
      <div className="studio-work__list">{selectedWork.map((project, position) => <article className={position === 0 ? "is-featured" : ""} key={project.name}><span>{project.index}</span><div><p>{project.label}</p><h3>{project.name}</h3><p>{project.detail}</p></div><ArrowUpRight aria-hidden="true" /></article>)}</div>
    </section>
    <section className="studio-services-preview">
      <div><p className="studio-index">03 / What we do</p><h2>One studio.<br />The whole product.</h2></div>
      <ol><li><span>01</span><strong>Product direction</strong><p>Turn an unclear opportunity into a confident product brief and delivery path.</p></li><li><span>02</span><strong>Digital design</strong><p>Craft an identity, interface, and experience people can understand and remember.</p></li><li><span>03</span><strong>Engineering</strong><p>Build resilient web products with modern AI workflows and senior review.</p></li></ol>
    </section>
    <section className="studio-founder"><figure><img src={profileImage} alt="Kofi Arhin, founder of DevKofi" /></figure><div><p className="studio-index">04 / Founder-led</p><h2>Strategy, taste, and engineering stay connected.</h2><p>DevKofi is led by Kofi Arhin, a full-stack product engineer working at the intersection of product thinking, interface design, and AI-assisted delivery.</p><Link to="/about">Meet Kofi <ArrowUpRight /></Link></div></section>
    <section className="studio-closing"><CircleNotch size={44} weight="thin" aria-hidden="true" /><p>Have a sharp idea, a stuck product, or an ambitious build?</p><h2>Let’s make it real.</h2><Link to="/start-a-project">Tell us about the project <ArrowUpRight /></Link></section>
  </main>
);
export default Home;
