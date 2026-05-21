// components/Footer.tsx
import Link from "next/link";
import { Facebook } from "./icons/facebook";
import { Linkedin } from "./icons/linkdin";
import { Twitter } from "./icons/twitter";
import { socialMediaLinks } from "@/constant/apiUrl";
import { Instagram } from "./icons/instagram";

const footerData = [
  {
    title: "About",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Editorial Policy", href: "/editorial-policy" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Code of Ethics", href: "/code-of-ethics" },
      { label: "Contact Us", href: "/contact-us" },
      { label: "Bolton AI Policy", href: "/ai-policy" },
      { label: "Correction Policy", href: "/correction-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Editorial Guidelines", href: "/editorial-guidelines" },
      { label: "Privacy Policy for Journalism Interns", href: "/digital-privacy-policy-for-journalism-interns" },
    ],
  },
  {
    title: "News Categories",
    links: [
      { label: "Bolton Town Centre News", href: "/bolton-town-centre" },
      { label: "People of Bolton", href: "/people-of-bolton" },
      { label: "Bolton Council News", href: "/bolton-council" },
      { label: "Politics News", href: "/politics" },
      { label: "Crime News", href: "/crime" },
      { label: "Sports News", href: "/sports" },
    ],
  },
  {
    title: "People",
    links: [
      { label: "Journalists", href: "/journalists" },
      { label: "Contributors", href: "/contributors" },
      { label: "Politicians", href: "/politicians" },
    ],
  },
  {
    title: "Explore Bolton",
    links: [
      { label: "Things to Do", href: "/things-to-do" },
      { label: "Local Businesses", href: "/local-businesses" },
      { label: "History of Bolton", href: "/history-of-bolton" },
      { label: "Community Projects", href: "/community-projects" },
      { label: "Public Services", href: "/public-services" },
    ],
  },
  {
    title: "Multimedia",
    links: [
      { label: "Photo Galleries", href: "/photo-galleries" },
      { label: "Videos", href: "/videos" },
      { label: "Podcasts", href: "/podcasts" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="  mt-12 font-inter">
      <div className="flex items-center justify-center w-full mt-4">
        <div className="flex-grow h-px bg-gray" />
        <div className="flex space-x-4 text-gray-600 mx-2">
          <div className="uppercase font-bold text-lg">Follow Us</div>
          <a href={socialMediaLinks[0]} aria-label="Facebook">
            <Facebook className="w-7 h-7" />
          </a>
          <a href={socialMediaLinks[4]} aria-label="Twitter">
            <Twitter className="w-7 h-7" />
          </a>
           <a href={socialMediaLinks[1]} aria-label="Instagram">
              <Instagram className="w-7 h-7" />
            </a>
          <a href={socialMediaLinks[3]} aria-label="LinkedIn">
            <Linkedin className="w-7 h-7" />
          </a>
        </div>

        <div className="flex-grow h-px bg-gray" />
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {footerData.map((section, index) => (
          <div key={index}>
            <h3 className="font-semibold text-lg mb-2 text-head">
              {section.title}
            </h3>
            <ul className="space-y-1 text-sm list-none pl-0!">
              {section.links.map((link, i) => (
                <li key={i} className="pl-0!">
                  <Link href={link.href} className="hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t-2 border-t-gray text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Bolton Today. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
