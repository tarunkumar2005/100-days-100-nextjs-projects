import Image from "next/image"
import { motion } from "framer-motion"

interface ProjectCardProps {
  title: string
  image: string
  categories: string[]
  onClick: () => void
}

export function ProjectCard({ title, image, categories, onClick }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          src={image}
          alt={title}
          width={800}
          height={600}
          className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 p-6 space-y-2">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-gray-300 text-sm">
              {categories.join(" • ")}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}