import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import "./floatingSkillsHelix.css";

// Replace or extend this list with your own skills. `icon` accepts any image URL.
const skills = [
  { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
  { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
  { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
  { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/5FA04E" },
  { name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB" },
  { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/FFFFFF" },
  { name: "Tailwind", icon: "https://cdn.simpleicons.org/tailwindcss/38BDF8" },
  { name: "Framer", icon: "https://cdn.simpleicons.org/framer/FFFFFF" },
  { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
  { name: "GitHub", icon: "https://cdn.simpleicons.org/github/FFFFFF" },
  { name: "Docker", icon: "https://cdn.simpleicons.org/docker/2496ED" },
 // { name: "AWS", icon: "https://cdn.simpleicons.org/amazonaws/FF9900" },
  { name: "Firebase", icon: "https://cdn.simpleicons.org/firebase/FFCA28" },
  { name: "MongoDB", icon: "https://cdn.simpleicons.org/mongodb/47A248" },
  { name: "Postgres", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
  { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" },
  { name: "Redis", icon: "https://cdn.simpleicons.org/redis/DC382D" },
  { name: "GraphQL", icon: "https://cdn.simpleicons.org/graphql/E10098" },
  { name: "Figma", icon: "https://cdn.simpleicons.org/figma/F24E1E" },
  { name: "Vite", icon: "https://cdn.simpleicons.org/vite/646CFF" },
  { name: "Linux", icon: "https://cdn.simpleicons.org/linux/FCC624" },
  { name: "Kubernetes", icon: "https://cdn.simpleicons.org/kubernetes/326CE5" },
 // { name: "TensorFlow", icon: "https://cdn.simpleicons.org/tensorflow/FF6F00" },
  { name: "OpenAI", icon: "https://cdn.simpleicons.org/openai/FFFFFF" },
 //{ name: "Three.js", icon: "https://cdn.simpleicons.org/threedotjs/FFFFFF" },
//  { name: "Sass", icon: "https://cdn.simpleicons.org/sass/CC6699" },
//{ name: "Jest", icon: "https://cdn.simpleicons.org/jest/C21325" },
 // { name: "Webflow", icon: "https://cdn.simpleicons.org/webflow/146EF5" },
 { name: "C++", icon: "https://cdn.simpleicons.org/cplusplus/00599C" },

{ name: "Express", icon: "https://cdn.simpleicons.org/express/FFFFFF" },

{ name: "Prisma", icon: "https://cdn.simpleicons.org/prisma/FFFFFF" },
];

const mod = (value, divisor) => ((value % divisor) + divisor) % divisor;

function SkillCube({ skill, index, progress, total }) {
  // `progress` is deliberately allowed to move the cubes past either edge.
  // That makes down-scroll travel top -> bottom, and up-scroll bottom -> top.
  const transform = useTransform(progress, (value) => {
    const lane = mod(index / total + value * 1.6, 1);
    const turns = 1.5;
    const angle = lane * Math.PI * 2 * turns + index * 0.31;
    const wave = Math.sin(angle);
    const depth = Math.cos(angle);

    const x = 50 + wave * 38 + Math.sin(angle * 0.5) * 5;
    const y = lane * 124 - 12;
    const z = depth * 135;
    const scale = 0.58 + ((depth + 1) / 2) * 0.52;
    const rotateY = -angle * (180 / Math.PI) + 18;
    const rotateX = 14 + depth * 18;

    return `translate3d(calc(${x}vw - 50%), ${y}vh, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
  });

  const opacity = useTransform(progress, (value) => {
    const lane = mod(index / total + value * 1.6, 1);
    return Math.min(0.94, Math.max(0, lane * 9, (1 - lane) * 9));
  });

  return (
    <motion.article
      className="skill-helix__cube-wrap"
      style={{ transform, opacity }}
      aria-label={skill.name}
    >
      <div className="skill-helix__cube">
        <div className="skill-helix__face skill-helix__face--front">
          <img src={skill.icon} alt="" loading="lazy" />
          <span>{skill.name}</span>
        </div>
        <div className="skill-helix__face skill-helix__face--back" />
        <div className="skill-helix__face skill-helix__face--right" />
        <div className="skill-helix__face skill-helix__face--left" />
        <div className="skill-helix__face skill-helix__face--top" />
        <div className="skill-helix__face skill-helix__face--bottom" />
      </div>
    </motion.article>
  );
}

export default function FloatingSkillsHelix() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.35,
  });

  return (
    <aside className="skill-helix" aria-hidden="true">
      <div className="skill-helix__glow skill-helix__glow--one" />
      <div className="skill-helix__glow skill-helix__glow--two" />
      {skills.map((skill, index) => (
        <SkillCube
          key={skill.name}
          skill={skill}
          index={index}
          total={skills.length}
          progress={progress}
        />
      ))}
    </aside>
  );
}
