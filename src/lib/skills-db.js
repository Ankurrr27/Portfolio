import React from "react";
import { 
  SiReact, SiNextdotjs, SiNodedotjs, SiPython, SiTypescript, SiPostgresql, SiDocker, 
  SiAmazonwebservices, SiTailwindcss, SiRedis, SiGraphql, SiMongodb, SiThreedotjs, 
  SiPrisma, SiExpress, SiRedux, SiFramer, SiGo, SiRust, SiFirebase, SiGit, SiLinux, 
  SiNginx, SiCplusplus, SiC, SiJavascript, SiOpenjdk, SiDjango, SiFastapi, SiMysql,
  SiPostman, SiVscodium, SiFigma, SiVite, SiVuedotjs, SiAngular, SiSpringboot,
  SiFlask, SiNestjs, SiGraphql as SiGql, SiCassandra, SiSqlite, SiSwift, SiKotlin,
  SiDart, SiFlutter, SiAndroidstudio, SiXcode, SiVercel, SiNetlify
} from "react-icons/si";
import { Cpu, Globe, Database, Layers } from "lucide-react";

export const SKILLS_DB = {
  // Languages
  "C": { icon: <SiC />, color: "#A8B9CC", category: "lang", about: "The foundation of modern computing and systems programming." },
  "C++": { icon: <SiCplusplus />, color: "#00599C", category: "lang", about: "High-performance programming for systems and game engines." },
  "Python": { icon: <SiPython />, color: "#3776AB", category: "lang", about: "Versatile language for AI, Data Science, and rapid backend development." },
  "Javascript": { icon: <SiJavascript />, color: "#F7DF1E", category: "lang", about: "The engine of the modern web, powering frontend and backend." },
  "TypeScript": { icon: <SiTypescript />, color: "#3178C6", category: "lang", about: "Strongly typed Javascript for scalable application development." },
  "Java": { icon: <SiOpenjdk />, color: "#ED8B00", category: "lang", about: "Enterprise-standard language for cross-platform applications." },
  "Go": { icon: <SiGo />, color: "#00ADD8", category: "lang", about: "Google-developed language optimized for concurrency and scale." },
  "Rust": { icon: <SiRust />, color: "#DEA584", category: "lang", about: "Memory-safe systems programming with high performance." },
  "PHP": { icon: <SiJavascript />, color: "#777BB4", category: "lang", about: "Server-side scripting language for web development." },
  "Swift": { icon: <SiSwift />, color: "#F05138", category: "lang", about: "Apple's language for high-performance iOS and macOS apps." },
  "Kotlin": { icon: <SiKotlin />, color: "#7F52FF", category: "lang", about: "Modern language for Android and multi-platform development." },
  "Dart": { icon: <SiDart />, color: "#0175C2", category: "lang", about: "Client-optimized language for fast apps on any platform." },
  "JS": { icon: <SiJavascript />, color: "#F7DF1E", category: "lang", about: "The engine of the modern web." },
  "TS": { icon: <SiTypescript />, color: "#3178C6", category: "lang", about: "Strongly typed Javascript." },

  // Frontend
  "HTML": { icon: <Layers size={14} />, color: "#E34F26", category: "front", about: "The standard markup language for web document structure." },
  "CSS": { icon: <Layers size={14} />, color: "#1572B6", category: "front", about: "Styling and layout language for modern web design." },
  "React": { icon: <SiReact />, color: "#61DAFB", category: "front", about: "A JavaScript library for building component-based user interfaces." },
  "Next.js": { icon: <SiNextdotjs />, color: "#ffffff", category: "front", about: "The React framework for production-grade web applications." },
  "Tailwind": { icon: <SiTailwindcss />, color: "#06B6D4", category: "front", about: "Utility-first CSS framework for rapid UI development." },
  "Redux": { icon: <SiRedux />, color: "#764ABC", category: "front", about: "Predictable state container for large JavaScript apps." },
  "Vite": { icon: <SiVite />, color: "#646CFF", category: "front", about: "The next generation of high-performance frontend tooling." },
  "Framer Motion": { icon: <SiFramer />, color: "#0055FF", category: "front", about: "Production-ready motion library for React." },
  "Vue": { icon: <SiVuedotjs />, color: "#4FC08D", category: "front", about: "The progressive JavaScript framework for building UIs." },
  "Angular": { icon: <SiAngular />, color: "#DD0031", category: "front", about: "Platform for building mobile and desktop web applications." },
  "Tailwind CSS": { icon: <SiTailwindcss />, color: "#06B6D4", category: "front", about: "Utility-first CSS framework." },
  "Next JS": { icon: <SiNextdotjs />, color: "#ffffff", category: "front", about: "The React framework for production." },
  "Vite React": { icon: <SiVite />, color: "#646CFF", category: "front", about: "Vite-powered React development." },

  // Backend
  "Node.js": { icon: <SiNodedotjs />, color: "#339933", category: "back", about: "JavaScript runtime built on Chrome's V8 for scalable networking." },
  "Express": { icon: <SiExpress />, color: "#ffffff", category: "back", about: "Minimalist web framework for Node.js applications." },
  "Django": { icon: <SiDjango />, color: "#092E20", category: "back", about: "High-level Python web framework for secure, rapid development." },
  "FastAPI": { icon: <SiFastapi />, color: "#05998B", category: "back", about: "Modern, fast web framework for building Python APIs." },
  "Flask": { icon: <SiFlask />, color: "#000000", category: "back", about: "Lightweight WSGI web application framework in Python." },
  "NestJS": { icon: <SiNestjs />, color: "#E0234E", category: "back", about: "Scalable Node.js framework for server-side applications." },
  "GraphQL": { icon: <SiGql />, color: "#E10098", category: "back", about: "Query language for APIs and runtime for fulfilling queries." },
  "Firebase": { icon: <SiFirebase />, color: "#FFCA28", category: "back", about: "Google's platform for building mobile and web applications." },
  "Redis": { icon: <SiRedis />, color: "#DC382D", category: "back", about: "In-memory data structure store used as a database and cache." },
  "Node JS": { icon: <SiNodedotjs />, color: "#339933", category: "back", about: "JavaScript runtime." },
  "CORS": { icon: <Globe size={14} />, color: "#fb923c", category: "back", about: "Cross-Origin Resource Sharing security." },

  // Databases
  "PostgreSQL": { icon: <SiPostgresql />, color: "#4169E1", category: "back", about: "Advanced open-source relational database management system." },
  "MongoDB": { icon: <SiMongodb />, color: "#47A248", category: "back", about: "Source-available cross-platform document-oriented database." },
  "MySQL": { icon: <SiMysql />, color: "#4479A1", category: "back", about: "World's most popular open-source relational database." },
  "Prisma": { icon: <SiPrisma />, color: "#2D3748", category: "back", about: "Next-generation ORM for Node.js and TypeScript." },

  // Tools & DevOps
  "Git": { icon: <SiGit />, color: "#F05032", category: "tools", about: "Distributed version control system for tracking changes." },
  "Docker": { icon: <SiDocker />, color: "#2496ED", category: "tools", about: "OS-level virtualization to deliver software in containers." },
  "Nginx": { icon: <SiNginx />, color: "#009639", category: "tools", about: "High-performance HTTP server and reverse proxy." },
  "AWS": { icon: <SiAmazonwebservices />, color: "#FF9900", category: "tools", about: "On-demand cloud computing platforms and APIs." },
  "Postman": { icon: <SiPostman />, color: "#FF6C37", category: "tools", about: "API platform for developers to design, build, and test APIs." },
  "VS Code": { icon: <SiVscodium />, color: "#007ACC", category: "tools", about: "Streamlined code editor with support for debugging and Git." },
  "Figma": { icon: <SiFigma />, color: "#F24E1E", category: "tools", about: "Collaborative interface design tool for modern teams." },
  "Linux": { icon: <SiLinux />, color: "#FCC624", category: "tools", about: "Open-source Unix-like operating system kernel." },
  "GitHub": { icon: <SiGit />, color: "#ffffff", category: "tools", about: "Cloud-based hosting service for Git repositories." },
  "Postman": { icon: <SiPostman />, color: "#FF6C37", category: "tools", about: "API platform." },

  // DSA & CS Fundamentals
  "Algorithms": { icon: <Cpu size={14} />, color: "#6366f1", category: "dsa", about: "Systematic procedures for solving computational problems." },
  "Data Structures": { icon: <Database size={14} />, color: "#3b82f6", category: "dsa", about: "Specialized formats for organizing and storing data." },
  "Operating Systems": { icon: <Cpu size={14} />, color: "#10b981", category: "dsa", about: "Software that manages computer hardware and software resources." },
  "System Design": { icon: <Globe size={14} />, color: "#8b5cf6", category: "dsa", about: "Defining the architecture and components of complex systems." }
};
