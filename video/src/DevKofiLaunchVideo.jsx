import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";

const durationInFrames = 780;

const theme = {
  bg: "#0b0c0e",
  bgSoft: "#121417",
  panel: "rgba(18, 20, 23, 0.78)",
  panelStrong: "rgba(22, 24, 28, 0.92)",
  line: "rgba(255,255,255,0.09)",
  lineSoft: "rgba(255,255,255,0.05)",
  accent: "#a3e635",
  accentSoft: "rgba(163,230,53,0.12)",
  text: "#f3f4ef",
  subtext: "#c1c5bc",
  muted: "#7c8277",
};

const assets = {
  heroVideo: staticFile("assets/hero-bg.mp4"),
  profile: staticFile("assets/profile.jpg"),
  workstation: staticFile("assets/workstation.png"),
  architecture: staticFile("assets/architecture.png"),
  coding: staticFile("assets/coding.png"),
  verification: staticFile("assets/verification.png"),
  shipping: staticFile("assets/shipping.jpg"),
  outfit: staticFile("fonts/Outfit-Variable.ttf"),
  mono: staticFile("fonts/JetBrainsMono-Variable.ttf"),
};

const workflow = [
  { id: "01", title: "Write the brief", detail: "Turn the product idea into a workable spec." },
  { id: "02", title: "Map the system", detail: "Break the feature into architecture and delivery steps." },
  { id: "03", title: "Guide the agents", detail: "Use Claude Code and Codex with visible assumptions." },
  { id: "04", title: "Review the output", detail: "Test, inspect, and fix before trust." },
  { id: "05", title: "Ship the release", detail: "Deploy a MERN build with production discipline." },
];

const supportTracks = [
  { title: "Builder", detail: "Async momentum and practical review cycles" },
  { title: "Sprint", detail: "Priority feedback for tighter release windows" },
  { title: "Intensive", detail: "Hands-on support for full-stack delivery" },
];

const fullStyle = {
  fontFamily: '"Outfit Custom", "Segoe UI", sans-serif',
  backgroundColor: theme.bg,
  color: theme.text,
};

const monoStyle = {
  fontFamily: '"JetBrains Mono Custom", "Consolas", monospace',
};

const rise = (frame, start, distance = 28, duration = 20) => {
  const progress = spring({
    frame: frame - start,
    fps: 30,
    config: { stiffness: 110, damping: 18, mass: 0.9 },
    durationInFrames: duration,
  });

  return {
    opacity: progress,
    transform: `translate3d(0, ${interpolate(progress, [0, 1], [distance, 0])}px, 0)`,
  };
};

const drift = (frame, speed, range) => {
  return Math.sin(frame / speed) * range;
};

const FontFaces = () => {
  return (
    <style>{`
      @font-face {
        font-family: "Outfit Custom";
        src: url("${assets.outfit}") format("truetype");
        font-weight: 100 900;
      }
      @font-face {
        font-family: "JetBrains Mono Custom";
        src: url("${assets.mono}") format("truetype");
        font-weight: 100 900;
      }
    `}</style>
  );
};

const Eyebrow = ({ children, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 18px",
      borderRadius: 999,
      border: `1px solid rgba(163,230,53,0.22)`,
      background: "rgba(163,230,53,0.08)",
      color: theme.accent,
      fontSize: 22,
      fontWeight: 650,
      letterSpacing: "0.02em",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
      ...style,
    }}
  >
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: 999,
        background: theme.accent,
      }}
    />
    {children}
  </div>
);

const GlassPanel = ({ children, style }) => (
  <div
    style={{
      borderRadius: 40,
      border: `1px solid ${theme.line}`,
      background: theme.panel,
      boxShadow:
        "0 24px 80px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)",
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

const Background = () => {
  const frame = useCurrentFrame();
  const mediaY = interpolate(frame, [0, durationInFrames], [0, -90]);
  const orbX = drift(frame, 60, 48);
  const orbY = drift(frame, 75, 30);

  return (
    <AbsoluteFill style={fullStyle}>
      <Img
        src={assets.workstation}
        style={{
          position: "absolute",
          inset: -60,
          width: 1200,
          height: 1980,
          objectFit: "cover",
          opacity: 0.12,
          transform: `translate3d(0, ${mediaY}px, 0) scale(1.08)`,
        }}
      />
      <Img
        src={assets.verification}
        style={{
          position: "absolute",
          right: -180,
          bottom: -120,
          width: 760,
          height: 760,
          objectFit: "cover",
          opacity: 0.08,
          borderRadius: 80,
          transform: `translate3d(${orbX}px, ${-orbY}px, 0) rotate(-6deg)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(11,12,14,0.3) 0%, rgba(11,12,14,0.82) 22%, rgba(11,12,14,0.98) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -180 + orbY,
          right: -160 + orbX,
          width: 540,
          height: 540,
          borderRadius: 999,
          background:
            "radial-gradient(circle, rgba(163,230,53,0.18) 0%, rgba(163,230,53,0.05) 38%, rgba(163,230,53,0) 72%)",
          filter: "blur(26px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -220 - orbY,
          left: -180 - orbX,
          width: 460,
          height: 460,
          borderRadius: 999,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 42%, rgba(255,255,255,0) 76%)",
          filter: "blur(34px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.75) 0.7px, transparent 0.7px)",
          backgroundSize: "18px 18px",
        }}
      />
    </AbsoluteFill>
  );
};

const HeroScene = () => {
  const frame = useCurrentFrame();
  const portraitFloat = drift(frame, 24, 12);
  const badgeFloat = drift(frame, 18, 10);

  return (
    <AbsoluteFill style={{ padding: "132px 74px 84px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: 28,
          height: "100%",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingTop: 8,
          }}
        >
          <div>
            <Eyebrow style={rise(frame, 0, 18, 18)}>DevKofi launch film</Eyebrow>
            <div
              style={{
                marginTop: 42,
                ...rise(frame, 8, 28, 20),
                fontSize: 92,
                fontWeight: 720,
                lineHeight: 0.96,
                letterSpacing: "-0.05em",
                maxWidth: 520,
              }}
            >
              Production-minded AI engineering for developers.
            </div>
            <div
              style={{
                marginTop: 28,
                ...rise(frame, 18, 22, 18),
                fontSize: 32,
                lineHeight: 1.42,
                color: theme.subtext,
                maxWidth: 520,
              }}
            >
              Learn how to brief, build, review, test, and deploy real MERN
              software with sharper workflow discipline.
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "0.8fr 1fr",
              gap: 18,
              alignItems: "end",
              ...rise(frame, 28, 18, 18),
            }}
          >
            <div
              style={{
                paddingTop: 18,
                borderTop: `1px solid ${theme.line}`,
              }}
            >
              <div style={{ ...monoStyle, fontSize: 18, color: theme.muted }}>
                2026 launch positioning
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 24,
                  color: theme.subtext,
                  lineHeight: 1.35,
                }}
              >
                Built for developers who want shipped work, not prompt theatre.
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              {[
                ["Mentorship", "Review loops and accountability"],
                ["Workflow", "Brief to deployment in five steps"],
                ["Delivery", "Real app releases over mock projects"],
              ].map(([title, detail]) => (
                <div
                  key={title}
                  style={{
                    padding: "18px 0",
                    borderTop: `1px solid ${theme.lineSoft}`,
                  }}
                >
                  <div style={{ fontSize: 22, fontWeight: 650 }}>{title}</div>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 21,
                      color: theme.muted,
                    }}
                  >
                    {detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            ...rise(frame, 12, 24, 22),
          }}
        >
          <GlassPanel
            style={{
              width: "100%",
              height: 1380,
              background: "rgba(15,16,19,0.72)",
            }}
          >
            <div
              style={{
                position: "relative",
                height: "100%",
                padding: 18,
              }}
            >
              <Img
                src={assets.profile}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "50% 20%",
                  borderRadius: 30,
                  transform: `translate3d(0, ${portraitFloat}px, 0) scale(1.03)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 18,
                  borderRadius: 30,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 48%, rgba(0,0,0,0.54) 100%)",
                }}
              />
            </div>
          </GlassPanel>

          <GlassPanel
            style={{
              position: "absolute",
              left: -26,
              bottom: 76,
              width: 330,
              padding: "22px 22px 18px",
              background: "rgba(15,16,18,0.84)",
              transform: `translate3d(0, ${badgeFloat}px, 0)`,
            }}
          >
            <div style={{ ...monoStyle, fontSize: 16, color: theme.muted }}>
              active review
            </div>
            <div
              style={{
                marginTop: 14,
                display: "grid",
                gap: 10,
              }}
            >
              {[
                ["Queue", "3 builds"],
                ["Checks", "Green"],
                ["Deploy", "Heroku"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 12,
                    padding: "12px 0",
                    borderTop: `1px solid ${theme.lineSoft}`,
                    fontSize: 18,
                    color: theme.subtext,
                  }}
                >
                  <span>{label}</span>
                  <strong style={{ color: theme.text, fontWeight: 650 }}>{value}</strong>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const WorkflowScene = () => {
  const frame = useCurrentFrame();
  const activeIndex = Math.min(workflow.length - 1, Math.floor(frame / 32));
  const activeImage = [
    assets.workstation,
    assets.architecture,
    assets.coding,
    assets.verification,
    assets.shipping,
  ];

  return (
    <AbsoluteFill style={{ padding: "124px 74px 84px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.92fr 1.08fr",
          gap: 28,
          height: "100%",
          alignItems: "stretch",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <Eyebrow style={rise(frame, 0, 16, 18)}>The method</Eyebrow>
            <div
              style={{
                marginTop: 34,
                ...rise(frame, 8, 24, 18),
                fontSize: 78,
                fontWeight: 720,
                lineHeight: 0.98,
                letterSpacing: "-0.05em",
                maxWidth: 400,
              }}
            >
              Brief it.
              <br />
              Build it.
              <br />
              Verify it.
            </div>
          </div>

          <GlassPanel
            style={{
              padding: 16,
              height: 540,
              background: "rgba(16,18,20,0.84)",
              ...rise(frame, 18, 22, 18),
            }}
          >
            <div style={{ position: "relative", height: "100%" }}>
              {activeImage.map((src, index) => {
                const opacity = interpolate(
                  frame,
                  [index * 32, index * 32 + 8, index * 32 + 28],
                  [0, 1, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );

                return (
                  <Img
                    key={src}
                    src={src}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 28,
                      opacity,
                      transform: `scale(${interpolate(
                        frame,
                        [index * 32, index * 32 + 24],
                        [1.05, 1],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                      )})`,
                    }}
                  />
                );
              })}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 28,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.42) 100%)",
                }}
              />
            </div>
          </GlassPanel>
        </div>

        <div
          style={{
            display: "grid",
            alignContent: "start",
            gap: 10,
            paddingTop: 160,
          }}
        >
          {workflow.map((item, index) => {
            const localFrame = frame - index * 8;
            const revealed = spring({
              frame: localFrame,
              fps: 30,
              config: { stiffness: 100, damping: 20 },
              durationInFrames: 18,
            });

            return (
              <div
                key={item.id}
                style={{
                  opacity: interpolate(revealed, [0, 1], [0.3, 1]),
                  transform: `translate3d(${interpolate(revealed, [0, 1], [22, 0])}px, 0, 0)`,
                  display: "grid",
                  gridTemplateColumns: "80px 1fr",
                  gap: 18,
                  padding: "20px 0 24px",
                  borderTop: `1px solid ${index === 0 ? theme.line : theme.lineSoft}`,
                }}
              >
                <div style={{ ...monoStyle, color: theme.accent, fontSize: 18, paddingTop: 6 }}>
                  {item.id}
                </div>
                <div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div style={{ fontSize: 34, fontWeight: 650, lineHeight: 1.08 }}>
                      {item.title}
                    </div>
                    {activeIndex === index ? (
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 999,
                          background: theme.accent,
                        }}
                      />
                    ) : null}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 23,
                      color: theme.subtext,
                      lineHeight: 1.4,
                      maxWidth: 470,
                    }}
                  >
                    {item.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PlatformScene = () => {
  const frame = useCurrentFrame();
  const tickerX = interpolate(frame, [0, 180], [0, -360], {
    extrapolateRight: "clamp",
  });
  const orbit = drift(frame, 20, 8);

  return (
    <AbsoluteFill style={{ padding: "122px 74px 86px" }}>
      <Eyebrow style={rise(frame, 0, 16, 18)}>Inside the platform</Eyebrow>
      <div
        style={{
          marginTop: 34,
          ...rise(frame, 8, 24, 18),
          fontSize: 78,
          fontWeight: 720,
          lineHeight: 0.98,
          letterSpacing: "-0.05em",
          maxWidth: 760,
        }}
      >
        Mentorship, product review, templates, and support tracks in one place.
      </div>

      <div
        style={{
          marginTop: 44,
          display: "grid",
          gridTemplateColumns: "1.08fr 0.92fr",
          gap: 28,
          height: 1220,
        }}
      >
        <GlassPanel style={{ padding: 18, background: "rgba(18,19,22,0.82)" }}>
          <div
            style={{
              position: "relative",
              height: "100%",
              borderRadius: 30,
              overflow: "hidden",
              border: `1px solid ${theme.lineSoft}`,
              background: theme.bgSoft,
            }}
          >
            <Img
              src={assets.coding}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scale(1.02)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.42) 58%, rgba(0,0,0,0.6) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 28,
                right: 28,
                bottom: 28,
                display: "grid",
                gap: 16,
              }}
            >
              <div style={{ ...monoStyle, color: theme.muted, fontSize: 18 }}>
                mentorship dashboard / active
              </div>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 680,
                  lineHeight: 1.02,
                  maxWidth: 460,
                }}
              >
                Build inside a real production workflow.
              </div>
            </div>
            <GlassPanel
              style={{
                position: "absolute",
                top: 26 + orbit,
                right: 26,
                width: 254,
                padding: "18px 18px 14px",
                background: "rgba(16,17,19,0.78)",
                backdropFilter: "blur(18px)",
              }}
            >
              <div style={{ ...monoStyle, color: theme.muted, fontSize: 15 }}>
                release state
              </div>
              <div
                style={{
                  marginTop: 12,
                  display: "grid",
                  gap: 10,
                }}
              >
                {[
                  ["Specs", "locked"],
                  ["Checks", "passing"],
                  ["Deploy", "ready"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      fontSize: 16,
                      color: theme.subtext,
                      paddingTop: 10,
                      borderTop: `1px solid ${theme.lineSoft}`,
                    }}
                  >
                    <span>{label}</span>
                    <strong style={{ color: theme.text }}>{value}</strong>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </GlassPanel>

        <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
          <div
            style={{
              padding: "14px 0 18px",
              borderTop: `1px solid ${theme.line}`,
              ...rise(frame, 18, 18, 18),
            }}
          >
            <div style={{ ...monoStyle, color: theme.muted, fontSize: 18 }}>
              core outcomes
            </div>
            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 14,
                width: 760,
                transform: `translate3d(${tickerX}px, 0, 0)`,
              }}
            >
              {new Array(2).fill(0).flatMap((_, copyIndex) =>
                [
                  ["Templates", "Private starter downloads"],
                  ["Portal", "Student and admin views"],
                  ["Pricing", "Support matched to the build"],
                  ["Reviews", "Visible iteration before release"],
                ].map(([title, detail]) => (
                  <div
                    key={`${copyIndex}-${title}`}
                    style={{
                      minWidth: 210,
                      padding: "18px 18px 16px",
                      borderRadius: 26,
                      border: `1px solid ${theme.line}`,
                      background:
                        title === "Pricing"
                          ? "rgba(163,230,53,0.08)"
                          : "rgba(255,255,255,0.025)",
                    }}
                  >
                    <div style={{ fontSize: 22, fontWeight: 650 }}>{title}</div>
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 18,
                        color: theme.subtext,
                        lineHeight: 1.32,
                      }}
                    >
                      {detail}
                    </div>
                  </div>
                )),
              )}
            </div>
          </div>

          <div
            style={{
              paddingTop: 14,
              borderTop: `1px solid ${theme.line}`,
              ...rise(frame, 28, 18, 18),
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 650 }}>Support tracks</div>
            <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
              {supportTracks.map((track, index) => (
                <div
                  key={track.title}
                  style={{
                    padding: "18px 0 20px",
                    borderTop: `1px solid ${index === 0 ? theme.lineSoft : theme.lineSoft}`,
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontSize: 28, fontWeight: 650 }}>{track.title}</div>
                    {track.title === "Sprint" ? (
                      <div
                        style={{
                          padding: "8px 12px",
                          borderRadius: 999,
                          background: theme.accentSoft,
                          color: theme.accent,
                          fontSize: 15,
                          fontWeight: 650,
                        }}
                      >
                        most requested
                      </div>
                    ) : null}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 20,
                      color: theme.subtext,
                      lineHeight: 1.35,
                      maxWidth: 360,
                    }}
                  >
                    {track.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <GlassPanel
            style={{
              marginTop: 4,
              padding: "22px 22px 20px",
              background: "rgba(17,18,21,0.78)",
              ...rise(frame, 38, 18, 18),
            }}
          >
            <div style={{ ...monoStyle, color: theme.muted, fontSize: 16 }}>
              product promise
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 32,
                lineHeight: 1.16,
                fontWeight: 650,
              }}
            >
              Clearer specs, cleaner reviews, and stronger shipped work.
            </div>
          </GlassPanel>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const OutroScene = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 14) * 0.012;

  return (
    <AbsoluteFill style={{ padding: "146px 74px 110px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.9fr 1.1fr",
          gap: 26,
          height: "100%",
          alignItems: "end",
        }}
      >
        <div style={{ alignSelf: "start" }}>
          <Eyebrow style={rise(frame, 0, 16, 18)}>DevKofi</Eyebrow>
          <div
            style={{
              marginTop: 34,
              ...rise(frame, 8, 26, 18),
              fontSize: 84,
              fontWeight: 720,
              lineHeight: 0.96,
              letterSpacing: "-0.05em",
              maxWidth: 430,
            }}
          >
            Build with AI.
            <br />
            Ship like it matters.
          </div>
        </div>

        <GlassPanel
          style={{
            padding: "44px 40px 38px",
            background: "rgba(17,18,21,0.82)",
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            ...rise(frame, 16, 20, 18),
          }}
        >
          <div>
            <div style={{ ...monoStyle, color: theme.muted, fontSize: 18 }}>
              for developers who want more than generated drafts
            </div>
            <div
              style={{
                marginTop: 18,
                fontSize: 36,
                lineHeight: 1.28,
                color: theme.subtext,
                maxWidth: 470,
              }}
            >
              DevKofi teaches a more deliberate path from product brief to
              deployed full-stack release.
            </div>
          </div>

          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 340,
                minHeight: 94,
                padding: "0 36px",
                borderRadius: 999,
                background: theme.accent,
                color: "#11130f",
                fontSize: 34,
                fontWeight: 720,
                transform: `scale(${pulse})`,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28)",
              }}
            >
              devkofi.com
            </div>
            <div
              style={{
                marginTop: 18,
                ...monoStyle,
                fontSize: 18,
                color: theme.muted,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              React | Express | MongoDB | review loops | deployment discipline
            </div>
          </div>
        </GlassPanel>
      </div>
    </AbsoluteFill>
  );
};

export const DevKofiLaunchVideo = () => {
  return (
    <AbsoluteFill style={fullStyle}>
      <FontFaces />
      <Background />
      <Sequence from={0} durationInFrames={190}>
        <HeroScene />
      </Sequence>
      <Sequence from={170} durationInFrames={190}>
        <WorkflowScene />
      </Sequence>
      <Sequence from={350} durationInFrames={230}>
        <PlatformScene />
      </Sequence>
      <Sequence from={580} durationInFrames={200}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
