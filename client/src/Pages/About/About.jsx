import { GithubLogo, LinkedinLogo, XLogo, YoutubeLogo } from "@phosphor-icons/react";
import { profileImage, profileImageSecondary } from "../../constants/constants";
import { aboutCopy, engineeringProcess } from "../../constants/siteOffer";
import { BookCallButton, FinalCta, PageHero, Reveal, Section, SectionHeader, SiteLink } from "../../components/Site/Site";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/kofiarhin", icon: GithubLogo },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kofi-arhin", icon: LinkedinLogo },
  { label: "X", href: "https://x.com/kwofiArhin", icon: XLogo },
  { label: "YouTube", href: "https://www.youtube.com/@devkofi", icon: YoutubeLogo },
];

const AboutPortrait = () => (
  <figure className="site-portrait">
    <img src={profileImage} alt="Kofi Arhin, founder of DevKofi" width="880" height="1100" />
    <figcaption className="site-portrait__badge">
      <span aria-hidden="true" />
      Kofi Arhin
    </figcaption>
  </figure>
);

const About = () => (
  <main className="site-page">
    <PageHero
      eyebrow="About"
      title={
        <>
          Software engineering discipline, <span className="site-gradient-text">applied to AI.</span>
        </>
      }
      body={aboutCopy.intro}
      aside={<AboutPortrait />}
    >
      <div className="site-actions">
        <BookCallButton />
        <SiteLink to="/work">See the work</SiteLink>
      </div>
    </PageHero>

    <Section>
      <div className="site-split">
        <Reveal className="site-split__media">
          <img src={profileImageSecondary} alt="Kofi Arhin at work" width="880" height="1100" loading="lazy" decoding="async" />
        </Reveal>
        <div>
          <SectionHeader eyebrow="The shift" title="From full-stack delivery to AI systems engineering." />
          <Reveal>
            <p>{aboutCopy.shift}</p>
            <p>{aboutCopy.mentoring}</p>
          </Reveal>
        </div>
      </div>
    </Section>

    <Section
      tone="raised"
      eyebrow="How I work"
      title="The process stays engineering-led."
      body="I treat AI as a powerful component inside a wider software system. The work starts with the problem and ends with verification, not with a prompt."
    >
      <Reveal as="ol" className="site-process">
        {engineeringProcess.map((step, index) => (
          <li key={step}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            {step}
          </li>
        ))}
      </Reveal>
    </Section>

    <Section eyebrow="Engineering philosophy" title="AI isn't the whole system." body={aboutCopy.philosophy}>
      <Reveal as="ul" className="site-tags" aria-label="Find Kofi online">
        {socialLinks.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <a className="site-link" href={href} target="_blank" rel="noreferrer">
              <Icon size={16} weight="fill" aria-hidden="true" />
              {label}
            </a>
          </li>
        ))}
      </Reveal>
    </Section>

    <FinalCta
      title="Let's work together."
      body="Whether you want AI integrated into your business systems or 1-on-1 mentorship, it starts with a free intro call."
    />
  </main>
);

export default About;
