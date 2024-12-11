import { servicesConfig } from "@/lib/config";

export function Services() {
  return (
    <section className="bg-black py-24">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-white">
            {servicesConfig.title}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {servicesConfig.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesConfig.services.map((service, index) => (
            <div
              key={index}
              className="group bg-[#111111] rounded-2xl p-8 transition-all duration-300 hover:bg-[#161616] hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] cursor-pointer"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <service.icon className="text-4xl text-purple-500 group-hover:text-fuchsia-500 transition-colors duration-300" />
                <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                  {service.title}
                </h3>
                <p className="text-gray-400">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
