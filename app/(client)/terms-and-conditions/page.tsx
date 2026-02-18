import React from "react";
import { Metadata } from "next";
import { DOMAIN_URL } from "@/constant/apiUrl";

export const metadata: Metadata = {
  title: "Terms and Conditions | Bolton Today – User Agreement",
  description:
    "Read the Terms and Conditions for using Bolton Today. Understand your rights, responsibilities, and our policies regarding content, privacy, user submissions, and more.",
  alternates: {
    canonical: `${DOMAIN_URL}/terms-and-conditions`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const TermAndCondition = () => {
  return (
    <>
      {/* StartFragment */}
      <main className=" [&_a]:underline [&_a]:font-bold [&_a]:text-head [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold">
        <h1 className="text-black">Terms and Conditions</h1>
        <p>
          Welcome to{" "}
          <a
            href="https://boltontoday.co.uk/"
            className="space-x-1 font-semibold"
          >
            Bolton Today.
          </a>{" "}
          These Terms and Conditions govern your access to and use of our
          website, services, content, and features. By using this site, you
          acknowledge that you have read, understood, and agree to be bound by
          these terms and by our Privacy Policy. If you do not agree to these
          terms, you must refrain from using our website.
        </p>
        <h2 className="text-black">About Bolton Today</h2>
        <p>
          Bolton Today is an independent digital news platform that publishes
          original journalism, local updates, historical features, and opinion
          pieces relevant to the residents and communities of Bolton and Greater
          Manchester. Our platform includes news articles, multimedia content,
          user-submitted features, advertising, and interactive services.
        </p>
        <h2 className="text-black">User Eligibility</h2>
        <p>
          This site is intended for users aged 16 and above. By using the site,
          you confirm that you are at least 16 years old or are accessing the
          site under the supervision of a parent or legal guardian.
        </p>
        <h2 className="text-black">Intellectual Property Rights</h2>
        <p>
          All content published on Bolton Today — including but not limited to
          text, articles, graphics, logos, photographs, audio clips, videos,
          design elements, layout, and software — is the property of Bolton
          Today or its licensors, and is protected by UK and international
          intellectual property laws.
        </p>
        <p>You may:</p>
        <ul>
          <li>View and read content for personal, non-commercial purposes.</li>
          <li>
            Share articles via social media with a clear link back to the
            original article.
          </li>
        </ul>
        <p>You may not:</p>
        <ul>
          <li>
            Copy, reproduce, republish, download, broadcast, transmit, modify,
            or reuse any content for commercial purposes without written
            permission.
          </li>
          <li>
            Use automated tools (e.g., bots, scrapers) to extract or index our
            content.
          </li>
          <li>
            Frame or embed our content on another website without attribution or
            consent.
          </li>
        </ul>
        <h2 className="text-black">Community Submissions and User Content</h2>
        <p>
          We encourage the public to submit local stories, event announcements,
          letters, and community pieces. By submitting content to Bolton Today
          (via email, social media, or submission forms), you agree that:
        </p>
        <ul>
          <li>
            You are the original creator or hold necessary rights and
            permissions.
          </li>
          <li>
            You grant us a worldwide, royalty-free, non-exclusive, perpetual
            licence to publish, edit, display, and distribute your content in
            any format (including syndication, archive, and social media).
          </li>
          <li>
            You waive all moral rights associated with your submission to the
            extent permitted by law.
          </li>
        </ul>
        <p>
          We reserve the right to moderate, edit, or decline submitted content
          at our editorial discretion, especially if it contains:
        </p>
        <ul>
          <li>
            Inaccuracies, defamatory language, hate speech, or inappropriate
            material
          </li>
          <li>Commercial promotions disguised as editorial content</li>
          <li>False claims, impersonation, or spam</li>
        </ul>
        <h2 className="text-black">Code of Conduct</h2>
        <p>
          By accessing Bolton Today, you agree to use the site in a manner
          consistent with local laws and digital publishing ethics. You must
          not:
        </p>
        <ul>
          <li>Post or transmit harmful, harassing, or abusive material</li>
          <li>
            Violate the rights of others, including copyright and privacy rights
          </li>
          <li>
            Attempt to hack, disrupt, or impair the site’s performance or
            security
          </li>
          <li>Use the site to advertise or promote without written consent</li>
        </ul>
        <p>
          Breaching these terms may result in removal of your content,
          suspension of access, or legal action where applicable.
        </p>
        <h2 className="text-black">Advertising and Sponsored Content</h2>
        <p>
          Bolton Today may display advertising or publish sponsored articles
          from third parties. These may include banner ads, affiliate links, or
          native content clearly marked as “Sponsored,” “Advertiser Content,” or
          “Paid Promotion.”
        </p>
        <ul>
          <li>
            We do not endorse products or services unless explicitly stated.
          </li>
          <li>
            Advertisers are solely responsible for the accuracy, legality, and
            compliance of their content.
          </li>
          <li>
            We reserve the right to reject, modify, or remove advertising at our
            discretion.
          </li>
        </ul>
        <p>
          For partnership or advertising inquiries, please{" "}
          <a href="https://boltontoday.co.uk/contact-us">contact us.</a>
        </p>
        <h2 className="text-black">Third-Party Links</h2>
        <p>
          This site may contain hyperlinks to external websites or resources.
          These are provided for convenience only. We have no control over, and
          accept no responsibility for, the content, accuracy, privacy
          practices, or availability of those sites.
        </p>
        <p>
          Linking to external sources does not imply endorsement or affiliation.
          Users should exercise caution and review the terms and privacy
          policies of third-party platforms.
        </p>
        <h2 className="text-black">Disclaimers and Limitation of Liability</h2>
        <p>
          Bolton Today provides its content "as is" and "as available." While we
          strive for accuracy and fairness, we make no warranties regarding the
          completeness, reliability, or timeliness of the information on our
          site.
        </p>
        <ul>
          <li>
            We do not guarantee that the site will be free of errors, viruses,
            or disruptions.
          </li>
          <li>
            We are nots liable for any loss, damage, or harm — direct or
            indirect — arising from use of or reliance on our content.
          </li>
          <li>
            Opinions expressed by columnists, contributors, or commenters are
            their own and not necessarily those of Bolton Today.
          </li>
        </ul>
        <h2 className="text-black">Data Privacy and Cookies</h2>
        <p>
          We respect your privacy. Our use of personal information is governed
          by our Privacy Policy, which explains:
        </p>
        <ul>
          <li>How we collect and use data</li>
          <li>How we store and protect information</li>
          <li>Your rights under the UK GDPR</li>
        </ul>
        <p>
          We also use cookies and similar technologies to improve user
          experience. You may manage cookie preferences via your browser
          settings.
        </p>
        <h2 className="text-black">Modifications to These Terms</h2>
        <p>
          We reserve the right to modify or update these Terms and Conditions at
          any time. When changes are made, the updated version will be posted on
          this page with the revised date. It is your responsibility to check
          periodically for updates. Continued use of the site constitutes
          acceptance of the revised terms.
        </p>
        <h2 className="text-black">Termination</h2>
        <p>
          We may suspend or terminate your access to Bolton Today at any time,
          without prior notice, if you breach these terms or misuse the
          platform. All clauses related to intellectual property, liability, and
          user content rights shall survive termination.
        </p>
        <p>
          These Terms and Conditions shall be governed and interpreted in
          accordance with the laws of England and Wales. Any disputes shall be
          subject to the exclusive jurisdiction of the courts located in
          England.
        </p>
        <h2 className="text-black">Contact Information</h2>
        <p>
          If you have questions or concerns about these Terms and Conditions, or
          wish to report a breach or issue, please contact us:
        </p>
      </main>
      {/* EndFragment */}
    </>
  );
};

export default TermAndCondition;
