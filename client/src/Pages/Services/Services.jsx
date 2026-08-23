import { ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import "../Home/home.styles.scss";

const engagements = [
  ["01", "Shape", "Product direction", "For early ideas and tangled products. We clarify the audience, value, constraints, experience, and smallest credible release.", "Strategy sprint · Product brief · Prototype direction"],
  ["02", "Make", "Design and build", "For teams ready to move. We design the core experience and engineer a production-ready web product as one connected engagement.", "UX/UI · Design system · Full-stack delivery"],
  ["03", "Sharpen", "Product evolution", "For useful software that deserves a stronger next chapter. We diagnose friction, reshape key journeys, and ship focused improvements.", "Product audit · Redesign · Feature delivery"],
];
const Services = () => <main className="studio-inner"><header className="studio-page-hero"><p className="studio-kicker"><span /> Services</p><h1>From uncertain idea to <em>working product.</em></h1><p>DevKofi combines product thinking, digital design, and engineering in compact, senior-led engagements.</p></header><section className="studio-engagements" aria-label="Engagements">{engagements.map(([number, verb, title, body, output]) => <article key={number}><span>{number}</span><p>{verb}</p><h2>{title}</h2><p>{body}</p><small>{output}</small></article>)}</section><section className="studio-process"><p className="studio-index">How the work moves</p><h2>Clear stages. Visible decisions. No theatre.</h2><ol><li><span>01</span><strong>Discover</strong><p>Get close to the user, opportunity, and constraints.</p></li><li><span>02</span><strong>Define</strong><p>Choose what matters and write the product path.</p></li><li><span>03</span><strong>Design</strong><p>Make the experience tangible before complexity grows.</p></li><li><span>04</span><strong>Deliver</strong><p>Build, test, and prepare the product for real use.</p></li></ol></section><section className="studio-inline-cta"><h2>Bring the problem.<br />We’ll find the product.</h2><Link to="/start-a-project">Start a conversation <ArrowUpRight /></Link></section></main>;
export default Services;
