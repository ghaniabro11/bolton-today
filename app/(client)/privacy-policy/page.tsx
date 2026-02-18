import { DOMAIN_URL } from "@/constant/apiUrl";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Bolton Today – Your Data & Rights",
  description:
    "Read Bolton Today's Privacy Policy to learn how we collect, use, and protect your personal information. Understand your rights under UK GDPR and how to manage your privacy preferences.",
  alternates: {
    canonical: `${DOMAIN_URL}/privacy-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};
const PrivacyPolicy = () => {
  return (
    <>
      {/* StartFragment */}
      <main className=" [&_a]:underline [&_a]:font-bold [&_a]:text-head [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold">
        <h1 className="text-black">Privacy Policy</h1>
        <p>
          At
          <a
            href="https://boltontoday.co.uk/"
            className="space-x-1 font-semibold"
          >
            Bolton Today,
          </a>{" "}
          we value your privacy and are committed to protecting your personal
          information. This Privacy Policy explains how we collect, use, and
          safeguard the data you share with us when visiting our website.
        </p>
        <h2 className="text-black">Who We Are</h2>
        <p>
          Bolton Today is an independent digital news platform focused on
          covering local stories, community events, politics, sports, and
          culture in Bolton and the surrounding areas.
        </p>
        <h2 className="text-black">What Information We Collect</h2>
        <p>We collect personal and non-personal data in the following ways:</p>
        <h4>a. Information You Provide Voluntarily:</h4>
        <ul>
          <li>When subscribing to newsletters</li>
          <li>When contacting us via email</li>
          <li>When submitting story tips or community events</li>
        </ul>
        <p>This may include:</p>
        <ul>
          <li>Name, email address, phone number</li>
          <li>Your message or submission details</li>
        </ul>
        <h4>b. Information Collected Automatically:</h4>
        <p>When you visit our site, we may collect:</p>
        <ul>
          <li>IP address</li>
          <li>Browser type and device</li>
          <li>Pages visited and time spent</li>
          <li>Referring websites</li>
        </ul>
        <p>
          We use cookies and analytics tools (such as Google Analytics) to help
          improve the site and better understand our audience.
        </p>
        <h2 className="text-black">How We Use Your Data</h2>
        <p>We may use the information we collect to:</p>
        <ul>
          <li>Respond to your messages or inquiries</li>
          <li>Send you newsletters or alerts (only with consent)</li>
          <li>Improve site performance and content relevance</li>
          <li>Ensure the security of our website</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>
          We do not sell or rent your personal information to third parties.
        </p>
        <h2 className="text-black">Cookies and Tracking Technologies</h2>
        <p>
          Cookies are small files placed on your device to improve user
          experience. We use:
        </p>
        <ul>
          <li>Essential cookies for basic functionality</li>
          <li>Performance cookies to monitor traffic and site usage</li>
          <li>
            Third-party cookies (e.g. Google Analytics, embedded social media
            content)
          </li>
        </ul>
        <p>
          You can manage or disable cookies through your browser settings.
          Blocking some types of cookies may impact your experience on our site.
        </p>
        <h2 className="text-black">Third-Party Links</h2>
        <p>
          Our website may include links to external websites, such as government
          portals, cultural institutions, or partner publications. We are not
          responsible for the privacy practices of those websites. We recommend
          reading their privacy policies.
        </p>
        <h2 className="text-black">Email Communications</h2>
        <p>If you opt in to our newsletter or breaking news alerts:</p>
        <ul>
          <li>You will only receive content you’ve signed up for</li>
          <li>
            You can unsubscribe at any time using the link provided in emails
          </li>
        </ul>
        <p>
          We comply fully with anti-spam regulations under the UK Privacy and
          Electronic Communications Regulations (PECR).
        </p>
        <h2 className="text-black">Your Rights Under UK GDPR</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request corrections to inaccurate data</li>
          <li>Request deletion of your data (in certain cases)</li>
          <li>Withdraw consent at any time</li>
          <li>Object to data processing for direct marketing</li>
          <li>
            Lodge a complaint with the UK Information Commissioner’s Office
            (ICO)
          </li>
        </ul>
        <p>
          To exercise any of these rights, email us at:
          <a href="privacy@boltontoday.co.uk" className="font-semibold">
            privacy@boltontoday.co.uk
          </a>
        </p>
        <h2 className="text-black">Data Retention</h2>
        <p>We retain personal data only for as long as necessary:</p>
        <ul>
          <li>To fulfill the purposes outlined in this policy</li>
          <li>To comply with legal and regulatory requirements</li>
        </ul>
        <p>
          Analytics data may be stored longer in anonymised form to understand
          long-term trends.
        </p>
        <h2 className="text-black">Security Measures</h2>
        <p>
          We use industry-standard security protocols to protect your data from
          unauthorized access, alteration, or loss. However, no system can
          guarantee 100% security, especially during data transmission online.
        </p>
        <h2 className="text-black">Updates to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically to reflect changes in
          the law or our practices. All updates will be posted on this page with
          the “Last Updated” date.
        </p>
      </main>
      {/* EndFragment */}
    </>
  );
};

export default PrivacyPolicy;
