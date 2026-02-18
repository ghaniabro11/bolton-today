import { DOMAIN_URL } from "@/constant/apiUrl";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bolton Today Correction Policy",
  description:
    "Bolton Today is committed to accurate reporting. Learn how we correct errors and maintain transparency with our readers.",
  alternates: {
    canonical: `${DOMAIN_URL}/correction-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const CorrectionPolicy = () => {
  return (
    <>
      {/* StartFragment */}
      <main className=" [&_a]:underline [&_a]:font-bold [&_a]:text-head [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold">
        <h1>Correction Policy</h1>
        <p>Last Updated: February 17, 2026</p>
        <p>
          At <a href="https://boltontoday.co.uk/">Bolton Today</a>, we take the
          accuracy and reliability of our reporting very seriously. While we
          strive to ensure every story is thoroughly checked and factual,
          mistakes can occasionally occur. This Correction Policy explains how
          we address errors and maintain transparency with our readers.
        </p>
        <h2>Commitment to Accuracy</h2>
        <p>
          Bolton Today is committed to publishing news that is both accurate and
          fair. When errors are identified, we correct them promptly and
          clearly, preserving the trust of our audience. Our editorial team
          reviews reported mistakes carefully and ensures that corrections
          reflect verified information.
        </p>
        <h2>How We Correct Mistakes</h2>
        <p>
          If an error is discovered, the editorial team first verifies the
          correct information from reliable sources. Once confirmed, a
          correction notice is added to the article or a designated corrections
          section, clearly stating the nature of the error and the date it was
          amended. For example:
        </p>
        <p>
          Correction (February 18, 2026): An earlier version of this article
          misstated the date of the council meeting. The correct date is
          February 17, 2026.
        </p>
        <p>
          This approach ensures that readers are aware of the change without
          altering the overall context of the original reporting.
        </p>
        <h2>Reporting an Error</h2>
        <p>
          Readers who notice inaccuracies are encouraged to contact the
          editorial team directly. Providing the article link and a description
          of the issue helps us investigate and resolve the matter efficiently.
          Corrections are applied to all types of content, including written
          articles, images, and multimedia features, regardless of whether the
          material was produced with AI assistance or entirely by a journalist.
        </p>
        <h2>Editorial Responsibility</h2>
        <p>
          Our editorial team is responsible for monitoring published content,
          addressing errors, and maintaining a transparent record of
          corrections. We believe that acknowledging mistakes openly strengthens
          the credibility of our reporting and reinforces our commitment to the
          Bolton community.
        </p>
      </main>
      {/* EndFragment */}
    </>
  );
};

export default CorrectionPolicy;
