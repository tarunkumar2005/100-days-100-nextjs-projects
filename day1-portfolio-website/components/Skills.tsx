import { skillsConfig } from "@/lib/config";

function SkillCard({ icon, name }: { icon: string; name: string }) {
  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-[#111111] rounded-xl shadow-lg hover:bg-[#161616] transition-all duration-300">
      {/* Icon */}
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white text-4xl">
        <span>{icon}</span>
      </div>
      {/* Name */}
      <p className="text-lg font-semibold text-gray-300">{name}</p>
    </div>
  );
}

export function Skills() {
  return (
    <section className="bg-black py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {skillsConfig.skills.map((skill, index) => (
            <SkillCard key={index} icon={skill.icon} name={skill.name} />
          ))}
        </div>
      </div>
    </section>
  );
}