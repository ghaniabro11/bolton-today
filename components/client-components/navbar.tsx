"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "../ui/button";

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
    label: "Local News",
    // link: "/local-news",
    dropdown: [
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
    // href: "/sports-news",
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
    className="absolute left-0 mt-5 min-w-60 rounded-none  bg-[#C1D8FC]  shadow-lg  z-50 "
  >
    <ul className="py-2     list-none pl-0!">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="block px-4 py-2 w-full  text-white hover:text-btn"
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

  return (
    <nav className="bg-[#052962] border-b   uppercase text-white font-semibold   border-gray-200 px-10 md:py-3 shadow-md">
      <div className=" flex justify-between items-center relative ">
        <Link href="/" className="inline">
          <Image
            src="/bolton_logo.svg"
            alt="header-image"
            width={300} // Add appropriate width
            height={100}
            className="w-46 "
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
        <div className="cursor-pointer hidden md:block">
          <Search />
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
                    className="flex items-center justify-between  font-medium   py-2 cursor-pointer"
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
                          openMobileDropdown === link?.label ? "rotate-180" : ""
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
                            className="block   hover:text-btn text-white py-1"
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
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
