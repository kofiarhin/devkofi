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
      <p className="studio-kicker"><span /> About DevKofi</p>
      <h1>A small studio with <em>wide range.</em></h1>
      <p>DevKofi exists to keep product strategy, design craft, and engineering judgment close together.</p>
    </header>
    <section className="about-studio__story">
      <figure><img src={profileImage} alt="Kofi Arhin, founder and product engineer" /></figure>
      <div><p className="studio-index">Founder / Kofi Arhin</p><h2>I build the bridge between the idea and the thing people can actually use.</h2><p>I am a full-stack product engineer with a bias toward useful systems and memorable experiences. DevKofi is the studio model I wanted to work in: direct, rigorous, curious, and close to the outcome.</p><p>Every engagement is founder-led. When specialist support is useful, the right collaborators join the work without adding layers between the problem and the people solving it.</p></div>
    </section>
    <section className="about-studio__principles">
      <header><p className="studio-index">Working principles</p><h2>How we make decisions.</h2></header>
      <div>{principles.map(([title, body], index)=><article key={title}><span>{String(index+1).padStart(2,"0")}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
    </section>
    <section className="studio-inline-cta"><h2>Different disciplines.<br />One accountable partner.</h2><Link to="/start-a-project">Work with DevKofi <ArrowUpRight /></Link></section>
  </main>
);
export default About;
