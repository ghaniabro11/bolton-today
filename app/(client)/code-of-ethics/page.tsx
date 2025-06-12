import { DOMAIN_URL } from "@/constant/apiUrl";
import { generateMetadata } from "@/lib/generateMetadata";
export const metadata = generateMetadata({
  title: "Code of Ethics",
  description:
    "Explore Washington Insider Magazine's Code of Ethics—our commitment to accuracy, fairness, independence, and transparency in every story we publish.",
  keywords: [],
  canonical: `${DOMAIN_URL}/code-of-ethics`,
});

const textStyle = {
  fontSize: "11pt",
  // fontFamily: "Playfair Display",
};

const headingStyle = {
  fontSize: "13pt",
  fontFamily: "Playfair Display",
  marginTop: "1.5em",
};

const heading2Style = {
  fontSize: "16pt",
  fontFamily: "Playfair Display",
  marginTop: "2em",
};

const linkStyle = {
  color: "#1155cc",
  fontSize: "11pt",
  fontFamily: "Playfair Display",
  textDecoration: "underline",
};

interface SectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ number, title, children }) => {
  return (
    <section className="mb-10 px-4 py-6 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0 text-white bg-gray-600 rounded-full h-10 w-10 flex items-center justify-center text-lg font-bold shadow-inner">
          {number}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 font-playfair-display">
          {title}
        </h3>
      </div>
      <div className="text-gray-700 leading-relaxed text-[15px]">
        {children}
      </div>
    </section>
  );
};
const CodeOfEthics = () => {
  return (
    <>
      <p style={textStyle}>
        At{" "}
        <a href="http://washingtoninsider.net" style={linkStyle}>
          <em>Washington Insider Magazine</em>
        </a>
        , our mission is to inform, empower, and serve the public with
        integrity, accuracy, and independence. This Code of Ethics defines the
        principles that guide our journalism and underscores our commitment to
        upholding the highest standards of editorial practice.
      </p>

      <Section number="1" title="Commitment to Truth and Accuracy">
        We are committed to reporting the truth as fully as possible. All
        stories are fact-checked, sourced responsibly, and written with context
        and clarity. We avoid sensationalism and correct errors promptly and
        transparently.
      </Section>

      <Section number="2" title="Editorial Independence">
        Our journalism is free from undue influence. We do not allow
        advertisers, sponsors, political affiliations, or special interests to
        compromise our editorial integrity. All editorial decisions are made
        independently by our newsroom.
      </Section>

      <Section number="3" title="Transparency and Accountability">
        We disclose conflicts of interest, affiliations, and relevant funding
        sources wherever applicable. Corrections, clarifications, and updates
        are clearly noted and archived. If we make a mistake, we take
        responsibility and act quickly to correct it.
      </Section>

      <Section number="4" title="Fairness and Impartiality">
        We strive to present all sides of a story, especially on complex or
        contentious issues. Our reporting gives voice to underrepresented
        perspectives while maintaining objectivity and fairness in tone and
        presentation.
      </Section>

      <Section number="5" title="Respect for Sources and Subjects">
        We treat sources and subjects with dignity, even in investigative
        reporting. Anonymous sources are used only when absolutely necessary,
        and their credibility is rigorously vetted. We do not mislead or coerce
        interviewees.
      </Section>

      <Section number="6" title="Editorial Expertise and Professionalism">
        Our editorial team is composed of seasoned journalists, analysts, and
        subject-matter experts. We maintain ongoing training and professional
        development to ensure the credibility, relevance, and expertise behind
        every article we publish.
      </Section>

      <Section number="7" title="Responsible Use of AI and Technology">
        Where artificial intelligence or automation is used in content creation
        or data analysis, we disclose it clearly and ensure that the human
        editorial team maintains full oversight and accountability for published
        content.
      </Section>

      <Section number="8" title="Protection of Privacy">
        We respect the privacy of individuals and balance the public’s right to
        know with harm minimization. Personally identifiable information is only
        published when it is necessary and in the public interest.
      </Section>

      <Section number="9" title="Diversity and Inclusion">
        We are committed to inclusive journalism. Our content and newsroom
        practices reflect the diversity of the communities we cover. We seek to
        challenge bias and avoid stereotypes in all forms.
      </Section>

      <Section number="10" title="Reader Trust and Engagement">
        We actively engage with our readers, welcome feedback, and promote open
        dialogue. We value criticism and constantly strive to improve the
        quality and trustworthiness of our work.
      </Section>

      <h2 style={heading2Style}>
        <strong>Why This Matters</strong>
      </h2>
      <p style={textStyle}>
        This Code of Ethics is not just a set of internal guidelines — it is our
        promise to you, our readers. It ensures that{" "}
        <em>Washington Insider Magazine</em> remains a credible, authoritative,
        and trustworthy source of news, policy insight, and investigative
        reporting in the United States and beyond.
      </p>

      <p style={textStyle}>
        If you have any concerns about our content or practices, please contact
        our editorial team at{" "}
        <a href="mailto:editor@washingtoninsider.net" style={linkStyle}>
          <strong>
            <u>editor@washingtoninsider.net</u>
          </strong>
        </a>
        .
      </p>

      <p style={textStyle}>
        <em>Last updated: June 1, 2025</em>
      </p>
    </>
  );
};

export default CodeOfEthics;
