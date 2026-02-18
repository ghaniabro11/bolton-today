import { DOMAIN_URL } from "@/constant/apiUrl";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bolton Today Editorial Guidelines",
  description:
    "Read Bolton Today’s Editorial Guidelines on accuracy, transparency, AI use, and ethical standards for independent, responsible journalism in Bolton and the UK.",
  alternates: {
    canonical: `${DOMAIN_URL}/editorial-guidelines`,
  },
  robots: {
    index: true,
    follow: true,
  },
};
const EditorialGuidlines = () => {
  return (
    <>
      {/* StartFragment */}
      <main className=" [&_a]:underline [&_a]:font-bold [&_a]:text-head [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold">
        <h1>Editorial Guidelines</h1>
        <p>
          Publisher: Bolton Today
          <br />
          Website:
          <a href="https://boltontoday.co.uk">
            https://boltontoday.co.uk
            <br />
          </a>
          Effective Date: February 18, 2026
          <br />
          Contact: [editorial@boltontoday.co.uk]
        </p>
        <p>
          <a href="https://boltontoday.co.uk/">Bolton Today</a> is an
          independent digital news publisher committed to producing accurate,
          transparent, and ethical journalism for the Bolton community and the
          wider UK audience.
        </p>
        <p>
          These Editorial Guidelines define how our newsroom operates and how
          editorial decisions are made.
        </p>
        <h2>Editorial Mission</h2>
        <p>
          Our mission is to provide timely, factual, and impartial news that
          serves the public interest and strengthens community awareness.
        </p>
        <p>We aim to:</p>
        <ul>
          <li>
            <p>Inform, not influence</p>
          </li>
          <li>
            <p>Report facts, not rumors</p>
          </li>
          <li>
            <p>Serve readers with integrity and responsibility</p>
          </li>
        </ul>
        <h2>Editorial Independence</h2>
        <p>Bolton Today maintains full editorial independence.</p>
        <ul>
          <li>
            <p>
              Editorial decisions are not influenced by advertisers, sponsors,
              or political entities
            </p>
          </li>
          <li>
            <p>
              Commercial content is clearly separated from editorial content
            </p>
          </li>
          <li>
            <p>Sponsored material is labeled transparently</p>
          </li>
        </ul>
        <h2>Accuracy and Verification</h2>
        <p>
          All content published by Bolton Today must meet strict verification
          standards:
        </p>
        <ul>
          <li>
            <p>
              Information is confirmed using reliable and authoritative sources
            </p>
          </li>
          <li>
            <p>Primary sources are prioritized whenever available</p>
          </li>
          <li>
            <p>Claims are cross-checked before publication</p>
          </li>
          <li>
            <p>Headlines must reflect the facts of the article</p>
          </li>
          <li>
            <p>Misleading or manipulated content is not permitted</p>
          </li>
        </ul>
        <h2>Sources and Attribution</h2>
        <p>We commit to responsible sourcing:</p>
        <ul>
          <li>
            <p>All external information is credited to its original source</p>
          </li>
          <li>
            <p>
              Anonymous sources are used only when necessary and justified by
              public interest
            </p>
          </li>
          <li>
            <p>Plagiarism is strictly prohibited</p>
          </li>
          <li>
            <p>Copyright laws are respected</p>
          </li>
          <li>
            <p>Distinction is made between fact, analysis, and opinion</p>
          </li>
        </ul>
        <h2>Authors and Accountability</h2>
        <p>Each article includes:</p>
        <ul>
          <li>
            <p>Author name</p>
          </li>
          <li>
            <p>Publication date</p>
          </li>
          <li>
            <p>Update date (if applicable)</p>
          </li>
          <li>
            <p>Author biography with relevant experience</p>
          </li>
        </ul>
        <p>
          Editors are responsible for ensuring accuracy, clarity, and compliance
          with these guidelines.
        </p>
        <h2>Content Categories</h2>
        <p>
          Bolton Today publishes original content in the following categories:
        </p>
        <ul>
          <li>
            <p>Local and regional news</p>
          </li>
          <li>
            <p>Politics and public services</p>
          </li>
          <li>
            <p>Crime and public safety</p>
          </li>
          <li>
            <p>Business and economy</p>
          </li>
          <li>
            <p>Education and health</p>
          </li>
          <li>
            <p>Culture, sports, and community</p>
          </li>
        </ul>
        <p>Content must be relevant, original, and newsworthy.</p>
        <h2>Opinion and Editorial Content</h2>
        <p>Opinion pieces are clearly labeled as “Opinion” or “Editorial”.</p>
        <p>They:</p>
        <ul>
          <li>
            <p>Reflect the views of the author, not Bolton Today</p>
          </li>
          <li>
            <p>Are based on factual information</p>
          </li>
          <li>
            <p>Must not contain hate speech or personal attacks</p>
          </li>
          <li>
            <p>Encourage respectful debate</p>
          </li>
        </ul>
        <h2>Corrections and Updates</h2>
        <p>We are committed to transparency and accountability.</p>
        <p>If errors occur:</p>
        <ul>
          <li>
            <p>Corrections are made promptly</p>
          </li>
          <li>
            <p>A correction notice is added where appropriate</p>
          </li>
          <li>
            <p>Major changes are disclosed to readers</p>
          </li>
        </ul>
        <h2>Sponsored and Commercial Content</h2>
        <p>Sponsored content is:</p>
        <ul>
          <li>
            <p>Clearly labeled</p>
          </li>
          <li>
            <p>Separate from editorial content</p>
          </li>
          <li>
            <p>Produced according to UK advertising standards</p>
          </li>
        </ul>
        <p>Advertisers do not influence newsroom decisions.</p>
        <h2>Ethical Journalism Standards</h2>
        <p>Bolton Today adheres to professional ethical standards:</p>
        <ul>
          <li>
            <p>Respect for privacy and dignity</p>
          </li>
          <li>
            <p>Protection of minors and vulnerable individuals</p>
          </li>
          <li>
            <p>Responsible reporting of crime and tragedy</p>
          </li>
          <li>
            <p>No promotion of hate, violence, or discrimination</p>
          </li>
          <li>
            <p>Compliance with UK law and data protection regulations</p>
          </li>
        </ul>
        <h2>Use of Artificial Intelligence</h2>
        <p>If AI tools are used:</p>
        <ul>
          <li>
            <p>All content is reviewed and edited by human editors</p>
          </li>
          <li>
            <p>AI is used as a support tool only</p>
          </li>
          <li>
            <p>Editorial responsibility remains with Bolton Today</p>
          </li>
        </ul>
        <h2>Prohibited Content</h2>
        <p>We do not publish:</p>
        <ul>
          <li>
            <p>False or misleading information</p>
          </li>
          <li>
            <p>Clickbait or sensational headlines</p>
          </li>
          <li>
            <p>Hate speech or discriminatory material</p>
          </li>
          <li>
            <p>Illegal or harmful content</p>
          </li>
          <li>
            <p>Medical, legal, or financial advice without qualified sources</p>
          </li>
        </ul>
        <p>We welcome feedback, complaints, and story tips from our readers.</p>
        <h2>Policy Review and Updates</h2>
        <p>
          These Editorial Guidelines are reviewed regularly and updated to
          reflect:
        </p>
        <ul>
          <li>
            <p>Best journalistic practices</p>
          </li>
          <li>
            <p>Regulatory requirements</p>
          </li>
          <li>
            <p>Platform policies</p>
          </li>
          <li>
            <p>Community expectations</p>
          </li>
        </ul>
      </main>
      {/* EndFragment */}
    </>
  );
};

export default EditorialGuidlines;
