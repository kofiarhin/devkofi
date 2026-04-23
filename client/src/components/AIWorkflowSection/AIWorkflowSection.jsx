import { motion } from "framer-motion";
import {
  workStation,
  codeImage,
  personCoding,
  AiImage,
  defaultImage,
} from "../../constants/constants";
import "./ai-workflow-section.styles.scss";

const blockVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.6 },
  },
};

const BLOCKS = [
  {
    id: "01",
    title: "AI Coding Mentorship with Agentic Workflows",
    description:
      "Build alongside me using Claude Code, Codex, and real AI-driven systems.",
    tags: ["Claude Code", "Codex", "Agentic Workflows", "Real Builds"],
    image: workStation,
    alt: "Developer working at a workstation with AI tools open",
  },
  {
    id: "02",
    title: "AI-Powered System Design & Spec-Driven Development",
    description: "Break ideas into specs, flows, and scalable architecture.",
    tags: ["System Design", "Specs", "Architecture"],
    image: codeImage,
    alt: "Code editor showing system design specs",
  },
  {
    id: "03",
    title: "Agentic Coding with Claude Code, Codex & VS Code",
    description: "Generate and iterate using real AI coding workflows.",
    tags: ["Claude Code", "Codex CLI", "VS Code"],
    image: personCoding,
    alt: "Person coding with AI assistant in VS Code",
  },
  {
    id: "04",
    title: "Fix AI Hallucinations, Avoid AI Slop",
    description: "Guide and verify AI outputs for production reliability.",
    tags: ["Hallucinations", "Verification", "Prompting"],
    image: AiImage,
    alt: "AI output verification and hallucination control",
  },
  {
    id: "05",
    title: "Ship Full-Stack Apps Fast with AI Automation & Testing",
    description: "Deploy, test, and refine real systems.",
    tags: ["Testing", "Automation", "Deployment"],
    image: defaultImage,
    alt: "Full-stack application deployment pipeline",
  },
];

const WorkflowBlock = ({ block, index }) => {
  const isReversed = index % 2 !== 0;
  return (
    <motion.div
      className={`ai-workflow-block${isReversed ? " ai-workflow-block--reversed" : ""}`}
      variants={blockVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <div className="ai-workflow-block__content">
        <span className="ai-workflow-block__number">{block.id}</span>
        <h3 className="ai-workflow-block__title">{block.title}</h3>
        <p className="ai-workflow-block__description">{block.description}</p>
        <ul className="ai-workflow-block__tags" aria-label="Topics covered">
          {block.tags.map((tag) => (
            <li key={tag} className="ai-workflow-block__tag">
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {block.image && (
        <div className="ai-workflow-block__image-wrap">
          <img
            src={block.image}
            alt={block.alt}
            className="ai-workflow-block__image"
            loading="lazy"
          />
        </div>
      )}
    </motion.div>
  );
};

const AIWorkflowSection = () => {
  return (
    <section
      aria-labelledby="ai-workflow-title"
      className="ai-workflow-section"
    >
      <div className="ai-workflow-section__intro">
        <span className="ai-workflow-section__eyebrow">
          AI ENGINEERING MENTORSHIP
        </span>
        <h2
          id="ai-workflow-title"
          className="ai-workflow-section__heading"
        >
          How We Build with Agentic AI Workflows
        </h2>
        <p className="ai-workflow-section__subheading">
          A guided mentorship system using Claude Code, Codex, agents, specs,
          reviews, testing, and deployment.
        </p>
      </div>

      <div className="ai-workflow-section__blocks">
        {BLOCKS.map((block, index) => (
          <WorkflowBlock key={block.id} block={block} index={index} />
        ))}
      </div>
    </section>
  );
};

export default AIWorkflowSection;
