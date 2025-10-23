import { Link } from "react-router-dom";
import Hero from "../../components/Hero.jsx";
import Section from "../../components/Section.jsx";
import FeatureGrid from "../../components/FeatureGrid.jsx";
import AccessibleButton from "../../components/AccessibleButton.jsx";
import "./home.styles.scss";

const Home = () => {
  const featureItems = [
    {
      icon: "🚀",
      title: "Production launch playbooks",
      description: "Ship confidently with weekly sprints, QA reviews, and go-live templates from DevKofi mentors.",
    },
    {
      icon: "🤝",
      title: "1:1 mentorship with accountability",
      description: "Pair with founders who shipped MERN products and will review every milestone you hit.",
    },
    {
      icon: "📈",
      title: "Progress analytics dashboard",
      description: "Track lesson streaks, implementation velocity, and conversion impact from your builds.",
    },
  ];

  const badges = [
    { label: "Community", text: "2,400+ builders" },
    { label: "Avg ROI", text: "5x project velocity" },
    { label: "Delivery", text: "Launch in 90 days" },
  ];

  return (
    <div className="home" id="home">
      <Hero
        title="Mentorship that ships real products"
        subtitle="DevKofi helps you plan, build, and launch production-ready MERN apps with guidance designed for founders and content creators moving fast."
        primaryCta={{ href: "/onboarding?step=1", text: "Start onboarding", label: "Start DevKofi onboarding" }}
        secondaryCta={{ href: "/courses", text: "View courses", label: "Browse DevKofi courses" }}
        trustItems={badges.map((item) => ({ label: item.label, text: item.text }))}
      />
      <Section
        id="outcomes"
        eyebrow="Why DevKofi"
        title="Clarity, accountability, and a builder-first design system"
        description="We layer curriculum, mentorship, and analytics so you always know the next task that moves the needle."
      >
        <FeatureGrid items={featureItems} />
      </Section>
      <Section
        id="cta"
        variant="surface"
        title="Ready to launch?"
        description="Join onboarding to set your goals, map your roadmap, and unlock direct access to DevKofi mentors."
      >
        <div className="home-cta">
          <AccessibleButton as={Link} to="/onboarding?step=1" className="btn btn--primary primary-cta">
            Start onboarding
          </AccessibleButton>
          <AccessibleButton as={Link} to="/mentorship" className="btn btn--ghost secondary-cta">
            Explore mentorship
          </AccessibleButton>
        </div>
      </Section>
    </div>
  );
};

export default Home;
