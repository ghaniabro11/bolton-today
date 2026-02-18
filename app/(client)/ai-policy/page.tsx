import { DOMAIN_URL } from "@/constant/apiUrl";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bolton AI Policy",
  description:
    "Learn how Bolton Today responsibly uses AI to assist our journalists while maintaining accuracy, editorial integrity, and local reporting standards.",
  alternates: {
    canonical: `${DOMAIN_URL}/ai-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const AIPolicy = () => {
  return (
    <>
      {/* StartFragment */}
      <main className=" [&_a]:underline [&_a]:font-bold [&_a]:text-head [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold">
        <h1>Bolton AI Policy</h1>
        <p>Last Updated: February 18, 2026</p>
        <p>
          At <a href="https://boltontoday.co.uk/">Bolton Today</a>, we use
          artificial intelligence (AI) tools to assist our journalists in
          producing timely, accurate, and locally relevant news. AI helps with
          research, article structure, and multimedia enhancements, but all
          content is verified and edited by humans to ensure high-quality
          journalism.
        </p>
        <h2>What AI Means at Bolton Today</h2>
        <p>
          AI includes technologies that can perform tasks normally requiring
          human intelligence, such as:
        </p>
        <ul>
          <li>
            <p>Summarizing information from multiple sources</p>
          </li>
          <li>
            <p>Drafting article outlines</p>
          </li>
          <li>
            <p>Enhancing images, audio, and video</p>
          </li>
        </ul>
        <p>
          AI supports, but does not replace, the work of our editorial team.
        </p>
        <h2>Our Principles</h2>
        <h3>Transparency</h3>
        <p>
          We clearly indicate where AI has assisted in content creation —
          including images, video, or substantial editorial support. Readers
          always know when technology is involved.
        </p>
        <h3>Human Oversight</h3>
        <p>
          All AI-assisted content is reviewed and verified by our journalists
          and editors to maintain:
        </p>
        <ul>
          <li>
            <p>Accuracy</p>
          </li>
          <li>
            <p>Neutrality</p>
          </li>
          <li>
            <p>Editorial integrity</p>
          </li>
        </ul>
        <h3>Local Focus</h3>
        <p>
          Even with AI support, every article includes original local context
          for Bolton, verified statements from local authorities, and background
          information relevant to the community.
        </p>
        <h2>How We Use AI</h2>
        <p>Allowed Uses (with human verification):</p>
        <ul>
          <li>
            <p>Research and background information</p>
          </li>
          <li>
            <p>Structuring article drafts</p>
          </li>
          <li>
            <p>Image, audio, and video enhancements</p>
          </li>
          <li>
            <p>Data analysis, translation, and transcription</p>
          </li>
        </ul>
        <p>Prohibited Uses:</p>
        <ul>
          <li>
            <p>Writing or editing news stories without human review</p>
          </li>
          <li>
            <p>Creating lifelike images or videos of real people</p>
          </li>
          <li>
            <p>Unverified fact-checking</p>
          </li>
          <li>
            <p>Handling sensitive or confidential information</p>
          </li>
        </ul>
        <h2>Contributor Guidelines</h2>
        <p>
          All contributors must disclose any AI use in their submissions.
          Editors may request original drafts and review AI-assisted work to
          ensure it meets Bolton Today’s standards.
        </p>
        <h2>Labelling and Accountability</h2>
        <ul>
          <li>
            <p>AI-generated or assisted content is clearly labelled</p>
          </li>
          <li>
            <p>Editorial oversight is always documented</p>
          </li>
          <li>
            <p>Sponsored content using AI is disclosed</p>
          </li>
        </ul>
        <p>
          A dedicated internal team manages AI usage, training, and policy
          updates to maintain ethical, human-led journalism.
        </p>
        <p>
          Bolton Today is committed to using AI responsibly, enhancing reporting
          while maintaining the trust of the Bolton community.
        </p>
      </main>
      {/* EndFragment */}
    </>
  );
};

export default AIPolicy;
