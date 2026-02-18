import { DOMAIN_URL } from "@/constant/apiUrl";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bolton Today Editorial Policy",
  description:
    "Learn how Bolton Today ensures accurate, independent, and transparent journalism with strict editorial standards and responsible content practices.",
  alternates: {
    canonical: `${DOMAIN_URL}/ai-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};
const EditorialPolicy = () => {
  return (
    <>
      <main className=" [&_a]:underline [&_a]:font-bold [&_a]:text-head [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold">
        <h1>Editorial Policy</h1>
        <p>Last Updated: February 18, 2026</p>
        <p>
          <a href="https://boltontoday.co.uk/">Bolton Today</a> is committed to
          delivering accurate, fair, and responsible journalism for the people
          of Bolton and the wider UK. Our editorial standards are designed to
          uphold the highest principles of integrity, independence, and
          transparency.
        </p>
        <p>
          This Editorial Policy outlines how we create, verify, and publish our
          content.
        </p>
        <h2>Editorial Independence</h2>
        <p>
          Bolton Today operates with full editorial independence.
          <br />
          All editorial decisions are made without influence from advertisers,
          sponsors, political parties, or external organizations.
        </p>
        <p>
          Advertising, sponsored content, and affiliate material (if any) are
          clearly labeled and separated from editorial content.
        </p>
        <h2>Accuracy and Fact-Checking</h2>
        <p>
          We are committed to publishing information that is accurate and
          verified.
        </p>
        <p>Our editorial team:</p>
        <ul>
          <li>
            <p>Verifies facts using reliable and authoritative sources</p>
          </li>
          <li>
            <p>Confirms information with primary sources whenever possible</p>
          </li>
          <li>
            <p>Cross-checks claims before publication</p>
          </li>
          <li>
            <p>
              Updates or corrects content promptly when errors are identified
            </p>
          </li>
        </ul>
        <p>
          We do not knowingly publish false, misleading, or manipulated
          information.
        </p>
        <h2>Sources and Attribution</h2>
        <p>Bolton Today values transparency in sourcing.</p>
        <p>We:</p>
        <ul>
          <li>
            <p>
              Attribute information to its original source wherever applicable
            </p>
          </li>
          <li>
            <p>Distinguish clearly between verified facts and opinion</p>
          </li>
          <li>
            <p>
              Avoid anonymous sources unless necessary for public interest and
              safety
            </p>
          </li>
          <li>
            <p>Do not plagiarize content from other publishers</p>
          </li>
        </ul>
        <p>All original reporting is clearly credited to its author.</p>
        <h2>Author Responsibility and Expertise</h2>
        <p>Each article published on Bolton Today includes:</p>
        <ul>
          <li>
            <p>The author’s name</p>
          </li>
          <li>
            <p>A short author bio outlining their experience or expertise</p>
          </li>
          <li>
            <p>The date of publication and last update (if applicable)</p>
          </li>
        </ul>
        <p>
          Our writers are selected based on their knowledge of local news,
          public affairs, and relevant subject matter.
        </p>
        <h2>Corrections and Updates Policy</h2>
        <p>We take responsibility for our mistakes.</p>
        <p>If an error is discovered:</p>
        <ul>
          <li>
            <p>The article will be corrected promptly</p>
          </li>
          <li>
            <p>A correction notice will be added where appropriate</p>
          </li>
          <li>
            <p>Major factual changes will be disclosed transparently</p>
          </li>
        </ul>
        <h2>Content Standards</h2>
        <p>Bolton Today publishes original journalism covering:</p>
        <ul>
          <li>
            <p>Local news and events</p>
          </li>
          <li>
            <p>Politics and public services</p>
          </li>
          <li>
            <p>Business and economy</p>
          </li>
          <li>
            <p>Crime and safety</p>
          </li>
          <li>
            <p>Education and health</p>
          </li>
          <li>
            <p>Culture and community stories</p>
          </li>
        </ul>
        <p>We do not publish:</p>
        <ul>
          <li>
            <p>Hate speech or discriminatory content</p>
          </li>
          <li>
            <p>Sensational or misleading headlines (clickbait)</p>
          </li>
          <li>
            <p>Content that promotes violence or illegal activity</p>
          </li>
          <li>
            <p>
              Medical, legal, or financial advice without qualified sourcing
            </p>
          </li>
        </ul>
        <h2>Opinion and Editorial Content</h2>
        <p>Opinion articles are clearly labeled as “Opinion” or “Editorial.”</p>
        <p>
          They represent the views of the author and not necessarily those of
          Bolton Today.
          <br />
          Opinion pieces are based on factual information and respectful debate.
        </p>
        <h2>Sponsored Content and Advertising</h2>
        <p>Any sponsored or paid content is:</p>
        <ul>
          <li>
            <p>Clearly labeled as “Sponsored” or “Advertisement”</p>
          </li>
          <li>
            <p>Separated from newsroom editorial content</p>
          </li>
          <li>
            <p>Produced in compliance with UK advertising standards</p>
          </li>
        </ul>
        <p>
          Bolton Today does not allow advertisers to influence editorial
          decisions.
        </p>
        <h2>Privacy and Ethics</h2>
        <p>Bolton Today respects privacy and ethical journalism standards.</p>
        <p>We:</p>
        <ul>
          <li>
            <p>Avoid unnecessary intrusion into private lives</p>
          </li>
          <li>
            <p>Protect minors and vulnerable individuals</p>
          </li>
          <li>
            <p>Follow UK data protection and privacy regulations</p>
          </li>
          <li>
            <p>
              Do not publish personal data without lawful and editorial
              justification
            </p>
          </li>
        </ul>
        <h2>Community Trust and Accountability</h2>
        <p>We aim to serve the Bolton community with responsible reporting.</p>
        <p>Readers can contact our editorial team for:</p>
        <ul>
          <li>
            <p>Corrections</p>
          </li>
          <li>
            <p>Complaints</p>
          </li>
          <li>
            <p>Feedback</p>
          </li>
          <li>
            <p>Story tips</p>
          </li>
        </ul>
        <p>
          Contact us at:
          <br />
          [Insert official editorial email address]
        </p>
        <h2>Use of Artificial Intelligence</h2>
        <p>
          If artificial intelligence tools are used in any part of content
          creation:
        </p>
        <ul>
          <li>
            <p>
              All content is reviewed and edited by human editors before
              publication
            </p>
          </li>
          <li>
            <p>
              AI is used only as a support tool, not as the final decision-maker
            </p>
          </li>
          <li>
            <p>
              Responsibility for accuracy remains with Bolton Today’s editorial
              team
            </p>
          </li>
        </ul>
        <h2>Why This Editorial Policy Matters</h2>
        <p>This policy helps Bolton Today:</p>
        <ul>
          <li>
            <p>Meet Google News and Discover content quality requirements</p>
          </li>
          <li>
            <p>Demonstrate transparency and trustworthiness</p>
          </li>
          <li>
            <p>
              Improve eligibility for news surfaces and recommendation systems
            </p>
          </li>
          <li>
            <p>Build long-term reader credibility</p>
          </li>
        </ul>
      </main>
    </>
  );
};

export default EditorialPolicy;
