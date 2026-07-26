// src/portfolioData.js

// =========================
// Skills
// =========================

export const skillsData = [
  {
    title: "Languages",
    skills: [
      { name: "C++" },
      { name: "C" },
      { name: "Python" },
      { name: "JavaScript" },
      { name: "R" },
      { name: "SQL" },
      { name: "MATLAB" },
    ],
  },

  {
    title: "Frontend",
    skills: [
      { name: "React.js" },
      { name: "Next.js" },
      { name: "HTML5" },
      { name: "CSS3" },
      { name: "Tailwind CSS" },
      { name: "Vite" },
    ],
  },

  {
    title: "Backend",
    skills: [
      { name: "Node.js" },
      { name: "Express.js" },
      { name: "REST API" },
      { name: "JWT Authentication" },
      { name: "OAuth 2.0" },
      { name: "Axios" },
      { name: "Node Cron" },
    ],
  },

  {
    title: "Databases & ORM",
    skills: [
      { name: "MongoDB" },
      { name: "MySQL" },
      { name: "PostgreSQL" },
      { name: "Prisma ORM" },
      { name: "Redis" },
      { name: "Firebase" },
    ],
  },

  {
    title: "DevOps & Cloud",
    skills: [
      { name: "Docker" },
      { name: "Git" },
      { name: "GitHub" },
      { name: "Render" },
      { name: "Vercel" },
    ],
  },

  {
    title: "Tools",
    skills: [
      { name: "Postman" },
      { name: "Swagger" },
      { name: "Cloudinary" },
      { name: "VS Code" },
      { name: "Figma" },
    ],
  },
];

// =========================
// Education
// =========================

export const educationData = [
  {
    duration: "2024 - 2028",
    degree: "Bachelor of Technology (B.Tech)",
    field: "Computer Science and Engineering",
    school: "National Institute of Technology Silchar",
    description:
      "Relevant Coursework includes Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, and Computer Networks.",
  },

  {
    duration: "2022 - 2024",
    degree: "Higher Secondary Education (12th Grade)",
    field: "Science Stream",
    school: "Jawahar Navodaya Vidyalaya, Bengaluru Urban",
    description:
      "Studied Physics, Chemistry, Mathematics, and Computer Science, building a strong academic foundation for engineering.",
  },

  {
    duration: "2017 - 2022",
    degree: "Secondary Education (10th Grade)",
    field: "General Science",
    school: "Jawahar Navodaya Vidyalaya, Sonitpur",
    description:
      "Completed secondary education with a strong foundation in science and mathematics.",
  },
];

// =========================
// Experience
// =========================

export const experienceData = [
  {
    date: "May 2025 - Present",
    title: "React Developer",
    company: "NIT Silchar",
    description:
      "Building dynamic and interactive user interfaces using React.js with a focus on reusable components, performance optimization, and responsive design.",
    skills: [
      "React.js",
      "JavaScript",
      "Frontend Development",
      "Web Services",
    ],
  },

  {
    date: "May 2024 - Present",
    title: "Full Stack Developer",
    company: "NIT Silchar",
    description:
      "Developing modern full-stack applications using React, Node.js, Express, MongoDB, PostgreSQL, and REST APIs while implementing authentication and deployment workflows.",
    skills: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "PostgreSQL",
      "REST APIs",
    ],
  },

  {
    date: "August 2025 - Present",
    title: "Developer",
    company: "Computer Science Society (Dev Wing)",
    description:
      "Contributing to the development of society projects while strengthening frontend and backend development skills through collaborative work.",
    skills: [
      "Frontend Development",
      "Backend Development",
      "Team Collaboration",
    ],
  },

  {
    date: "February 2026 - May 2026",
    title: "Tech Content Writer",
    company: "Smartly Creators Program (GirlScript Foundation)",
    description:
      "Created beginner-friendly technical articles and educational content covering programming, computer science fundamentals, and software development.",
    skills: [
      "Technical Writing",
      "Content Creation",
      "Computer Science",
    ],
  },
];

// =========================
// Projects
// =========================

export const projectsData = [
  {
    title: "API Monitoring Platform",
    duration: "2026",
    description:
      "A full-stack API monitoring platform that continuously monitors API uptime, response time, and availability. It supports secure authentication, scheduled health checks, incident tracking, email notifications, and API documentation.",
    technologies: [
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "Prisma ORM",
      "Redis",
      "JWT Authentication",
      "Swagger/OpenAPI",
      "Node Cron",
      "Docker",
      "Render",
      "Vercel",
    ],
    github:
      "https://github.com/Subhajit281/API-Monitoring-Platform-Backend",
    live:
      "https://upflow-monitoring.vercel.app",
  },

  {
    title: "CSS Official Website",
    duration: "2025",
    description:
      "Official website of the Computer Science Society, NIT Silchar. The platform provides event information, study resources, announcements, and society updates for students.",
    technologies: [
      "React.js",
      "Tailwind CSS",
      "JavaScript",
    ],
    github:
      "https://github.com/ComputerScienceSoceityNITS/css-official-website-2025-26.git",
    live:
      "https://www.css-nits.in",
  },

  {
    title: "Agroww CropCare",
    duration: "2026",
    description:
      "A MERN-based smart farming platform that helps farmers manage crops, receive weather alerts, and make informed farming decisions through a user-friendly dashboard.",
    technologies: [
      "React.js",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
    ],
    github:
      "https://github.com/Subhajit281/Agroww-CropCare.git",
    live:
      "https://agroww-cropcare.onrender.com",
  },

  {
    title: "2D Physics Simulator",
    duration: "2026",
    description:
      "A real-time executable 2D physics simulator built using C++ and SFML for simulating motion, forces, collisions, and object interactions. Integrated with a React and Electron interface.",
    technologies: [
      "C++",
      "SFML",
      "React.js",
      "Electron",
      "Node.js",
      "CMake",
    ],
    github:
      "https://github.com/Subhajit281/PhysicsSimulator",
    live: "",
  },

  {
    title: "3D Portfolio",
    duration: "2026",
    description:
      "A modern interactive portfolio built using React.js, Tailwind CSS, and Framer Motion to showcase projects, skills, education, and professional experience.",
    technologies: [
      "React.js",
      "Tailwind CSS",
      "Framer Motion",
      "JavaScript",
    ],
    github:
      "https://github.com/Subhajit281/react-portfolio",
    live:
      "https://subhajit-sarkar.vercel.app",
  },
];
