// src/components/Services/Services.jsx
import React from "react";
import "./services.styles.scss";

const serviceList = [
  {
    title: "Chat",
    description: "Unlimited Discord support for building/marketing your SaaS.",
  },
  {
    title: "1‑1 Coaching Calls",
    description: "Live calls for personalized guidance on product & growth.",
  },
];

const Services = () => (
  <div id="services">
    <h1 className="heading">What you’ll get</h1>
    <div className="services-wrapper">
      {serviceList.map(({ title, description }) => (
        <div key={title} className="service-unit">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Services;
