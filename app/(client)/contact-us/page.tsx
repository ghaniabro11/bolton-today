import { DOMAIN_URL } from "@/constant/apiUrl";
import { generateMetadata } from "@/lib/generateMetadata";
export const metadata = generateMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Bolton Today for news tips, media inquiries, or editorial feedback. We're committed to transparency and credible journalism.",
  keywords: ["contact", "news tips", "editorial feedback", "advertise"],
  canonical: `${DOMAIN_URL}/contact-us`,
});
const Contact = () => {
  const linkStyle = {
    color: "#1155cc",
    fontSize: "11pt",
    // fontFamily: "Play, sans-serif",
    textDecoration: "underline",
  };
  return (
    <div className="prose prose-lg max-w-7xl mx-auto text-gray-800">
      <p>
        At{" "}
        <a href="https://boltontoday.co.uk" style={linkStyle}>
          <em>Bolton Today</em>
        </a>
        , we value transparency, accountability, and open communication. Whether
        you're a reader with a question, a source with a tip, or an organization
        seeking coverage or clarification, we’re here to listen.
      </p>

      <h2 className=" font-playfair-display text-2xl font-bold text-gray-700">General Inquiries</h2>
      <p>
        For editorial questions, news tips, corrections, or general feedback,
        please contact us via email: 📩{" "}
        <strong className="text-gray-600">info@washingtoninsider.net</strong>
      </p>
      <p>
        We review all inquiries and aim to respond within 1–2 business days.
      </p>

      <h2 className=" font-playfair-display text-2xl font-bold text-gray-700">Editorial Standards</h2>
      <p>
        We are committed to delivering factual, balanced, and thoroughly
        researched journalism. If you believe a story requires correction or
        further clarification, please email our editorial team directly. Our
        commitment to{" "}
        <strong>accuracy, ethical reporting, and transparency</strong> is
        central to our mission.
      </p>

      <h2 className=" font-playfair-display text-2xl font-bold text-gray-700">Submit a News Tip</h2>
      <p>
        Do you have credible information the public needs to know? We welcome
        tips from government officials, private individuals, and whistleblowers.
        Your identity will be protected in accordance with journalistic ethics.
        You can share sensitive information securely by emailing us at{" "}
        <strong className="text-gray-600">info@washingtoninsider.net</strong>{" "}
        with the subject line “Confidential Tip.”
      </p>

      <h2 className=" font-playfair-display text-2xl font-bold text-gray-700">
        Advertise or Partner With Us
      </h2>
      <p>
        If you're interested in advertising, sponsorships, or partnership
        opportunities, please email our business team at{" "}
        <strong className="text-gray-600">info@washingtoninsider.net</strong>{" "}
        and include “Media Inquiry” in the subject line.
      </p>

      <h2 className=" font-playfair-display text-2xl font-bold text-gray-700">Office Location</h2>
      <p>
        For official correspondence or mailing, please contact us at our
        editorial email to schedule or verify the appropriate mailing address.
      </p>

      <p>
        <strong>Bolton Today</strong> proudly upholds the
        principles of the <strong>Society of Professional Journalists</strong>{" "}
        (SPJ) and complies with Google News content and transparency policies.
      </p>
    </div>
  );
};

export default Contact;
