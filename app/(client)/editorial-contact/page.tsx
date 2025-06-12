import { DOMAIN_URL } from "@/constant/apiUrl";
import { generateMetadata } from "@/lib/generateMetadata";
import React from "react";
export const metadata = generateMetadata({
  title: "Editorial Contact",
  description:
    "Contact the editorial team at Washington Insider Magazine for news tips, submissions, and media inquiries. Trusted source for U.S. and global news insights.",
  keywords: [],
  canonical: `${DOMAIN_URL}/editorial-contact`,
});
const Contact = () => {
  return (
    <>
      <div style={{ padding: "20px", maxWidth: "80rem", margin: "0 auto" }}>
        {/* Intro Paragraph */}
        <p style={{ fontSize: "11pt", fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
          At&nbsp;
          <a href="http://washingtoninsider.net" target="_blank" rel="noopener noreferrer">
            <strong>
              <u>
                <span style={{ color: "#1155cc" }}>
                  Washington Insider Magazine
                </span>
              </u>
            </strong>
          </a>
          , we are committed to upholding the highest standards of journalism.
          Our editorial team operates with transparency, accuracy, and
          accountability — values that define our mission to deliver credible,
          balanced, and timely reporting on U.S. politics, policy, and power.
        </p>

        {/* Feedback Invitation */}
        <p style={{ fontSize: "11pt", fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
          We welcome inquiries, feedback, corrections, and editorial pitches
          from readers, contributors, institutions, and media professionals. If
          you have a story idea, a correction request, or questions about our
          editorial practices, please reach out to our editorial team using the
          contact information below.
        </p>

        {/* Contact Editorial Team */}
        <h2 style={{ fontSize: "16pt", fontFamily: "'Playfair Display', serif", marginTop: "24pt" }}>
          Contact the Editorial Team
        </h2>
        <p style={{ fontSize: "11pt", fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
          📧&nbsp;<strong>Editorial Inquiries:</strong>
          <br />
          If you are a reader, contributor, or media professional looking
          to connect with our editors regarding story pitches, op-eds, or
          general editorial matters, please contact:
          <br />
          <strong>✉️ editor@washingtoninsider.net</strong>
        </p>

        {/* News Desk */}
        <h2 style={{ fontSize: "16pt", fontFamily: "'Playfair Display', serif", marginTop: "24pt" }}>
          News Desk
        </h2>
        <p style={{ fontSize: "11pt", fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
          📧&nbsp;<strong>Submit News or Press Releases:</strong>
          <br />
          For breaking news, official statements, and verified reports
          intended for coverage or consideration, please contact our News Desk:
          <br />
          <strong>✉️ news@washingtoninsider.net</strong>
        </p>

        {/* Tips and Insider Signals */}
        <h2 style={{ fontSize: "16pt", fontFamily: "'Playfair Display', serif", marginTop: "24pt" }}>
          Tips and Insider Signals
        </h2>
        <p style={{ fontSize: "11pt", fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
          📧&nbsp;<strong>Submit Confidential Tips:</strong>
          <br />
          If you have a confidential news tip, insider information, or a
          lead related to U.S. politics, policy, or global developments, our
          team treats all tips with the utmost discretion and journalistic
          integrity.
          <br />
          <strong>✉️ tip@washingtoninsider.net</strong>
        </p>

        {/* Whistleblower Note */}
        <p style={{ fontSize: "11pt", fontFamily: "Arial, sans-serif", fontStyle: "italic", lineHeight: "1.6" }}>
          We strongly encourage whistleblowers and informed insiders to come
          forward. You can request anonymity if needed. All information will
          be reviewed by our senior editorial team.
        </p>
      </div>
    </>
  );
};

export default Contact;
