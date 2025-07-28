import "./about.styles.scss";
// About.jsx
export default function About() {
  return (
    <section className="about-section" id="about">
      <h1 className="heading">Learn Test Driven Development</h1>
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
