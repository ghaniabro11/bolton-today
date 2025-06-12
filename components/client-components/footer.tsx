"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Facebook } from "./icons/facebook";
import { Linkedin } from "./icons/linkdin";
import { Twitter } from "./icons/twitter";

const Footer = () => {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [insiderOpen, setInsiderOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateView = () => setIsDesktop(mediaQuery.matches);
    updateView();
    mediaQuery.addEventListener("change", updateView);
    return () => mediaQuery.removeEventListener("change", updateView);
  }, []);

  const renderSection = (
    title: string,
    items: { label: string; href: string; external?: boolean }[]
  ) => {
    if (isDesktop) {
      return (
        <div>
          <p className="text-lg font-semibold mb-3">{title}</p>
          <ul className="text-sm text-gray-700 space-y-1 pl-0!">
            {items.map(({ label, href, external }, idx) => (
              <li key={idx} className=" list-none pl-0!">
                <Link
                  href={`/${href}`}
                  // target={external ? "_blank" : "_self"}
                  // rel={external ? "noopener noreferrer" : ""}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    const openStateMap = {
      About: [aboutOpen, setAboutOpen],
      Contact: [contactOpen, setContactOpen],
      "Washington Insider": [insiderOpen, setInsiderOpen],
    } as const;

    const [open, setOpen] = openStateMap[title as keyof typeof openStateMap];

    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full flex justify-between items-center text-lg font-semibold py-2">
          {title}
          <ChevronDown
            className={`w-5 h-5 md:hidden transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          <ul className="text-sm text-gray-700 space-y-1 pl-0!">
            {items.map(({ label, href, external }, idx) => (
              <li key={idx} className=" list-none pl-0!">
                <Link
                  href={`/${href}`}
                  // target={external ? "_blank" : "_self"}
                  // rel={external ? "noopener noreferrer" : ""}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    );
  };
  if (!isOpen) return null;
  return (
    <footer className="bg-white border-t p-6 mt-10 md:p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {renderSection("About", [
          { label: "About Us", href: "about-us" },
          { label: "Code of Ethics", href: "code-of-ethics" },
          { label: "Editorial Policy", href: "editor-policy" },
          { label: "Our Contributors", href: "#" },
          { label: "Privacy Policy", href: "privacy-policy" },
        ])}

        {renderSection("Contact", [
          { label: "Contact Us", href: "contact-us" },
          { label: "Editorial Contact", href: "editorial-contact" },
          { label: "Submit Your Contribution", href: "#" },
          { label: "Advertise With Us", href: "advertise-with-us" },
          { label: "Report Error", href: "report-error" },
        ])}

        {renderSection("Washington Insider", [
          {
            label: "Capitol Hill Politics News",
            href: "capitol-hill-politics/",
            external: true,
          },
          {
            label: "The Whitehouse News",
            href: "the-white-house/",
            external: true,
          },
          {
            label: "Diplomacy & Foreign Affairs News",
            href: "diplomacy/",
            external: true,
          },
          {
            label: "Security & Defense News",
            href: "security/",
            external: true,
          },
          {
            label: "Business & Finance News",
            href: "business-finance/",
            external: true,
          },
        ])}

        {/* Logo & Socials */}
        <div className="flex flex-col mt-5 items-center gap-4">
          <div className="flex space-x-4 text-gray-600">
            <a
              href="https://www.facebook.com/washingtoninsidermagazine/ "
              aria-label="Facebook"
            >
              <Facebook className="w-7 h-7" />
            </a>
            <a href="https://twitter.com/WashInsiderMag" aria-label="Twitter">
              <Twitter className="w-7 h-7" />
            </a>
            {/*  <a href="#" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a> */}
            <a
              href="https://www.linkedin.com/company/washington-insider-magazine/"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-7 h-7" />
            </a>
          </div>
          <Link href={"/"}>
            <Image
              src="/bolton_logo_blue.svg"
              alt="Site Logo"
              width={300} // Add appropriate width
              height={100}
              className="md:w-[20vw] w-[35vw] "
              priority
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
