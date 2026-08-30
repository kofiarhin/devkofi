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
        <p className="studio-kicker"><span /> Founder-led creative technology studio</p>
        <h1>We design and build <em>useful</em> digital products.</h1>
        <p className="studio-hero__lead">DevKofi helps founders and teams turn product ideas into production-ready web applications, full-stack MVPs, AI-enabled tools, and distinctive digital experiences—from product strategy and UX/UI design through engineering, testing, and launch.</p>
        <div className="studio-actions">
          <Link className="studio-button studio-button--solid" to="/start-a-project">Start a project <ArrowUpRight /></Link>
          <Link className="studio-button studio-button--text" to="/work">Explore selected work <ArrowDown /></Link>
        </div>
      </div>
      <figure className="studio-hero__visual">
        <img src={workStation} alt="Kofi Arhin's software development workspace at DevKofi" />
        <figcaption><span>DevKofi / London</span><span>Strategy · Design · Engineering</span></figcaption>
      </figure>
      <p className="studio-hero__note">Small by design.<br />Close to the work.</p>
    </section>
    <section className="studio-manifesto" aria-labelledby="manifesto-title">
      <p className="studio-index">01 / What is DevKofi?</p>
      <div><h2 id="manifesto-title">What does DevKofi help teams build?</h2><p>DevKofi is a founder-led creative technology studio by Kofi Arhin. We help founders and small teams turn unclear product ideas into useful digital products through product strategy, UX/UI design, full-stack web development, and practical AI engineering. Typical work includes web applications, MVPs, internal tools, dashboards, automation, and AI-enabled product experiences. Kofi stays close to discovery, interface decisions, implementation, testing, and launch, so product intent does not get lost between disciplines. The core engineering stack includes JavaScript and TypeScript, React, Node.js, Express, and MongoDB, with AI capabilities added when they materially improve the product.</p></div>
    </section>
    <section className="studio-work" aria-labelledby="work-title">
      <header className="studio-section-heading"><div><p className="studio-index">02 / Selected work</p><h2 id="work-title">Digital products built with intent.</h2></div><Link to="/work">View product work <ArrowUpRight /></Link></header>
      <div className="studio-work__list">{selectedWork.map((project, position) => <article className={position === 0 ? "is-featured" : ""} key={project.name}><span>{project.index}</span><div><p>{project.label}</p><h3>{project.name}</h3><p>{project.detail}</p></div><ArrowUpRight aria-hidden="true" /></article>)}</div>
    </section>
    <section className="studio-services-preview">
      <div><p className="studio-index">03 / Product services</p><h2>One studio.<br />The whole product.</h2></div>
      <ol><li><span>01</span><strong>Product strategy &amp; discovery</strong><p>Turn an unclear opportunity into a focused MVP scope, product brief, and delivery path.</p></li><li><span>02</span><strong>UX/UI &amp; product design</strong><p>Design clear user journeys, interfaces, and systems people can understand and remember.</p></li><li><span>03</span><strong>Full-stack &amp; AI engineering</strong><p>Build and test production-ready web products, automation, and AI-enabled capabilities with modern engineering workflows.</p></li></ol>
    </section>
    <section className="studio-founder"><figure><img src={profileImage} alt="Kofi Arhin, founder of DevKofi and full-stack AI engineer" /></figure><div><p className="studio-index">04 / Founder-led</p><h2>Strategy, design, and engineering stay connected.</h2><p>DevKofi is led by Kofi Arhin, a MERN-stack and AI engineer working across product strategy, UX/UI, full-stack software development, developer tooling, testing, and AI-assisted product delivery.</p><Link to="/about">About Kofi and DevKofi <ArrowUpRight /></Link></div></section>
    <section className="studio-closing"><CircleNotch size={44} weight="thin" aria-hidden="true" /><p>Planning a web app, AI-enabled product, full-stack MVP, or focused redesign?</p><h2>Let’s make it useful.</h2><Link to="/start-a-project">Tell us about the project <ArrowUpRight /></Link></section>
  </main>
);
export default Home;
