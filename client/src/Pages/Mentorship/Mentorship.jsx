import { Brain, Stack } from "@phosphor-icons/react";
import { profileImageSecondary } from "../../constants/constants";
import { mentorshipFaq, mentorshipFit, mentorshipSteps, mentorshipTracks } from "../../constants/siteOffer";
import {
  BookCallButton,
  CalendlyLink,
  Checklist,
  Faq,
  FinalCta,
  PageHero,
  Reveal,
  Section,
  SiteLink,
  Steps,
} from "../../components/Site/Site";

const trackIcons = { "ai-engineering": Brain, mern: Stack };

const MentorshipPortrait = () => (
  <figure className="site-portrait">
    <div className="site-portrait__backdrop" aria-hidden="true" />
    <img src={profileImageSecondary} alt="Kofi Arhin, mentor" width="880" height="1100" />
    <figcaption className="site-portrait__badge">
      <span aria-hidden="true" />
      1-on-1 with Kofi
    </figcaption>
  </figure>
);

const Mentorship = () => (
  <main className="site-page">
    <PageHero
      eyebrow="1-on-1 mentorship"
      title={
        <>
          Learn to build real software <span className="site-gradient-text">with AI and the MERN stack.</span>
        </>
      }
      body="Direct, project-based mentorship in AI engineering and the MERN stack. We work on real code with review, tests and shipping habits, so you build with AI tools while keeping your engineering judgement in control."
      aside={<MentorshipPortrait />}
    >
      <div className="site-actions">
        <BookCallButton />
        <SiteLink to="/mentorship#tracks">See what we cover</SiteLink>
        <CalendlyLink />
      </div>
    </PageHero>

    <Section eyebrow="Who it is for" title="Mentorship for builders.">
      <Reveal>
        <Checklist items={mentorshipFit} />
      </Reveal>
    </Section>

    <Section id="tracks" tone="raised" eyebrow="What sessions cover" title="Two tracks, one mentor." className="site-anchor">
      <div className="site-grid site-grid--2">
        {mentorshipTracks.map((track, index) => {
          const Icon = trackIcons[track.id];
          return (
            <Reveal as="article" className="site-card site-service site-anchor" id={track.id} key={track.id} delay={index * 0.08}>
              <span className="site-icon" aria-hidden="true">
                <Icon size={24} weight="duotone" />
              </span>
              <p className="site-eyebrow">{track.eyebrow}</p>
              <h3>{track.title}</h3>
              <p>{track.body}</p>
              <Checklist items={track.covers} />
            </Reveal>
          );
        })}
      </div>
    </Section>

    <Section eyebrow="How it works" title="From intro call to your first session.">
      <Steps steps={mentorshipSteps} />
    </Section>

    <Section tone="raised" eyebrow="FAQ" title="Mentorship questions.">
      <Faq items={mentorshipFaq} />
    </Section>

    <FinalCta
      title="Ready to level up how you build?"
      body="Book a free intro call. We'll talk about your goals and current level. Format and pricing are agreed on the call."
    />
  </main>
);

export default Mentorship;
