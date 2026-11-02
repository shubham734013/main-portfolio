export const projects = [
  {
    title: "ResQ 2.0",
    tag: "Healthcare · Full Stack",
    year: "2025",
    desc: "Healthcare navigation and emergency coordination platform with hospital discovery, ambulance workflows, and role-based dashboards.",
    link: "https://github.com/shubham734013/resQ_2.O.git",
    metrics: "JWT Auth · Google Maps · MongoDB",
  },
  {
    title: "Day Night GymOS",
    tag: "Gym SaaS · TypeScript",
    year: "2025",
    desc: "A scalable gym management SaaS platform designed with a TypeScript monorepo, shared packages, and cloud-ready architecture.",
    link: "https://github.com/shubham734013",
    metrics: "Monorepo · Vitest · Biome",
  },
  {
    title: "Amazon Clone",
    tag: "E-commerce · Frontend",
    year: "2024",
    desc: "Responsive e-commerce interface recreated to practice modern product layouts, interactions, and storefront design.",
    link: "https://github.com/shubham734013",
    metrics: "HTML · CSS · JavaScript",
  },
  {
    title: "Netflix Clone",
    tag: "Streaming UI · Frontend",
    year: "2024",
    desc: "A responsive streaming platform interface focused on cinematic layouts, media browsing, and polished navigation.",
    link: "https://github.com/shubham734013",
    metrics: "Responsive UI · HTML · CSS · JavaScript",
  },
  {
    title: "Spotify Clone",
    tag: "Music UI · Frontend",
    year: "2024",
    desc: "Interactive music streaming interface built to practice responsive layouts, media controls, and user-facing interactions.",
    link: "https://github.com/shubham734013",
    metrics: "Interactive UI · HTML · CSS · JavaScript",
  },
];

export const certificates = [
  {
    title: "Google Cloud Certificate",
    issuer: "Google Cloud",
    date: "Verified credential",
    id: "Credential verified",
    skills: ["Cloud Computing", "Google Cloud Platform", "Cloud Services"],
  },
  {
    title: "Xebia Internship Certificate",
    issuer: "Xebia",
    date: "2-week virtual internship",
    id: "Internship credential",
    skills: ["Software Development", "Professional Training", "Team Learning"],
  },
  {
    title: "Adobe Hackathon Certificate",
    issuer: "Adobe",
    date: "Hackathon participation",
    id: "Participation credential",
    skills: ["Hackathon", "Collaborative Problem Solving", "Innovation"],
  },
];

export const experiences = [
  {
    role: "Xebia Virtual Intern",
    company: "Xebia",
    period: "Completed",
    location: "Virtual",
    description:
      "Completed a two-week virtual internship focused on professional software development, technical learning, and collaborative problem-solving.",
    highlights: [
      "Completed structured virtual training through Xebia's internship program.",
      "Strengthened practical understanding of software engineering workflows.",
      "Received an internship certificate after completing the program.",
    ],
    tech: ["Software Development", "Professional Training", "Team Learning"],
  },
  {
    role: "Full-Stack Developer",
    company: "Independent Project Development",
    period: "2024 — Present",
    location: "Jaipur, Rajasthan",
    description:
      "Building full-stack web applications with React, TypeScript, Node.js, Express, and MongoDB, with a focus on real-world utility and scalable architecture.",
    highlights: [
      "Developed ResQ 2.0 for healthcare navigation and emergency coordination.",
      "Designed the architecture for Day Night GymOS, a gym management SaaS platform.",
      "Built responsive frontend clones of popular e-commerce, streaming, and music platforms.",
    ],
    tech: ["React.js", "TypeScript", "Node.js", "Express.js", "MongoDB"],
  },
];

export const skillCategories = [
  {
    name: "Frontend & Architecture",
    description: "Building resilient, blazing-fast web engines",
    skills: [
      "React 19",
      "TypeScript",
      "Next.js",
      "TanStack Router",
      "Tailwind CSS v4",
      "State Machines",
      "Zod",
      "Vite",
    ],
  },
  {
    name: "Motion & Creative Tech",
    description: "Bringing life, depth, and kinetic rhythm to interfaces",
    skills: [
      "GSAP / ScrollTrigger",
      "Three.js / WebGL",
      "Lenis Smooth Scroll",
      "SVG Motion",
      "Canvas 2D",
      "Shaders",
      "Physics Easings",
    ],
  },
  {
    name: "Design & User Experience",
    description: "Crafting intuitive visual systems and emotional resonance",
    skills: [
      "Figma Systems",
      "Micro-Interactions",
      "Fluid Glass UI",
      "Typography",
      "Accessibility (a11y)",
      "Design Tokens",
      "Wireframing",
    ],
  },
  {
    name: "Ecosystem & Tooling",
    description: "Tools that streamline modern product workflows",
    skills: [
      "Git & GitHub",
      "Node.js",
      "Nitro / Cloudflare Workers",
      "Bun",
      "ESLint / Prettier",
      "Performance Profiling",
      "CI/CD",
    ],
  },
];

export const articles = [
  {
    slug: "crafting-liquid-motion",
    title: "Crafting Liquid Motion: Beyond Simple CSS Transitions",
    date: "October 2026",
    readTime: "6 min read",
    category: "Motion & GSAP",
    excerpt:
      "Why traditional easing curves feel static and how momentum-based physics, spring dampening, and GSAP timelines create digital weight.",
    content: `When we move physical objects in real life, they possess inertia. They accelerate smoothly, resist instantaneous changes in velocity, and gently settle into equilibrium through friction.

Yet on the web, interfaces are frequently built with uniform linear or basic cubic-bezier curves that snap rigidly into place. By blending Lenis smooth scrolling with GSAP ticker synchronization, we eliminate the stutter between native scroll events and render passes.

Key takeaways for 60fps fluidity:
1. Always animate composite-friendly properties (transform, opacity, filter).
2. Offload non-critical computations from the requestAnimationFrame loop.
3. Sync custom cursor physics with spring dampers to avoid uncanny lag.`,
  },
  {
    slug: "fluid-glassmorphism-60fps",
    title: "The Architecture of Fluid Glass: Modern Glassmorphism at 60fps",
    date: "September 2026",
    readTime: "8 min read",
    category: "UI Architecture",
    excerpt:
      "How to leverage modern OKLCH color spaces, GPU compositing, and subtle noise grain without torching mobile battery life.",
    content: `Glassmorphism has evolved beyond tacky blur filters into sophisticated atmospheric depth. Modern browsers allow hardware-accelerated backdrop-filter blur coupled with fine grain noise.

By leveraging OKLCH colors, perceptual lightness remains uniform across hues, ensuring that dark mode interfaces maintain contrast ratios without muddying deep shadows.

When building glass interfaces:
• Isolate blurred containers with will-change: transform only during active scroll states.
• Layer semi-transparent borders with highlight shines to simulate edge refraction.
• Couple glass surfaces with responsive 3D tilt coordinates to create physical presence.`,
  },
  {
    slug: "micro-interactions-invisible-ui",
    title: "Micro-Interactions That Delight: The Psychology of Invisible UI",
    date: "August 2026",
    readTime: "5 min read",
    category: "UX & Details",
    excerpt:
      "The unspoken language of tactile buttons, magnetic attraction, and haptic feedback that turn software into joy.",
    content: `The best interfaces are felt before they are consciously analyzed. A button that gently bows toward the cursor creates an instinctive magnetic gravity.

When a user clicks, a micro-contraction followed by an elastic release provides tangible confirmation that an action was registered. Adding subtle audio or visual ripples anchors the user in space.

Details to elevate any app:
• Magnetic pull on primary call-to-actions.
• Contextual hover cursors that reflect the element's intent.
• Text scramble/cipher transitions that acknowledge state transitions.`,
  },
  {
    slug: "threejs-in-production",
    title: "WebGL & Three.js in Production: Balancing Awe with Accessibility",
    date: "July 2026",
    readTime: "7 min read",
    category: "3D & WebGL",
    excerpt:
      "Practical strategies to deliver cinematic 3D visual experiences while respecting reduced-motion preferences and low-power devices.",
    content: `3D graphics should enhance storytelling, never hijack usability. Detecting device capabilities and listening to prefers-reduced-motion is non-negotiable.

Always provide graceful 2D fallbacks with CSS gradients and SVG paths so that every user enjoys a pristine layout regardless of device tier.

Performance checklist:
1. Limit polygon count and utilize procedural shaders where possible.
2. Pause the Three.js render loop whenever the canvas exits the viewport.
3. Dispose of geometries, materials, and textures aggressively on component unmount.`,
  },
];

export const contactDetails = {
  email: "shubhamvaishnav640@gmail.com",
  location: "Jaipur, Rajasthan, India (IST, UTC+5:30)",
  availability:
    "Open to full-stack development and software engineering opportunities",
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/shubham734013",
      handle: "@shubham734013",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/shubham-vaishnav-380970313?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      handle: "LinkedIn profile",
    },
    {
      name: "Twitter / X",
      url: "https://x.com/ShubhamVai75799",
      handle: "@shubham_code",
    },
    {
      name: "Email",
      url: "mailto:shubhamvaishnav640@gmail.com",
      handle: "Send an email",
    },
  ],
};
