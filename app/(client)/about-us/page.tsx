import React from "react";
import { Metadata } from "next";
import { DOMAIN_URL } from "@/constant/apiUrl";

export const metadata: Metadata = {
  title: "About Us | Bolton Today – Local News, Community & Culture",
  description:
    "Learn about Bolton Today, your trusted source for local news, community stories, and cultural events in Bolton. Discover our mission, vision, and how we serve the people of Bolton with independent, community-driven journalism.",
  alternates: {
    canonical: `${DOMAIN_URL}/about-us`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return (
    <div>
      <h1>About Us</h1>
      <p>Welcome to Bolton Today – Your Voice, Your Stories, Your Town.</p>
      <p>
        At
        <a href="https://boltontoday.co.uk/">Bolton Today</a>, we are dedicated
        to delivering timely, trustworthy, and engaging news that matters to the
        people of Bolton. From breaking headlines and in-depth political
        coverage to uplifting community stories and vibrant cultural events, our
        mission is simple: to inform, inspire, and reflect the spirit of Bolton.
      </p>
      <h2>What We Cover</h2>
      <p>
        We offer comprehensive coverage of everything happening in and around
        our town, including:
      </p>
      <ul>
        <li>
          Local News &amp; Politics – Stay informed about council decisions,
          community debates, and the latest developments in public services.
        </li>
        <li>
          Town Centre Regeneration – Follow major updates on infrastructure,
          safety improvements, housing, and economic investments shaping
          Bolton’s future.
        </li>
        <li>
          Crime &amp; Safety – We report responsibly on crime, policing efforts,
          and community-led safety initiatives.
        </li>
        <li>
          Sports &amp; Entertainment – Celebrate Bolton’s sporting achievements
          and cultural life, from grassroots football to the Octagon Theatre.
        </li>
        <li>
          Community &amp; People – Meet the inspiring individuals, everyday
          heroes, and diverse voices that give Bolton its unique identity.
        </li>
        <li>
          History &amp; Heritage – Discover the stories and milestones that have
          defined Bolton through the years.
        </li>
      </ul>
      <h2>Why We Exist</h2>
      <p>
        We believe local journalism plays a vital role in a healthy, connected
        community. Bolton Today was launched to ensure that the people of Bolton
        have access to accurate, relevant, and independent local reporting—free
        from sensationalism and corporate influence.
      </p>
      <p>
        We’re not just reporting the news. We’re building a community-driven
        platform where residents can feel heard, represented, and proud of their
        town.
      </p>
      <h2>Our Vision</h2>
      <ul>
        <li>
          To promote civic engagement by shedding light on local governance,
          public opinion, and grassroots initiatives.
        </li>
        <li>
          To strengthen community bonds by celebrating diversity, resilience,
          and positive change.
        </li>
        <li>
          To serve as a digital archive of Bolton’s evolving history, from
          regeneration projects to cultural milestones.
        </li>
      </ul>
      <h2>Join the Conversation</h2>
      <p>
        Whether you're a lifelong Boltonian, a recent resident, or just passing
        through—this is your space. We welcome story suggestions, local tips,
        opinion pieces, and collaborations with community groups and
        individuals.
      </p>
      Have a story to share or a question about our coverage?
      <br />
      Reach out via our Contact Page or email us directly at:{" "}
      <a href="mailto:contact@boltontoday.co.uk" className="font-semibold">
        contact@boltontoday.co.uk
      </a>
    </div>
  );
};

export default page;
