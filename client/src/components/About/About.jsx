import "./about.styles.scss";
// About.jsx
export default function About() {
  return (
    <section className="about-section" id="about">
      <h1 className="heading">Write, Test, Deploy...</h1>
      <p>
        A development rhythm that meets you where you are—flexible, methodical,
        and built to keep momentum. From the first line of code to the final
        push, this approach adapts to your flow: write with intent, test with
        rigor, fix with focus, and deploy with confidence. It’s not just a
        process—it’s how great work ships.
      </p>
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          marginTop: "1rem",
        }}
      >
        <iframe
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          src="https://www.youtube.com/embed/b5wDQTlpeFI?si=LWc-h1Xm7Vn6k_fg"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>
    </section>
  );
}
