import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  workStation,
  codeImage,
  personCoding,
  AiImage,
  defaultImage,
} from "../../constants/constants";
import "./ai-workflow-section.styles.scss";

const HEADING_WORDS = "The AI Engineering Workflow I Teach".split(" ");

const wordVariants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 20,
      delay: i * 0.07,
    },
  }),
};

const tagsContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.75, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 220, damping: 18 },
  },
};

const BLOCKS = [
  {
    id: "01",
    title: "Build inside a real production workflow",
    description:
      "Use Claude Code, Codex, and agent workflows to plan, implement, review, and ship real application features.",
    tags: ["Claude Code", "Codex", "Agent Workflows", "Real Builds"],
    cta: "Start the workflow",
    image: workStation,
    alt: "Developer working at a workstation with AI tools open",
  },
  {
    id: "02",
    title: "Turn ideas into specs and architecture",
    description:
      "Break product ideas into clear requirements, system flows, and implementation plans before the first line of code.",
    tags: ["System Design", "Specs", "Architecture", "Scalable Systems"],
    cta: "Plan my system",
    image: codeImage,
    alt: "Code editor showing system design specs",
  },
  {
    id: "03",
    title: "Code with agents without losing control",
    description:
      "Design, generate, debug, and iterate in VS Code with AI assistance while keeping decisions traceable and reviewable.",
    tags: ["Claude Code", "Codex CLI", "VS Code", "AI Workflows", "Developer Automation"],
    cta: "Build with AI agents",
    image: personCoding,
    alt: "Person coding with AI assistant in VS Code",
  },
  {
    id: "04",
    title: "Verify outputs before they reach production",
    description:
      "Validate AI-generated code with tests, review checklists, debugging discipline, and prompts that make assumptions visible.",
    tags: ["Hallucinations", "Verification", "Prompting", "Reliability"],
    cta: "Make code reliable",
    image: AiImage,
    alt: "AI output verification and hallucination control",
  },
  {
    id: "05",
    title: "Ship full-stack apps with tests and deployment",
    description:
      "Move from local build to deployed MERN application with automation, regression checks, and production-ready handoff habits.",
    tags: ["Testing", "Automation", "Deployment", "Full-Stack Systems"],
    cta: "Ship my full-stack app",
    image: defaultImage,
    alt: "Full-stack application deployment pipeline",
  },
];

const ParallaxImage = ({ src, alt }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-28, 28]);

  return (
    <div ref={ref} className="ai-workflow-block__image-wrap">
      <motion.img
        src={src}
        alt={alt}
        className="ai-workflow-block__image"
        loading="lazy"
        style={{ y }}
      />
    </div>
  );
};

const WorkflowBlock = ({ block, index }) => {
  const isReversed = index % 2 !== 0;

  return (
    <motion.div
      data-number={block.id}
      className={`ai-workflow-block${isReversed ? " ai-workflow-block--reversed" : ""}`}
      initial={{ opacity: 0, x: isReversed ? 64 : -64 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ type: "spring", stiffness: 75, damping: 22 }}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 28 } }}
    >
      <div className="ai-workflow-block__content">
        <span className="ai-workflow-block__number">
          {block.id}
        </span>

        <h3 className="ai-workflow-block__title">
          {block.title}
        </h3>

        <p className="ai-workflow-block__description">
          {block.description}
        </p>

        <motion.ul
          className="ai-workflow-block__tags"
          aria-label="Topics covered"
          variants={tagsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {block.tags.map((tag) => (
            <motion.li
              key={tag}
              className="ai-workflow-block__tag"
              variants={tagVariants}
            >
              {tag}
            </motion.li>
          ))}
        </motion.ul>

        <Link to="/contact" className="ai-workflow-block__cta">
          {block.cta}
        </Link>
      </div>

      {block.image && <ParallaxImage src={block.image} alt={block.alt} />}
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
        <motion.div
          className="ai-workflow-section__eyebrow-wrap"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            className="ai-workflow-section__eyebrow-line"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          />
          <span className="ai-workflow-section__eyebrow">
            AI engineering mentorship
          </span>
        </motion.div>

        <h2 id="ai-workflow-title" className="ai-workflow-section__heading">
          {HEADING_WORDS.map((word, i) => (
            <motion.span
              key={i}
              className="ai-workflow-section__heading-word"
              custom={i}
              variants={wordVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        <motion.p
          className="ai-workflow-section__subheading"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, duration: 0.6, ease: "easeOut" }}
        >
          The page starts with the promise. This is the operating system:
          scope the work, guide the agents, verify the output, and deploy with
          confidence.
        </motion.p>
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
