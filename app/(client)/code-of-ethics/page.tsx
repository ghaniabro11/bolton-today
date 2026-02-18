import { DOMAIN_URL } from "@/constant/apiUrl";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bolton Today Code of Ethics ",
  description:
    "Read Bolton Today’s Code of Ethics outlining our commitment to ethical, transparent, and accountable journalism for the Bolton community and UK readers.",
  alternates: {
    canonical: `${DOMAIN_URL}/code-of-ethics`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const CodeOfEthics = () => {
  return (
    <>
      {/* StartFragment */}
      <main className=" [&_a]:underline [&_a]:font-bold [&_a]:text-head [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold">
        <h1>Code of Ethics</h1>
        <p>Last Updated: February 18, 2026</p>
        <p>
          At <a href="https://boltontoday.co.uk/">Bolton Today</a>, we are
          committed to upholding the highest standards of ethical journalism.
          Our Code of Ethics guides every aspect of our reporting, ensuring
          accuracy, fairness, transparency, and accountability in all content
          published for the Bolton community and the wider UK audience.
        </p>
        <h2>Accuracy and Verification</h2>
        <p>
          We prioritize factual accuracy in all reporting. Our journalists and
          editors:
        </p>
        <ul>
          <li>
            <p>Verify information using authoritative sources</p>
          </li>
          <li>
            <p>Confirm statements with primary sources whenever possible</p>
          </li>
          <li>
            <p>Cross-check claims before publication</p>
          </li>
          <li>
            <p>Correct errors promptly and transparently</p>
          </li>
        </ul>
        <p>
          We do not knowingly publish false, misleading, or manipulated content.
        </p>
        <h2>Independence and Editorial Integrity</h2>
        <p>Bolton Today maintains full editorial independence. This means:</p>
        <ul>
          <li>
            <p>
              Editorial decisions are free from influence by advertisers,
              sponsors, or political entities
            </p>
          </li>
          <li>
            <p>
              Sponsored or commercial content is clearly labeled and separated
              from news content
            </p>
          </li>
          <li>
            <p>
              Our newsroom operates without pressure to favor specific interests
            </p>
          </li>
        </ul>
        <p>
          We ensure that our reporting serves the public interest, not external
          agendas.
        </p>
        <h2>Fairness and Impartiality</h2>
        <p>Our journalists strive to:</p>
        <ul>
          <li>
            <p>Report news objectively and without bias</p>
          </li>
          <li>
            <p>Present all relevant sides of a story</p>
          </li>
          <li>
            <p>Avoid personal or organizational conflicts of interest</p>
          </li>
          <li>
            <p>
              Ensure opinions and editorials are clearly labeled and
              distinguished from factual reporting
            </p>
          </li>
        </ul>
        <h2>Respect and Privacy</h2>
        <p>
          We respect the dignity and privacy of individuals. Our commitment
          includes:
        </p>
        <ul>
          <li>
            <p>Avoiding unnecessary intrusion into private lives</p>
          </li>
          <li>
            <p>Protecting minors and vulnerable individuals</p>
          </li>
          <li>
            <p>Adhering to UK data protection laws and regulations</p>
          </li>
          <li>
            <p>
              Using sensitive judgment when reporting on crime, health, or
              tragedy
            </p>
          </li>
        </ul>
        <h2>Responsible Use of Artificial Intelligence</h2>
        <p>If AI tools are used in content creation:</p>
        <ul>
          <li>
            <p>AI is only a support tool, not a decision-maker</p>
          </li>
          <li>
            <p>Human editors review and verify all AI-assisted content</p>
          </li>
          <li>
            <p>
              Accuracy, fairness, and editorial responsibility remain fully with
              Bolton Today
            </p>
          </li>
        </ul>
        <p>
          This ensures our content maintains journalistic integrity while
          responsibly leveraging technology.
        </p>
        <h2>Transparency and Accountability</h2>
        <p>We value reader trust and maintain transparency by:</p>
        <ul>
          <li>
            <p>Clearly attributing information to original sources</p>
          </li>
          <li>
            <p>Disclosing corrections and updates when errors occur</p>
          </li>
          <li>
            <p>
              Providing a clear channel for readers to report inaccuracies,
              complaints, or feedback
            </p>
          </li>
          <li>
            <p>
              Being accountable for all editorial decisions and published
              content
            </p>
          </li>
        </ul>
        <h2>Commitment to Ethical Journalism</h2>
        <p>Bolton Today journalists and editors pledge to:</p>
        <ul>
          <li>
            <p>Uphold honesty, accuracy, and fairness in reporting</p>
          </li>
          <li>
            <p>Avoid sensationalism, clickbait, and misleading headlines</p>
          </li>
          <li>
            <p>
              Maintain a clear distinction between news, opinion, and analysis
            </p>
          </li>
          <li>
            <p>Respect copyright laws and intellectual property</p>
          </li>
          <li>
            <p>
              Serve the Bolton community and wider UK readership responsibly
            </p>
          </li>
        </ul>
      </main>
      {/* EndFragment */}
    </>
  );
};

export default CodeOfEthics;
