"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { ProjectCard } from "./project/project-card"
import { ProjectModal } from "./project/project-modal"
import { projectsConfig } from "@/lib/config"
import { useInView } from "react-intersection-observer"

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleProjects, setVisibleProjects] = useState(3)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const { ref, inView } = useInView()

  // Filter projects based on category and search query
  const filteredProjects = projectsConfig.projects.filter((project) => {
    const matchesCategory =
      selectedCategory === "all" || project.categories.includes(selectedCategory)
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Load more projects when the user scrolls
  useEffect(() => {
    if (inView) {
      setVisibleProjects((prev) => Math.min(prev + 3, filteredProjects.length))
    }
  }, [inView, filteredProjects.length])

  return (
    <section className="bg-black py-24">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-white">
            {projectsConfig.title}
          </h2>
        </div>

        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search projects..."
              className="pl-10 bg-gray-900 border-gray-800 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {projectsConfig.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white"
                  : "bg-gray-900 text-gray-400 hover:text-white"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredProjects.slice(0, visibleProjects).map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                image={project.image}
                categories={project.categories}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {visibleProjects < filteredProjects.length && (
          <div
            ref={ref}
            className="flex justify-center mt-12"
          >
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            isOpen={!!selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </section>
  )
}