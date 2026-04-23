import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  workStation,
  codeImage,
  personCoding,
  AiImage,
  defaultImage,
} from "../../constants/constants";
import "./ai-workflow-section.styles.scss";

const HEADING_WORDS = "The Agentic AI Workflow I Teach".split(" ");

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
    title: "Build Inside a Real AI Engineering Workflow",
    description:
      "Work directly with me using Claude Code, Codex, and agentic systems to build real production apps.",
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
        <motion.span
          className="ai-workflow-block__number"
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
        >
          {block.id}
        </motion.span>

        <motion.h3
          className="ai-workflow-block__title"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.15 }}
        >
          {block.title}
        </motion.h3>

        <motion.p
          className="ai-workflow-block__description"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
        >
          {block.description}
        </motion.p>

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
            AI ENGINEERING MENTORSHIP
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
          A real-world mentorship system for building apps using Claude Code,
          Codex, agents, specs, reviews, testing, and deployment.
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
