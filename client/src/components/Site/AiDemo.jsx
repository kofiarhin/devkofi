import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { CheckCircle, CircleNotch, Pause, Play, ShieldCheck } from "@phosphor-icons/react";

// Purely client-side, illustrative simulation of an AI integration. No API calls, no real data.
const demoScenarios = [
  {
    id: "support",
    label: "Support inbox",
    source: "Customer email",
    request: "Hi, my order hasn't arrived yet. Can you check where it is?",
    steps: [
      "Classify the request: order status",
      "Look up the order in your existing database (read-only tool)",
      "Draft a reply with the latest delivery details",
      "Hold the draft for human approval",
    ],
    result: "Draft reply ready. Waiting for your team to approve and send.",
  },
  {
    id: "docs",
    label: "Ask your docs",
    source: "Team question",
    request: "What is our process for handling a damaged item?",
    steps: [
      "Search your internal documents",
      "Rank the most relevant passages",
      "Answer only from the retrieved text, with sources",
    ],
    result: "Answer delivered with source links. Nothing in your systems was changed.",
  },
  {
    id: "leads",
    label: "Lead triage",
    source: "Website form",
    request: "New enquiry from a company asking about an integration project.",
    steps: [
      "Enrich with public company information",
      "Score against your qualification rules",
      "Create a draft record in your CRM",
      "Flag for sales review",
    ],
    result: "Lead queued for review. No outreach sent automatically.",
  },
];

const TYPE_DELAY = 28;
const STEP_DELAY = 900;
const HOLD_DELAY = 3600;

const AiDemo = () => {
  const prefersReducedMotion = useReducedMotion();
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [stepsShown, setStepsShown] = useState(0);
  const [paused, setPaused] = useState(false);

  const scenario = demoScenarios[scenarioIndex];
  const isAnimated = !prefersReducedMotion;
  const isRunning = isAnimated && !paused;

  useEffect(() => {
    if (!isRunning) return undefined;
    let timer;
    if (typed < scenario.request.length) {
      timer = window.setTimeout(() => setTyped((value) => value + 1), TYPE_DELAY);
    } else if (stepsShown <= scenario.steps.length) {
      timer = window.setTimeout(() => setStepsShown((value) => value + 1), stepsShown === 0 ? 450 : STEP_DELAY);
    } else {
      timer = window.setTimeout(() => {
        setScenarioIndex((index) => (index + 1) % demoScenarios.length);
        setTyped(0);
        setStepsShown(0);
      }, HOLD_DELAY);
    }
    return () => window.clearTimeout(timer);
  }, [isRunning, scenario, typed, stepsShown]);

  const selectScenario = (index) => {
    setScenarioIndex(index);
    setTyped(0);
    setStepsShown(0);
  };

  // Reduced motion shows the finished run immediately.
  const visibleText = isAnimated ? scenario.request.slice(0, typed) : scenario.request;
  const visibleSteps = isAnimated ? Math.min(stepsShown, scenario.steps.length) : scenario.steps.length;
  const showResult = isAnimated ? stepsShown > scenario.steps.length : true;
  const isTyping = isAnimated && typed < scenario.request.length;

  return (
    <div className="ai-demo">
      <div className="ai-demo__bar">
        <div className="ai-demo__tabs" role="group" aria-label="Choose an example">
          {demoScenarios.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`ai-demo__tab ${index === scenarioIndex ? "is-active" : ""}`.trim()}
              aria-pressed={index === scenarioIndex}
              onClick={() => selectScenario(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {isAnimated && (
          <button
            type="button"
            className="ai-demo__pause"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? "Play demo animation" : "Pause demo animation"}
          >
            {paused ? <Play size={16} weight="fill" aria-hidden="true" /> : <Pause size={16} weight="fill" aria-hidden="true" />}
          </button>
        )}
      </div>

      <p className="site-visually-hidden">
        {`Example: ${scenario.source}: "${scenario.request}" The AI ${scenario.steps.join(", then ").toLowerCase()}. Result: ${scenario.result}`}
      </p>

      <div className="ai-demo__window" aria-hidden="true">
        <div className="ai-demo__request">
          <span className="ai-demo__source">{scenario.source}</span>
          <p>
            {visibleText}
            {isTyping && <span className="ai-demo__caret" />}
          </p>
        </div>

        <ol className="ai-demo__steps">
          {scenario.steps.map((step, index) => {
            const state = index < visibleSteps ? "done" : index === visibleSteps && !isTyping && isRunning ? "active" : "pending";
            return (
              <li key={step} className={`ai-demo__step is-${state}`}>
                {state === "done" ? (
                  <CheckCircle size={18} weight="fill" />
                ) : (
                  <CircleNotch size={18} weight="bold" className={state === "active" ? "ai-demo__spin" : ""} />
                )}
                <span>{step}</span>
              </li>
            );
          })}
        </ol>

        <div className={`ai-demo__result ${showResult ? "is-visible" : ""}`.trim()}>
          <ShieldCheck size={20} weight="duotone" />
          <span>{scenario.result}</span>
        </div>
      </div>

      <p className="ai-demo__note">Illustrative simulation running in your browser. No real data and no AI calls.</p>
    </div>
  );
};

export default AiDemo;
