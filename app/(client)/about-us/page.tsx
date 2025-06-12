import { DOMAIN_URL } from "@/constant/apiUrl";
import { generateMetadata } from "@/lib/generateMetadata";
import React from "react";
export const metadata = generateMetadata({
  title: "About Us",
  description:
    "Washington Insider Magazine's is an online newspaper based in Washington, DC. washington Insider publishes unique and independent coverage on transatlantic relations",
  keywords: [],
  canonical: `${DOMAIN_URL}/about-us`,
});
const About = () => {
  const teamMembers = [
    {
      name: "Ryan Day",
      description:
        "Ryan Day holds a Master's degree in Balkan, Eurasian, and Central European studies from Charles University in Prague. He holds a Bachelor's degree in International Studies and Russian Area Studies from Hope College in Holland, Michigan. When not working, Ryan enjoys snowboarding in the Colorado Rocky Mountains and international travel. He has visited 24 countries to date.",
    },
    {
      name: "Claire Healy",
      description:
        "Claire Healy holds a degree in political science from the University of Massachusetts Amherst. She is fluent in Arabic and Spanish, and has lived in Amman, Jordan and Havana, Cuba. She is the founder and Editor in Chief of The Open magazine, promoting global human rights.",
    },
    {
      name: "Arnel Husrefovic",
      description:
        "Arnel Husrefovic is from South Burlington, Vermont. His family immigrated from Bosnia Herzegovina. He is currently studying Political Science and Legal Studies at American University in Washington, DC.",
    },
    {
      name: "Lindsay Morris",
      description:
        "Lindsay Morris is a creative producer and strategist. She moved from Australia to New York in 2013, became Director of Engagement at Girl Rising, and later founded her own consulting firm. She's also a co-founder of Frack Theatre.",
    },
    {
      name: "Mark Raczkiewycz",
      description:
        "Mark Raczkiewycz is an award-winning journalist with over 15 years of international experience, reporting from Ukraine, Brussels, Sweden, and Chicago. He's fluent in Russian and Ukrainian and contributes to top global outlets.",
    },
    {
      name: "Ryan Scherba",
      description:
        "Ryan Scherba served in the U.S. Peace Corps in Kosovo and is now Director of Balkan Insider. He writes on U.S. foreign policy in Europe. He holds degrees from Marquette University and the Institute of World Politics.",
    },
    {
      name: "Maia Comeau",
      description:
        "Maia Comeau is a public affairs leader with over 20 years of experience. She founded the Congressional Affairs department and Lugar Institute at the German Marshall Fund, and is a Presidential Leadership Scholar.",
    },
  ];

  return (
    <section className="bg-white text-gray-800 py-12 px-4 max-w-5xl mx-auto">
      <header className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2 font-playfair-display">
          Washington Insider Magazines
        </h2>
        <p className="text-center text-gray-700 max-w-3xl mx-auto">
          Washington Insider Magazines is an online newspaper based in
          Washington, DC, providing unique, independent coverage on
          transatlantic relations from a Washington perspective. We cover
          policymaking, politics, and business impacting the transatlantic
          relationship.
        </p>
      </header>

      <div className="space-y-8">
        {teamMembers.map(({ name, description }) => (
          <article key={name}>
            <h3 className="text-xl font-semibold text-gray-700 font-playfair-display">{name}</h3>
            <p className="text-base leading-relaxed text-gray-700">
              {description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <h3 className="text-xl font-semibold text-gray-700 font-playfair-display">
          Advertising and Editorial Inquiries
        </h3>
        <p className="text-base text-gray-700">editor@washingtoninsider.net</p>
      </div>
    </section>
  );
};

export default About;
