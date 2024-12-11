import { Linkedin, Github, Twitter, Server, Code, Paintbrush, CheckCircle, Layout } from 'lucide-react'

export const siteConfig = {
  name: "Tarun Kumar",
  role: "Full-Stack Developer",
  navItems: [
    { label: "Home", href: "hero" },
    { label: "Services", href: "services" },
    { label: "About me", href: "about" },
    { label: "Skills", href: "skills" },
    { label: "Portfolio", href: "portfolio" },
    { label: "Contact me", href: "contact" },
  ],
  socialLinks: [
    { icon: Github, href: "https://github.com/tarunkumar2005", label: "Github" },
    { icon: Linkedin, href: "https://linkedin.com/tarunkumar8278", label: "LinkedIn" },
    { icon: Twitter, href: "https://x.com/Tarun_Kumar8278", label: "X" },
  ],
  stats: [
    { value: "2+", label: "Experiences" },
    { value: "10+", label: "Project done" },
    { value: "10+", label: "Happy Clients" },
  ]
}

export const servicesConfig = {
  title: "Services",
  subtitle: "Empowering businesses with comprehensive web solutions and cutting-edge technologies.",
  services: [
    {
      icon: Code,
      title: "Web Development",
      description: "Building responsive, scalable, and feature-rich websites using modern frameworks and technologies like React.js, Next.js, and more."
    },
    {
      icon: Paintbrush,
      title: "Web Design",
      description: "Designing user-centric interfaces that blend aesthetics and functionality to deliver exceptional user experiences."
    },
    {
      icon: Server,
      title: "Backend Development",
      description: "Developing secure and scalable backend architectures with Express.js, MongoDB, and RESTful APIs."
    },
    {
      icon: CheckCircle,
      title: "Web Testing",
      description: "Ensuring flawless website performance through rigorous testing and debugging processes."
    },
    {
      icon: Server,
      title: "API Development",
      description: "Creating and integrating efficient REST APIs tailored to your application's needs."
    },
    {
      icon: Layout,
      title: "Figma to Website",
      description: "Transforming Figma designs into fully functional, pixel-perfect websites with seamless interactions."
    }
  ]
};

export const aboutConfig = {
  title: "About Me",
  subtitle: "Passionate Full-Stack Developer | Lifelong Learner",
  description: `I am Tarun Kumar, a dedicated software developer specializing in creating efficient and scalable web applications. With over 2 years of hands-on experience in web development, I have honed my expertise in technologies such as HTML, CSS, JavaScript, Tailwind CSS, React.js, Next.js, Express.js, MongoDB, and TypeScript. I excel in developing REST APIs, handling JSON data, and implementing modern web architectures.\nCurrently, I am broadening my skillset by learning cutting-edge technologies such as PostgreSQL, better authentication systems, cloud-based development tools like Arcjet, and mobile app development with React Native. I’m also delving into large language models (e.g., ChatGPT, Gemini) to enhance data-driven applications through intelligent API integrations.\nThroughout my journey, I have successfully completed personal projects and freelance projects, sharpening my technical acumen and problem-solving abilities. I am also working on a personal platform, *Creatique*, aimed at gaining deeper insights into platform development and user-centric design.\nAs a student and an avid learner, I am committed to pushing the boundaries of technology, continuously refining my skills, and embracing challenges that drive innovation.`,
  cvLink: "https://linkedin.com/in/tarunkumar8278",
};

export const skillsConfig = {
  skills: [
    {
      name: "React.js",
      icon: "⚛️" // React logo representation
    },
    {
      name: "Next.js",
      icon: "⬛" // Placeholder, use custom SVG for Next.js logo
    },
    {
      name: "JavaScript",
      icon: "🟨" // Yellow square for JS
    },
    {
      name: "TypeScript",
      icon: "🟦" // Blue square for TS
    },
    {
      name: "Tailwind CSS",
      icon: "🌬️" // Wind emoji for Tailwind
    },
    {
      name: "MongoDB",
      icon: "🍃" // Leaf emoji for MongoDB
    },
    {
      name: "Express.js",
      icon: "🚂" // Train emoji, represents "Express"
    },
    {
      name: "Figma",
      icon: "🎨" // Palette for Figma
    },
    {
      name: "React Native",
      icon: "📱" // Mobile emoji for React Native
    }
  ]
};

export const projectsConfig = {
  title: "Portfolio",
  categories: [
    { id: "all", label: "All" },
    { id: "website", label: "Web Development" },
    { id: "frontend", label: "Frontend Development" },
    { id: "uiux", label: "UI/UX Design" },
    { id: "api", label: "API & Backend" }
  ],
  projects: [
    {
      id: 1,
      title: "Creatique Platform",
      description: "A platform for creators to collaborate and showcase their projects. This personal project highlights advanced full-stack development skills.",
      image: "/project.jpg",
      categories: ["website", "api", "frontend"],
      tags: ["React.js", "Next.js", "MongoDB", "Express.js"],
      demoUrl: "https://creatique-demo.com",
      githubUrl: "https://github.com/tarunkumar2005/creatique",
      features: [
        "User authentication",
        "Project collaboration tools",
        "Real-time updates",
        "Analytics dashboard"
      ]
    },
    {
      id: 2,
      title: "Calmora - Emotional Support Application",
      description: "An application providing emotional support through AI-powered conversational bots to help users feel better. This project combines frontend and backend development.",
      image: "/project.jpg",
      categories: ["website", "api"],
      tags: ["React.js", "Node.js", "MongoDB", "Express.js"],
      demoUrl: "https://calmora-demo.com",
      githubUrl: "https://github.com/tarunkumar2005/calmora",
      features: [
        "Conversational AI chatbot",
        "User-friendly interface",
        "Secure user data handling",
        "Real-time responses"
      ]
    },
    {
      id: 3,
      title: "Bria Salon Website",
      description: "A freelance project to develop a salon website with a focus on booking management and showcasing services. Fully responsive and visually appealing.",
      image: "/project.jpg",
      categories: ["website", "uiux"],
      tags: ["HTML", "CSS", "JavaScript", "Bootstrap"],
      demoUrl: "https://bria-salon-demo.com",
      githubUrl: "https://github.com/tarunkumar2005/bria-salon",
      features: [
        "Service catalog",
        "Appointment booking system",
        "Responsive design",
        "SEO optimized"
      ]
    },
    {
      id: 4,
      title: "Senpai Store - E-commerce Website",
      description: "A sleek and modern e-commerce website frontend featuring an amazing UI design. Focused on the shopping experience and user engagement.",
      image: "/project.jpg",
      categories: ["frontend", "uiux"],
      tags: ["React.js", "Tailwind CSS"],
      demoUrl: "https://senpai-store-demo.com",
      githubUrl: "https://github.com/tarunkumar2005/senpai-store",
      features: [
        "Responsive and modern UI",
        "Product filtering and search",
        "Interactive product listings",
        "Mobile-friendly design"
      ]
    },
    {
      id: 5,
      title: "Animated Product Website (WebGL)",
      description: "A stunning animated product website built using WebGL to replicate a modern product showcase. This clone project highlights advanced visual design skills.",
      image: "/project.jpg",
      categories: ["uiux", "frontend"],
      tags: ["Three.js", "JavaScript", "WebGL"],
      demoUrl: "https://animated-product-demo.com",
      githubUrl: "https://github.com/tarunkumar2005/animated-product",
      features: [
        "Interactive 3D animations",
        "Smooth transitions",
        "Visually appealing design",
        "High performance"
      ]
    }
  ]
};

export const contactConfig = {
  title: "Contact me",
  subtitle: "Cultivating Connections: Reach Out And Connect With Me",
  services: [
    "Have a project in mind?",
    "Need a consultation?",
    "Want to collaborate on a project?",
    "Just want to say hi?",
  ]
}

export const footerConfig = {
  email: "tarunkumar6258278@gmail.com",
  credit: "Full-Stack Developer",
}