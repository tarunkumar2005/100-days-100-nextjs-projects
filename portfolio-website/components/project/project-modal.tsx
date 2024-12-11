import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Globe } from 'lucide-react'
import Image from "next/image"

interface ProjectModalProps {
  project: {
    title: string
    description: string
    image: string
    categories: string[]
    tags: string[]
    demoUrl: string
    githubUrl: string
    features: string[]
  }
  isOpen: boolean
  onClose: () => void
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-black/95 border-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col md:flex-row gap-6 p-4">
          <div className="w-full md:w-1/2">
            <Image
              src={project.image}
              alt={project.title}
              width={800}
              height={600}
              className="w-full rounded-lg object-cover"
            />
          </div>
          
          <div className="w-full md:w-1/2 space-y-4">
            <DialogTitle className="text-2xl font-bold text-white">{project.title}</DialogTitle>
            
            <p className="text-gray-400">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Key Features</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-1">
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4">
              <Button
                className="bg-gradient-to-r from-purple-600 to-fuchsia-500"
                onClick={() => window.open(project.demoUrl, '_blank')}
              >
                <Globe className="w-4 h-4 mr-2" />
                Live Demo
              </Button>
              <Button
                variant="outline"
                className="border-purple-500/50"
                onClick={() => window.open(project.githubUrl, '_blank')}
              >
                <Github className="w-4 h-4 mr-2" />
                View Code
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}