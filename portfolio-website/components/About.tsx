import Image from "next/image";
import { Download } from "lucide-react";
import { aboutConfig } from "@/lib/config";

export function About() {
  return (
    <section className="bg-black py-24">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-white">{aboutConfig.title}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {aboutConfig.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-fuchsia-500/20 rounded-full blur-3xl" />
            <Image
              src="/profile.png"
              alt="About Me"
              width={800}
              height={600}
              className="relative rounded-2xl w-full max-w-[600px] mx-auto"
              priority
            />
          </div>

          <div className="space-y-6">
            <p className="text-gray-400 leading-relaxed">
              {aboutConfig.description.split("\n").map((line, index) => (
                <span key={index} className="block">
                  {index > 0 && <br />}
                  {line}
                  {index > aboutConfig.description.split("\n").length - 1 && <br />}
                </span>
              ))}
            </p>

            <a
              href={aboutConfig.cvLink}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-6 py-3 rounded-md font-medium hover:from-purple-700 hover:to-fuchsia-600 transition-all duration-200 shadow-[0_0_15px] shadow-purple-500/25"
            >
              <Download className="w-5 h-5" />
              Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
