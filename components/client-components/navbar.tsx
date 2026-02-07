"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";

// const navLinks = [
//   { label: "Home", href: "/" },
//   // {
//   //   label: "About",
//   //   dropdown: [
//   //     { label: "Company", href: "/about/company" },
//   //     { label: "Team", href: "/about/team" },
//   //     { label: "Careers", href: "/about/careers" },
//   //   ],
//   // },
//   { label: "Contact", href: "/contact" },
// ];

const navLinks = [
  {
    label: "Bolton News",
    href: "/bolton",
    dropdown: [
      { label: "Bolton News", href: "/bolton" },
      { label: "Astley Bridge News", href: "/astley-bridge" },
      { label: "Westhoughton News", href: "/westhoughton" },
      { label: "Horwich News", href: "/horwich" },
      { label: "Blackrod News", href: "/blackrod" },
      { label: "Farnworth News", href: "/farnworth" },
      { label: "Kearsley News", href: "/kearsley" },
      { label: "Little Lever News", href: "/little-lever" },
    ],
  },
  { label: "Bolton Council News", href: "/bolton-council" },
  { label: "Politics News", href: "/politics" },
  { label: "Crime News", href: "/crime" },
  {
    label: "Sports News",
    href: "/sports",
    dropdown: [
      { label: "Bolton Wanderers", href: "/sports/wanderers" },
      { label: "Football", href: "/sports/football" },
      { label: "Cricket", href: "/sports/cricket" },
      { label: "Boxing News", href: "/sports/boxing" },
    ],
  },
];
const DropdownMenu = ({
  items,
}: {
  items: { label: string; href: string }[];
}) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.2 }}
    className="absolute left-0 mt-5 min-w-60 rounded-none  bg-white border border-head/50  shadow-lg  z-50 "
  >
    <ul className="list-none pl-0!">
      {items.map((item) => (
        <li key={item.href} className="border-b border-b-btn ml-6">
          <Link
            href={item.href}
            className="block  py-2 w-full  text-head hover:text-btn "
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </motion.div>
);

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null
  );
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = () => {
    window.location.href = `/?s=${searchQuery}`;
  };

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 100);
  };

  const toggleMobileDropdown = (label: string) => {
    setOpenMobileDropdown((prev) => (prev === label ? null : label));
  };
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SiteNavigationElement",
          name: "Main Navigation",
          url: "https://boltontoday.co.uk",
          about: "Navigation links for Bolton Today News website",
          hasPart: navLinks.flatMap((category) => {
            const links = [];

            if (category.href) {
              links.push({
                "@type": "SiteNavigationElement",
                name: category.label,
                url: `https://boltontoday.co.uk${category.href}`,
              });
            }

            const childLinks =
              category.dropdown?.map((child) => ({
                "@type": "SiteNavigationElement",
                name: child.label,
                url: `https://boltontoday.co.uk${child.href}`,
              })) || [];

            return [...links, ...childLinks];
          }),
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsMediaOrganization",
          name: "Bolton Today News",
          url: "https://boltontoday.co.uk",
          logo: {
            "@type": "ImageObject",
            url: "https://boltontoday.co.uk/bolton_logo.svg",
            width: 600,
            height: 60,
          },
          sameAs: [
            "https://facebook.com",
            "https://twitter.com",
            "https://www.linkedin.com",
          ],
          foundingDate: "2021-01-01",
          founders: [
            {
              "@type": "Person",
              name: "Founder Name",
            },
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "info@boltontoday.co.uk",
            url: "https://boltontoday.co.uk/contact-us",
          },
          publishingPrinciples: "https://boltontoday.co.uk/code-of-ethics",
        })}
      </script>
      <nav className="bg-[#052962] border-b z-[60] relative  uppercase text-white font-semibold   border-gray-200 md:px-20 pr-4  shadow-md">
        <div className=" flex justify-between items-center relative ">
          <Link href="/" className="inline">
            <Image
              src="/bolton_logo.svg"
              alt="header-image"
              width={300} // Add appropriate width
              height={100}
              className="md:h-18 h-12 "
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link: any, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() =>
                  link?.dropdown && handleMouseEnter(link?.label)
                }
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={link?.href || "#"}
                  className={`group flex items-center gap-1 px-3 py-2 rounded-md transition no-underline ${
                    pathname === link?.href ? "text-btn" : ""
                  }`}
                >
                  <span className="hover:text-btn text-white">
                    {link?.label}
                  </span>
                  {link?.dropdown && (
                    <ChevronDown
                      className={`group-hover:text-btn text-white transition-all ${
                        activeDropdown === link?.label ? "-rotate-90" : ""
                      }`}
                      size={16}
                    />
                  )}
                </Link>
                <AnimatePresence>
                  {activeDropdown === link?.label && link?.dropdown && (
                    <DropdownMenu items={link?.dropdown} />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <div
            className="cursor-pointer hidden md:block"
            onClick={() =>
              showSearch ? setShowSearch(false) : setShowSearch(true)
            }
          >
            {showSearch ? <X /> : <Search />}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-700 py-5"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={28} className="text-white cursor-pointer" />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-head   z-50 flex flex-col p-6 overflow-y-auto md:hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <Image
                  src="/bolton_logo.svg"
                  alt="header-image"
                  width={300} // Add appropriate width
                  height={100}
                  className="w-48 "
                  priority
                />
                <button onClick={() => setMobileOpen(false)}>
                  <X size={28} className="text-white cursor-pointer" />
                </button>
              </div>
              <nav className="space-y-4">
                {navLinks.map((link: any) => (
                  <div key={link?.label}>
                    <div
                      className="flex items-center justify-between text-white  font-medium   py-2 cursor-pointer"
                      onClick={() =>
                        link?.dropdown
                          ? toggleMobileDropdown(link?.label)
                          : setMobileOpen(false)
                      }
                    >
                      <Link href={link?.href || "#"}>
                        <span className="hover:text-btn text-white">
                          {link?.label}
                        </span>
                      </Link>
                      {link?.dropdown && (
                        <ChevronDown
                          className={`transform transition-transform duration-200 ${
                            openMobileDropdown === link?.label
                              ? "rotate-180"
                              : ""
                          }`}
                          size={20}
                        />
                      )}
                    </div>

                    {/* Mobile Dropdown */}
                    <AnimatePresence>
                      {openMobileDropdown === link?.label && link?.dropdown && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-4 overflow-hidden"
                        >
                          {link?.dropdown.map((sublink: any) => (
                            <Link
                              key={sublink?.href}
                              href={sublink?.href}
                              className="block   hover:text-btn text-white! py-1"
                              onClick={() => setMobileOpen(false)}
                            >
                              {sublink?.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                <div className=" mx-auto">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search..."
                      className="w-full px-4 py-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="search-news"
                      onChange={(e) => setSearchQuery(e.target.value)} // Add this line
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                    <button
                      onClick={handleSearch} // Add this line
                      className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2"
                    >
                      <Search className="text-gray-500" size={20} />
                    </button>
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <AnimatePresence>
        {showSearch && (
          <motion.div
            ref={searchRef}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-[#052962] py-4 px-10 z-50 absolute"
          >
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="search-news"
                  onChange={(e) => setSearchQuery(e.target.value)} // Add this line
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                <button
                  onClick={handleSearch} // Add this line
                  className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2"
                >
                  <Search className="text-gray-500" size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
