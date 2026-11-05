
import React from "react";
import { ShieldCheck, Truck, Headphones, Award } from "lucide-react";

const values = [
  {
    icon: <ShieldCheck size={26} />,
    title: "Quality you can trust",
    description: "We focus on reliable technology and products that deliver real value.",
  },
  {
    icon: <Truck size={26} />,
    title: "Convenient shopping",
    description: "Discover and shop for your favourite technology in one place.",
  },
  {
    icon: <Headphones size={26} />,
    title: "Customer first",
    description: "We believe a great shopping experience goes beyond the purchase.",
  },
  {
    icon: <Award size={26} />,
    title: "Value for money",
    description: "Find technology that balances performance, quality and price.",
  },
];

export default function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <span className="eyebrow">GET TO KNOW US</span>
        <h1>
          Technology for
          <br />
          <em>everyday life.</em>
        </h1>
        <p>
          Vendra makes discovering and shopping for technology simple.
          From everyday essentials to powerful devices, we bring
          everything together in one place.
        </p>
      </section>

      <section className="about-story">
        <div>
          <span className="eyebrow">OUR STORY</span>
          <h2>More than just a tech store.</h2>
        </div>

        <p>
          Vendra was created with a simple idea: shopping for technology
          should be easy, convenient and enjoyable. We bring together
          products across phones, laptops, monitors and accessories so
          customers can find the technology that fits their needs.
        </p>
      </section>

      <section className="about-values">
        <div className="section-heading">
          <div>
            <span className="eyebrow">WHAT WE STAND FOR</span>
            <h2>Why choose Vendra<span className="brand-dot">.</span></h2>
          </div>
        </div>

        <div className="values-grid">
          {values.map((value) => (
            <article className="value-card" key={value.title}>
              <div className="value-icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-cta">
        <h2>Ready to upgrade your everyday?</h2>
        <p>Explore our collection and find your next favourite device.</p>
        <a href="/#shop" className="button">
          Explore products ↗
        </a>
      </section>
    </main>
  );
}
