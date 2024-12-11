"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function Navbar() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string): void => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          <Link 
            href="/" 
            className="text-xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent"
          >
            {siteConfig.name}
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={`#${item.href}`} // Accessibility
                onClick={(e) => handleClick(e, item.href)} // Smooth scroll
                className="text-gray-300 hover:text-purple-500 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button className="bg-gradient-to-r from-purple-600 to-fuchsia-500 px-6 py-2 rounded-md text-white font-medium hover:from-purple-700 hover:to-fuchsia-600 transition-all duration-200 shadow-[0_0_15px] shadow-purple-500/25">
            Hire Me
          </button>
        </div>
      </div>
    </nav>
  );
}