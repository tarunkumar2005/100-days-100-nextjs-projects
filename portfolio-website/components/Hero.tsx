import Image from "next/image"
import { siteConfig } from "@/lib/config"

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-black pt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="w-full lg:w-1/2 space-y-12">
            <div className="space-y-4">
              <p className="text-gray-400 text-lg">Hi I am</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {siteConfig.name}
              </h1>
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                {siteConfig.role}
              </p>
            </div>

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

            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-purple-600 to-fuchsia-500 px-8 py-3 rounded-md text-white font-medium hover:from-purple-700 hover:to-fuchsia-600 transition-all duration-200 shadow-[0_0_15px] shadow-purple-500/25">
                Hire Me
              </button>
              <button className="px-8 py-3 rounded-md text-white font-medium border border-purple-500/50 hover:bg-purple-500/10 transition-all duration-200">
                Download CV
              </button>
            </div>

            <div className="flex items-center">
              {siteConfig.stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`flex-1 ${
                    index !== siteConfig.stats.length - 1
                      ? "border-r border-gray-800"
                      : ""
                  }`}
                >
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-gray-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-fuchsia-500/20 rounded-full blur-3xl" />
            <Image
              src="/profile.png"
              alt="Profile Image"
              width={600}
              height={600}
              priority
              className="relative rounded-full w-full max-w-[600px] mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}