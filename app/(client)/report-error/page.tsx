import { DOMAIN_URL } from "@/constant/apiUrl";
import { generateMetadata } from "@/lib/generateMetadata";
export const metadata = generateMetadata({
  title: "Report Error",
  description:
    "Report errors or corrections in Washington Insider Magazine articles, images, quotes, or media. Help us maintain accuracy and trust. Email error@washingtoninsider.net.",
  keywords: [],
  canonical: `${DOMAIN_URL}/report-error`,
});
const Contact = () => {
  return (
    <div className="prose prose-lg max-w-7xl mx-auto px-4 py-8">
      <p>
        At{" "}
        <a
          href="http://washingtoninsider.net"
          className="text-blue-600 underline font-semibold"
        >
          Washington Insider Magazine
        </a>
        , we are deeply committed to <strong>journalistic integrity</strong>,{" "}
        <strong>accuracy</strong>, and <strong>accountability</strong>. Our
        mission is to provide fact-based, timely, and trustworthy reporting that
        serves the public interest. If you find any errors in our reporting,
        please let us know.
      </p>

      <h2 className="font-playfair-display">We Value Accuracy</h2>
      <p>
        Mistakes happen. When they do, we act quickly and transparently to
        correct them. Your feedback helps us uphold the highest standards of
        journalism.
      </p>

      <h2 className="font-playfair-display">You Can Report</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Article Corrections:</strong> Factual inaccuracies, outdated
          data, or misleading statements.
        </li>
        <li>
          <strong>Magazine Content Corrections:</strong> Errors in digital or
          print magazine editions.
        </li>
        <li>
          <strong>Media Corrections:</strong> Mistakes in captions,
          infographics, or charts.
        </li>
        <li>
          <strong>Image Credit Corrections:</strong> Missing or incorrect photo
          credits.
        </li>
        <li>
          <strong>Quote Corrections:</strong> Misquoted or misattributed
          statements.
        </li>
      </ul>

      <h2 className="font-playfair-display">How to Report</h2>
      <p>
        To report any issue, email us at:
        <br />
        <a
          href="mailto:error@washingtoninsider.net"
          className="text-blue-600 underline font-semibold"
        >
          📧 error@washingtoninsider.net
        </a>
      </p>

      <p>Please include the following information:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Article title or URL</strong>
        </li>
        <li>
          <strong>Date of publication</strong>
        </li>
        <li>
          <strong>Specific details about the error</strong>
        </li>
        <li>
          <strong>Suggested correction (if applicable)</strong>
        </li>
        <li>
          <strong>Your contact information</strong> (optional)
        </li>
      </ul>

      <h2 className="font-playfair-display">Our Correction Policy</h2>
      <p>
        All reports are reviewed by our{" "}
        <strong>Editorial Standards Team</strong>. If an error is confirmed, we
        update the article and append an <strong>Editor's Note</strong>{" "}
        indicating the correction date and details. Print edition corrections
        are made in the following issue and updated online as well.
      </p>

      <h2 className="font-playfair-display">
        Upholding Trust and Transparency
      </h2>
      <p>
        As an independent, reader-supported news outlet, we value openness and
        accountability. This policy reflects our ongoing commitment to{" "}
        <strong>transparency in journalism</strong>.
      </p>
    </div>
  );
};

export default Contact;
