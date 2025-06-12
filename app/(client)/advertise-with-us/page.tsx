import { DOMAIN_URL } from "@/constant/apiUrl";
import { generateMetadata } from "@/lib/generateMetadata";
export const metadata = generateMetadata({
  title: "Advertise With Us",
  description:
    "Advertise with Washington Insider Magazine to reach policy makers and influencers through banners, sponsored content, press releases, and digital magazine ads.",
  keywords: [],
  canonical: `${DOMAIN_URL}/advertise-with-us`,
});
const Contact = () => {
  return (
    <>
      <section className="space-y-10 px-4 py-10 md:px-12 lg:px-24 bg-white text-gray-800 font-sans text-[11pt]">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-playfair-display">
            Advertise With Us
          </h1>
          <p className="text-lg font-medium">
            <strong>
              Reach Decision-Makers, Influencers, and Thought Leaders with
            </strong>
            <span className="block text-gray-700 text-xl mt-1 font-bold">
              Washington Insider Magazine
            </span>
          </p>
        </div>

        <div className="space-y-4 text-[1rem] leading-relaxed">
          <p>
            <a
              href="http://washingtoninsider.net"
              className="text-blue-600 underline font-bold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Washington Insider Magazine
            </a>{" "}
            is a trusted source of political analysis, policy insights, and
            government affairs coverage. With a readership that includes senior
            policymakers, diplomats, corporate leaders, and academics,
            advertising with us gives your brand direct exposure to a highly
            engaged and influential audience.
          </p>

          <p>
            Our commitment to{" "}
            <em className="italic text-gray-700">
              editorial excellence, transparency, and journalistic integrity
            </em>{" "}
            makes us a premier media platform for organizations seeking
            meaningful connections in the political, business, and diplomatic
            spheres.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className=" font-playfair-display text-2xl font-bold text-gray-900 border-b pb-1">
            Why Advertise With Washington Insider?
          </h2>
          <ul className="space-y-6 list-disc ml-6">
            <li>
              <p>
                <strong>✅ Trusted Media Source</strong>
                <br />
                Built on credibility, accuracy, and in-depth reporting—we're the
                go-to platform for domestic and international political
                discourse.
              </p>
            </li>
            <li>
              <p>
                <strong>🎯 Targeted Reach</strong>
                <br />
                Connect with political analysts, policy advisors, think tanks,
                government officials, and C-level executives.
              </p>
            </li>
            <li>
              <p>
                <strong>📣 Multi-Channel Visibility</strong>
                <br />
                From high-traffic homepage banners to sponsored articles and
                digital magazine placements, we amplify your brand.
              </p>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h2 className=" font-playfair-display text-2xl font-bold text-gray-900 border-b pb-1">
            Our Advertising Opportunities
          </h2>

          <div>
            <h3 className=" font-playfair-display text-xl font-semibold text-gray-700 mb-2">
              🌐 Website Advertising
            </h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <strong>Homepage Banner Ads</strong> – Prominently display your
                brand on our highest-traffic page.
              </li>
              <li>
                <strong>Sidebar Banner Ads</strong> – Stay visible across key
                articles and content hubs.
              </li>
              <li>
                <strong>Sponsored Content</strong> – Publish thought leadership
                by your team or ours.
              </li>
              <li>
                <strong>Press Release Distribution</strong> – Professionally
                formatted and widely shared announcements.
              </li>
              <li>
                <strong>Exclusive Interviews</strong> – Showcase your leadership
                in high-impact editorial Q&As.
              </li>
            </ul>
          </div>

          <div>
            <h3 className=" font-playfair-display text-xl font-semibold text-gray-700 mb-2">
              📖 Digital Magazine Advertising
            </h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <strong>Banner Advertisements</strong> – High-visibility ad
                spots throughout our digital editions.
              </li>
              <li>
                <strong>Full-Page Advertisements</strong> – Impactful placements
                delivered to our curated, elite audience.
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className=" font-playfair-display text-2xl font-bold text-gray-900 border-b pb-1">
            Partnership Benefits
          </h2>
          <ul className="list-none space-y-2 text-[1rem]">
            <li>
              ✔️ <strong>Enhanced Brand Authority</strong>
            </li>
            <li>
              ✔️ <strong>SEO-Optimized Content Placement</strong>
            </li>
            <li>
              ✔️ <strong>Direct Audience Engagement</strong>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Contact;
