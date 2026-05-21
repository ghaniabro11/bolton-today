import React from "react";
import { Metadata } from "next";
import { DOMAIN_URL } from "@/constant/apiUrl";

export const metadata: Metadata = {
  title: "Bolton Today Journalism Intern Privacy Policy",
  description:
    "Privacy policy for Bolton Today journalism interns covering data collection, security, profile removal requests, and content management rights.",
  alternates: {
    canonical: `${DOMAIN_URL}/digital-privacy-policy-for-journalism-interns`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return (
    <main className=" [&_a]:underline [&_a]:font-bold [&_a]:text-head [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold">
      <h1 className="text-black">
        Our Digital Privacy Policy for Journalism Interns
      </h1>

      <p>
        We at{" "}
        <a href="https://boltontoday.co.uk" className="font-semibold">
          Bolton Today
        </a>{" "}
        (BT) are committed to protecting the privacy and personal data of all
        our journalism interns. This policy outlines how we handle your data
        during and after the onboarding process.
      </p>

      <h2 className="text-black">Data Collected</h2>

      <p>
        During onboarding, we may collect the following information:
      </p>

      <ul>
        <li>Full Name</li>
        <li>
          Contact Information (e.g., email address, phone number)
        </li>
        <li>Social Media Handles/Bio</li>
        <li>Profile Picture</li>
        <li>Writing Samples and Published Articles</li>
        <li>
          Any other information voluntarily shared via the onboarding form
        </li>
      </ul>

      <h2 className="text-black">Use of Information</h2>

      <p>
        Your information will be used for the following purposes:
      </p>

      <ul>
        <li>
          To create and manage your intern profile on our systems
        </li>
        <li>
          To feature your articles or contributions under your byline
        </li>
        <li>
          To credit you properly across our digital platforms (website and
          social media)
        </li>
        <li>
          For internal communication and editorial purposes
        </li>
      </ul>

      <h2 className="text-black">Storage and Security</h2>

      <p>
        All collected information is stored securely in our systems and is only
        accessible to authorised personnel.
      </p>

      <p>
        We do not share, sell, or distribute your personal data to third
        parties without your explicit consent.
      </p>

      <h2 className="text-black">
        Right to Request Deletion or Edits
      </h2>

      <p>
        At any time, you have full control over your personal data and published
        content. You may request the following by contacting our editorial team:
      </p>

      <ul>
        <li>Deletion of your name or social media bio</li>
        <li>Removal of your profile picture</li>
        <li>
          Removal or editing of any published articles credited to you
        </li>
        <li>
          Complete deletion of your profile from our platform
        </li>
      </ul>

      <h2 className="text-black">
        How to Request Changes or Deletion
      </h2>

      <p>
        Simply email us at{" "}
        <a
          href="mailto:info@boltontoday.co.uk"
          className="font-semibold"
        >
          info@boltontoday.co.uk
        </a>{" "}
        with your request.
      </p>

      <p>
        We aim to process all removal or change requests within 5 working days.
      </p>

      <h2 className="text-black">Policy Updates</h2>

      <p>
        This policy may be updated periodically. All interns will be notified of
        significant changes, and the updated version will always be available on
        our official onboarding page.
      </p>
    </main>
  );
};

export default page;