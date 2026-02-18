import React from "react";
import { Metadata } from "next";
import { DOMAIN_URL } from "@/constant/apiUrl";

export const metadata: Metadata = {
  title: "Contact Us | Bolton Today – Connect with Our Newsroom",
  description:
    "Get in touch with Bolton Today. Share your news tips, feedback, advertising enquiries, or partnership requests. We value your input and are committed to serving the Bolton community.",
  alternates: {
    canonical: `${DOMAIN_URL}/contact-us`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const Contact = () => {
  return (
    <main className=" [&_a]:underline [&_a]:font-bold [&_a]:text-head [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold">
      <h1 className="text-black">Contact Us</h1>
      <p>
        At{" "}
        <a
          href="https://boltontoday.co.uk/"
          className="space-x-1 font-semibold"
        >
          Bolton Today
        </a>
        , we believe that strong journalism begins with strong connections to
        the community we serve. We welcome communication from our readers, local
        organisations, and members of the public who want to share stories,
        report issues, or engage with our newsroom.
      </p>
      <p>
        Whether you have a tip about a developing story, a question about our
        reporting, or a request for collaboration, we encourage you to reach out
        to the appropriate team below. Every message is read, and while we may
        not be able to respond to each one individually, your input plays a
        vital role in helping us inform, investigate, and reflect the real voice
        of Bolton.
      </p>
      <h2 className="text-black">News Tips &amp; Editorial Contacts</h2>
      <p>
        Have a story, photo, or lead that our newsroom should know about? We
        welcome verified information, public interest stories, and community
        updates. You can contact our editorial team in full confidence:
      </p>
      <p>
        All sources are treated with discretion, and anonymity can be protected
        where appropriate.
      </p>
      <h2 className="text-black">Advertising &amp; Sponsorship</h2>
      <p>
        Looking to reach a highly engaged local audience? We offer a range of
        advertising opportunities including display ads, sponsored content, and
        custom campaigns for businesses, events, and community service{" "}
        <a href="https://boltontoday.co.uk/contact-us">contact us.</a>
      </p>
      <p>
        Our team will be happy to provide media kits, audience reach data, and
        pricing information.
      </p>
    </main>
  );
};

export default Contact;
