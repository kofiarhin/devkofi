import { ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { profileImage } from "../../constants/constants";
import "../Home/home.styles.scss";
import "./about.styles.scss";

const principles = [
  ["Clarity before velocity", "The fastest build is not useful if the team is solving the wrong problem."],
  ["Taste is a product decision", "The interface should communicate confidence, character, and care—not decoration for its own sake."],
  ["Engineering earns trust", "Strong systems make the experience reliable long after the first impression."],
  ["AI needs judgment", "Modern tools compress delivery; experienced review keeps the work coherent and accountable."],
];

const About = () => (
  <main className="studio-inner about-studio">
    <header className="studio-page-hero">
      <p className="studio-kicker"><span /> About Kofi Arhin and DevKofi</p>
      <h1>Meet Kofi Arhin, founder of <em>DevKofi.</em></h1>
      <p>DevKofi is Kofi's founder-led creative technology studio, combining product strategy, UX/UI design, full-stack software engineering, AI engineering, content, and creative practice in one accountable product partner.</p>
    </header>
    <section className="about-studio__story">
      <figure><img src={profileImage} alt="Kofi Arhin, founder of DevKofi, MERN-stack and AI engineer" /></figure>
      <div><p className="studio-index">Founder / Kofi Arhin</p><h2>Who is Kofi Arhin?</h2><p>Kofi Arhin is a MERN-stack and AI engineer who designs and builds complete digital products with JavaScript and TypeScript, React, Node.js, Express, MongoDB, APIs, AI model integrations, automation, testing, and human-in-the-loop workflows. His full-stack engineering foundation keeps AI ideas connected to usable interfaces, reliable application logic, and real product outcomes.</p><p>DevKofi is the studio model Kofi wanted to work in: direct, rigorous, curious, and close to the result. Every engagement is founder-led. When specialist support is useful, the right collaborators join without adding layers between the product problem and the people solving it.</p></div>
    </section>
    <section className="about-studio__principles">
      <header><p className="studio-index">Working principles</p><h2>How DevKofi makes product decisions.</h2></header>
      <div>{principles.map(([title, body], index)=><article key={title}><span>{String(index+1).padStart(2,"0")}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
    </section>
    <section className="studio-inline-cta"><h2>Product thinking, design,<br />full-stack and AI engineering.</h2><Link to="/start-a-project">Work with DevKofi <ArrowUpRight /></Link></section>
  </main>
);
export default About;
