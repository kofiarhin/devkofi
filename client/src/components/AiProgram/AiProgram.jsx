import "./ai-program.styles.scss";

const processSteps = [
  "Idea",
  "Prompt Structuring",
  "AI Code Generation",
  "Engineer Review",
  "TDD",
  "Debugging with AI",
  "Refactor",
  "Deploy",
];

const curriculum = [
  {
    month: "Month 1 – Web Foundations + AI Pairing",
    topics: [
      "HTML, CSS, JavaScript fundamentals",
      "Using AI to scaffold and review code",
      "Writing first tests with AI assistance",
    ],
  },
  {
    month: "Month 2 – React + AI-Augmented Frontend Engineering",
    topics: [
      "Components, state, routing",
      "AI-assisted component generation",
      "AI debugging workflows",
    ],
  },
  {
    month: "Month 3 – Node, Express, MongoDB + AI Backend Pairing",
    topics: [
      "REST API development",
      "AI-generated routes and controllers",
      "AI-assisted schema design",
      "Writing backend tests with AI",
    ],
  },
  {
    month: "Month 4 – Full MERN Application (Project 1)",
    topics: [
      "Build from scratch",
      "AI for planning, generation, and refactor",
      "TDD workflow with AI",
    ],
  },
  {
    month: "Month 5 – Advanced AI Integration",
    topics: [
      "Integrating AI APIs into MERN apps",
      "Prompt engineering mastery",
      "Model selection strategies",
      "AI-powered features: chat, search, automation",
    ],
  },
  {
    month: "Month 6 – Production and Deployment",
    topics: [
      "Code audits with AI",
      "Performance optimization",
      "Deployment to Vercel and Render",
      "CI/CD workflows",
      "Final capstone project",
    ],
  },
];

const AiProgram = () => {
  return (
    <div className="ai-program">
      <section className="problem-section">
        <h2>The Problem</h2>
        <p>
          Most developers either over-rely on AI without understanding software
          engineering fundamentals or ignore AI completely and fall behind modern
          delivery speed.
        </p>
        <p>
          DevKofi trains structured AI-assisted engineering mastery so you can
          ship faster without sacrificing code quality.
        </p>
      </section>

      <section className="process-section">
        <h2>The AI Engineering Process</h2>
        <p>Human + AI partnership model across the full software lifecycle.</p>
        <ol>
          {processSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section id="course-outline" className="curriculum-section">
        <h2>6-Month AI-Powered MERN Engineering Program</h2>
        <div className="curriculum-grid">
          {curriculum.map((item) => (
            <article key={item.month}>
              <h3>{item.month}</h3>
              <ul>
                {item.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="curriculum-outcome">
          By the end, students deploy a production-grade AI-augmented MERN
          application.
        </p>
      </section>

      <section className="projects-section">
        <h2>Real Projects. Production Expectations.</h2>
        <p>
          Build and ship real production applications using the AI partnership
          workflow. This is not theory. This is execution.
        </p>
      </section>
    </div>
  );
};

export default AiProgram;
