import React from "react";
import { DOMAIN_URL } from "@/constant/apiUrl";
import { generateMetadata } from "@/lib/generateMetadata";
export const metadata = generateMetadata({
  title: "Editorial Policy",
  description:
    "Editorial Policy of Washington Insider Magazine: Committed to accurate, ethical, and independent journalism. Learn how we ensure trust and transparency.",
  keywords: [],
  canonical: `${DOMAIN_URL}/editor-policy`,
});
const EditorPolicy = () => {
  return (
    <>
    {/* Google Font for Playfair Display */}
   
    <div style={{ padding: "20px", maxWidth: "80rem", margin: "0 auto" }}>
      <p
        style={{
          fontSize: "11pt",
          fontFamily: "Arial, sans-serif",
          margin: "12pt 0",
          lineHeight: "normal",
        }}
        
      >
        <strong>
          <span style={{ color: "#000" }}>
            Last Updated: June 1, 2025
            <br />
          </span>
        </strong>
        <span style={{ color: "#000" }}>For inquiries, contact:&nbsp;</span>
        <a href="mailto:editor@washingtoninsider.net">
          <span style={{ fontSize: 15, color: "#1155CC" }}>
            editor@washingtoninsider.net
          </span>
        </a>
      </p>

      {/* Section: Our Editorial Mission */}
      <h2
        style={{
          fontSize: "21pt",
          fontFamily: "'Playfair Display', serif",
          color: "#4B4B4B",
          marginTop: "24pt",
        }}
      >
        Our Editorial Mission
      </h2>
      <p
        style={{
          fontSize: "11pt",
          fontFamily: "Arial, sans-serif",
          margin: "12pt 0",
          color: "#000",
          lineHeight: "1.5",
        }}
      >
        <a href="http://washingtoninsider.net">
          <em>
            <span style={{ fontSize: 15, color: "#1155CC" }}>
              Washington Insider Magazine
            </span>
          </em>
        </a>{" "}
        is committed to delivering trustworthy, fact-based, and insightful
        journalism that informs, engages, and empowers our readers. Our team
        of seasoned journalists and contributors uphold the highest standards
        of reporting integrity.

      </p>

      {/* Section: Editorial Independence */}
      <h2
        style={{
          fontSize: "21pt",
          fontFamily: "'Playfair Display', serif",
          color: "#4B4B4B",
          marginTop: "24pt",
        }}
      >
        Editorial Independence
      </h2>
      <p
        style={{
          fontSize: "11pt",
          fontFamily: "Arial, sans-serif",
          margin: "12pt 0",
          color: "#000",
          lineHeight: "1.5",
        }}
      >
        Our editorial content is completely independent of any political,
        commercial, or ideological influence. Our writers and editors are free
        to pursue stories they deem important without outside interference.

      </p>

      {/* Section: Ethical Standards */}
      <h2
        style={{
          fontSize: "21pt",
          fontFamily: "'Playfair Display', serif",
          color: "#4B4B4B",
          marginTop: "24pt",
        }}
      >
        Ethical Standards
      </h2>
      <p
        style={{
          fontSize: "11pt",
          fontFamily: "Arial, sans-serif",
          margin: "12pt 0",
          color: "#000",
          lineHeight: "1.5",
        }}
      >
        Our team upholds the highest standards of journalistic ethics,
        including truthfulness, accuracy, fairness, and accountability. We
        attribute sources clearly and strive to avoid conflicts of interest in
        all editorial decisions.

      </p>

      {/* Section: Corrections Policy */}
      <h2
        style={{
          fontSize: "21pt",
          fontFamily: "'Playfair Display', serif",
          color: "#4B4B4B",
          marginTop: "24pt",
        }}
      >
        Corrections Policy
      </h2>
      <p
        style={{
          fontSize: "11pt",
          fontFamily: "Arial, sans-serif",
          margin: "12pt 0",
          color: "#000",
          lineHeight: "1.5",
        }}
      >
        We take responsibility for our content. If an error is discovered in
        any article or post, we promptly issue a correction with transparency
        and clarity. Readers can contact us directly to report inaccuracies.

      </p>

      {/* Section: Sources and Citations */}
      <h2
        style={{
          fontSize: "21pt",
          fontFamily: "'Playfair Display', serif",
          color: "#4B4B4B",
          marginTop: "24pt",
        }}
      >
        Sources and Citations
      </h2>
      <p
        style={{
          fontSize: "11pt",
          fontFamily: "Arial, sans-serif",
          margin: "12pt 0",
          color: "#000",
          lineHeight: "1.5",
        }}
      >
        All factual claims are supported with credible sources. We strive to
        provide links to original documents, reports, or authoritative sites
        wherever possible so readers can verify information independently.

      </p>

      {/* Section: Contributor Guidelines */}
      <h2
        style={{
          fontSize: "21pt",
          fontFamily: "'Playfair Display', serif",
          color: "#4B4B4B",
          marginTop: "24pt",
        }}
      >
        Contributor Guidelines
      </h2>
      <p
        style={{
          fontSize: "11pt",
          fontFamily: "Arial, sans-serif",
          margin: "12pt 0",
          color: "#000",
          lineHeight: "1.5",
        }}
      >
        Contributors must adhere to our editorial standards and ethics policy.
        All submissions go through a thorough editorial review process before
        publication. Plagiarism or misrepresentation is grounds for rejection.

      </p>

      {/* Section: Sponsored Content Disclosure */}
      <h2
        style={{
          fontSize: "21pt",
          fontFamily: "'Playfair Display', serif",
          color: "#4B4B4B",
          marginTop: "24pt",
        }}
      >
        Sponsored Content Disclosure
      </h2>
      <p
        style={{
          fontSize: "11pt",
          fontFamily: "Arial, sans-serif",
          margin: "12pt 0",
          color: "#000",
          lineHeight: "1.5",
        }}
      >
        Sponsored content or advertorials are clearly labeled to avoid reader
        confusion. These do not influence our editorial content and are kept
        strictly separate.

      </p>

      {/* Section: Feedback and Complaints */}
      <h2
        style={{
          fontSize: "21pt",
          fontFamily: "'Playfair Display', serif",
          color: "#4B4B4B",
          marginTop: "24pt",
        }}
      >
        Feedback and Complaints
      </h2>
      <p
        style={{
          fontSize: "11pt",
          fontFamily: "Arial, sans-serif",
          margin: "12pt 0",
          color: "#000",
          lineHeight: "1.5",
        }}
      >
        We value reader feedback. If you believe a story falls short of our
        standards, please contact us at{" "}
        <a href="mailto:editor@washingtoninsider.net">
          <span style={{ color: "#1155CC" }}>
            editor@washingtoninsider.net
          </span>
        </a>
        . We take every complaint seriously and review it internally.

      </p>
    </div>
  </>
  );
};

export default EditorPolicy;
