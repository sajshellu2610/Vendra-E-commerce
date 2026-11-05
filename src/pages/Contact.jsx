
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send, ArrowLeft } from "lucide-react";
import api from "../services/api";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await api.post("/messages", {
        ...form,
        createdAt: new Date().toISOString(),
      });

      setSuccess("Your message has been submitted successfully!");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError("Unable to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">

      {/* Back to Home */}
      <Link to="/" className="back-button">
        <ArrowLeft size={17} />
        Back to Home
      </Link>

      <section className="contact-heading">
        <span className="eyebrow">WE'RE HERE TO HELP</span>
        <h1>
          Let's talk<span className="brand-dot">.</span>
        </h1>
        <p>
          Have a question about a product or an order?
          Send us a message and we'll be happy to help.
        </p>
      </section>

      <section className="contact-layout">
        <div className="contact-info">
          <span className="eyebrow">CONTACT INFORMATION</span>
          <h2>Get in touch with us.</h2>

          <div className="contact-detail">
            <Mail size={20} />
            <div>
              <h3>Email</h3>
              <p>support@vendra.com</p>
            </div>
          </div>

          <div className="contact-detail">
            <Phone size={20} />
            <div>
              <h3>Phone</h3>
              <p>+91 00000 00000</p>
            </div>
          </div>

          <div className="contact-detail">
            <MapPin size={20} />
            <div>
              <h3>Location</h3>
              <p>Kerala, India</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send us a message</h2>

          <label htmlFor="contact-name">Your name</label>
          <input
            id="contact-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <label htmlFor="contact-email">Email address</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="contact-subject">Subject</label>
          <input
            id="contact-subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="What is this regarding?"
            required
          />

          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message..."
            rows="5"
            required
          />

          {success && <p className="form-success">{success}</p>}
          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            className="button contact-submit"
            disabled={loading}
          >
            <Send size={16} />
            {loading ? "Sending..." : "Send message"}
          </button>
        </form>
      </section>
    </main>
  );
}
