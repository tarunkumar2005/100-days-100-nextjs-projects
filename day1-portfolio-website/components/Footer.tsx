"use client";

import Link from "next/link"
import { Mail } from 'lucide-react'
import { siteConfig, footerConfig } from "@/lib/config"

export function Footer() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string): void => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#111111] py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center space-y-12">
          {/* Logo/Name */}
          <Link 
            href="/" 
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent"
          >
            {siteConfig.name}
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-8">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className="text-gray-400 hover:text-purple-500 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {siteConfig.socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-gradient-to-r hover:from-purple-600 hover:to-fuchsia-500 hover:text-white transition-all duration-200"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Contact Info */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-gray-400">
            <a 
              href={`mailto:${footerConfig.email}`}
              className="flex items-center gap-2 hover:text-purple-500 transition-colors duration-200"
            >
              <Mail className="w-5 h-5" />
              {footerConfig.email}
            </a>
          </div>

          {/* Credit */}
          <div className="text-gray-500 text-sm">
            Designed by {siteConfig.name} {footerConfig.credit}
          </div>
        </div>
      </div>
    </footer>
  )
}