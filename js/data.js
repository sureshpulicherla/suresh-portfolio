/**
 * SITE_DATA is the only file you need to edit for text, career entries,
 * projects, showroom models and temples. This works on GitHub Pages without
 * a build step or paid backend. Do not put passwords or API keys here.
 */
const SITE_DATA = {
  profile: {
    name: 'Suresh Pulicherla',
    eyebrow: 'SOFTWARE  /  OPERATIONS  /  CREATIVE EXPERIMENTS',
    headline: 'I build across worlds.',
    bio: 'I work at the intersection of software, real-world operations, and creative digital experiences. From Java backend projects to the precision of US commercial insurance workflows — I like learning systems and making things work better.',
    location: 'Bengaluru, India',
    email: 'sureshpulicherla3@gmail.com',
    linkedin: 'https://www.linkedin.com/in/sureshpulicherla/',
    portrait: 'assets/profile.webp',
    accentLine: 'CURIOUS BY NATURE. BUILDER BY CHOICE.',
    award: 'Rising Star Award · 2026'
  },
  projects: [
    {
      id: 'shopnest', title: 'ShopNest', overline: '01 / JAVA FULL-STACK',
      subtitle: 'A shopping experience, built end to end.', category: 'software',
      description: 'A full-stack e-commerce practice project with customer and admin flows, MVC architecture, catalog, cart, and MySQL persistence.',
      stack: ['Java', 'Spring Boot', 'MySQL', 'Thymeleaf'],
      highlights: ['Built customer and admin journeys around the MVC pattern.', 'Worked with Spring Boot controllers, Hibernate and persistent catalog data.', 'Developed responsive pages using HTML, CSS and Thymeleaf.'],
      demo: 'shopnest', image: '', theme: 'mint',
      video: 'https://drive.google.com/file/d/1WWBvaH2bHMatgd5pgk5NyNtPfctYo17F/view?pli=1',
      note: 'The interactive preview here is a frontend illustration, not a live backend connection.'
    },
    {
      id: 'tunehub', title: 'TuneHub', overline: '02 / JAVA FULL-STACK',
      subtitle: 'Music. Playlists. A layered backend.', category: 'software',
      description: 'A music-platform project exploring account flows, audio interfaces, playlists, and a Java/Spring Boot service structure.',
      stack: ['Java', 'Spring Boot', 'MySQL', 'MVC'],
      highlights: ['Practiced controller, service and repository separation.', 'Designed playlist and song-metadata workflows.', 'Created a browser-based music-platform interface.'],
      demo: 'tunehub', image: '', theme: 'violet',
      video: 'https://drive.google.com/file/d/1ezkLMOK7qLgbNtFCd72r4X4NbAwnVom1/view',
      note: 'The audio preview is an original synthesized demo; it does not stream songs from TuneHub.'
    },
    {
      id: 'aifood', title: 'AI Food Analyzer', overline: '03 / BACKEND EXPLORATION',
      subtitle: 'Making nutrition data easier to explore.', category: 'software',
      description: 'A backend concept for structured food analysis, validation, caching and fallback handling with Java APIs.',
      stack: ['Java', 'REST APIs', 'JSON', 'Caching'],
      highlights: ['Designed structured response handling and JSON validation.', 'Explored caching and resilient fallback behavior.', 'Organized food results around user-oriented summary metrics.'],
      demo: 'aifood', image: '', theme: 'lime', video: '',
      note: 'Sample nutrition scores in this website are illustrative, not AI-generated or medical advice.'
    },
    {
      id: 'aws', title: 'AWS Backend Lab', overline: '04 / CLOUD EXPLORATION',
      subtitle: 'Understanding the journey from code to cloud.', category: 'software',
      description: 'A Spring Boot deployment exercise using EC2, IAM, MySQL connectivity and secure cloud configuration.',
      stack: ['AWS EC2', 'IAM', 'Spring Boot', 'MySQL'],
      highlights: ['Configured an EC2 environment and inbound security-group rules.', 'Explored IAM roles and storage integration.', 'Connected Spring Boot APIs to a cloud-hosted database.'],
      demo: 'aws', image: '', theme: 'orange', video: '',
      note: 'The architecture explorer is an illustration, not a live infrastructure status monitor.'
    },
    {
      id: 'bikes', title: 'APEX Garage', overline: '05 / INTERACTIVE EXPERIMENT',
      subtitle: 'A concept superbike. Your custom build.', category: 'creative',
      description: 'An interactive motorcycle concept showroom with a rotating WebGL model, color selection and live configuration estimates.',
      stack: ['Three.js', '3D', 'JavaScript', 'UI Design'],
      highlights: ['Custom procedural 3D concept model that can be rotated.', 'Paint, exhaust and wheel choices with live illustrative calculations.', 'Dark, atmospheric presentation inspired by a high-end digital garage.'],
      demo: 'bikes', image: 'assets/bike_showroom.webp', theme: 'cyan', video: '',
      note: 'Original concept model; fictional motorcycles, specifications and pricing.'
    },
    {
      id: 'divine', title: 'Divine Atlas', overline: '06 / CULTURE & DESIGN',
      subtitle: 'A quiet digital space for sacred architecture.', category: 'creative',
      description: 'A cinematic, exploratory temple-design concept inspired by South Indian architecture, warm light and thoughtful sound.',
      stack: ['Web Design', 'Storytelling', 'Audio', 'CSS'],
      highlights: ['Created an immersive temple-inspired visual experience.', 'Added selectable architecture stories and optional ambient sound.', 'Designed for stillness, accessibility and mobile screens.'],
      demo: 'divine', image: 'assets/divine_temple.webp', theme: 'gold', video: '',
      note: 'The banner is artistic concept imagery, not documentary photography of any listed temple.'
    }
  ],
  experience: [
    {id:'resourcepro', period:'JUN 2025 — PRESENT', type:'ENTERPRISE OPERATIONS',
      role:'Associate – Service Delivery', organization:'ReSource Pro Operational Solutions',
      description:'US commercial P&C insurance operations, document processing, carrier portals, EPIC AMS and quality-led delivery.',
      highlights:['Recognized with a Rising Star Award in April 2026.', 'Processes 50+ commercial-lines documents daily across 31+ carrier portals.', 'Supports quality audit tracking and cross-trainee knowledge sharing.'],
      skills:['EPIC AMS','Commercial P&C','Quality','Process Delivery']},
    {id:'altruist', period:'JUN 2024 — JUN 2025', type:'CLIENT OPERATIONS',
      role:'Customer Relation Officer', organization:'Altruist Technologies',
      description:'Technical and billing issue resolution in a high-volume, quality-focused customer environment.',
      highlights:['Handled approximately 25–50 inquiries per day.', 'Worked to SLA requirements and escalated complex cases across teams.'],
      skills:['Customer Success','SLA','Quality']},
    {id:'kodnest', period:'JUN 2023 — JAN 2024', type:'SOFTWARE DEVELOPMENT',
      role:'Software Development Intern', organization:'KodNest Technologies',
      description:'Intensive Java full-stack practice focused on hands-on applications, APIs, debugging and development fundamentals.',
      highlights:['Built and practiced with ShopNest and TuneHub.', 'Explored Java, Spring Boot, MySQL, MVC and deployment workflows.'],
      skills:['Java','Spring Boot','MySQL','MVC']},
    {id:'education', period:'2020 — 2023', type:'EDUCATION',
      role:'B.Tech, Mechanical Engineering', organization:'Tadipatri Engineering College',
      description:'Engineering background with a later focus on software development and real-world process improvement.',
      highlights:['B.Tech: 7.8 CGPA; Diploma: 7.5 CGPA (as listed in original project).', 'Led a Solar Seed Sprayer agricultural engineering project.', 'Completed Java full-stack training at KodNest.'],
      skills:['Engineering','Problem Solving','Java']}
  ],
  bikes: [
    {id:'apex', name:'APEX V4R', family:'CARBON EDITION', engine:'998cc V4 concept', basePrice:2450000, hp:218, torque:'115 Nm', speed:'312 km/h', weight:'172 kg'},
    {id:'kuroi', name:'KUROI Z1000', family:'HYPER-NAKED', engine:'1043cc inline-4 concept', basePrice:1890000, hp:202, torque:'111 Nm', speed:'294 km/h', weight:'184 kg'},
    {id:'aether', name:'AETHER GT', family:'ELECTRIC HYPERBIKE', engine:'160 kW electric concept', basePrice:2150000, hp:214, torque:'240 Nm', speed:'280 km/h', weight:'196 kg'}
  ],
  bikeColors: [
    {name:'Ion Cyan', hex:'#36e0db'}, {name:'Ember Red', hex:'#f05068'},
    {name:'Volt Violet', hex:'#a38bff'}, {name:'Graphite', hex:'#a7b3c4'}
  ],
  exhausts: [
    {name:'Sport Titanium', hp:8, cost:165000},
    {name:'Track Carbon', hp:11, cost:195000}
  ],
  wheels: [
    {name:'Forged Carbon', cost:240000, savings:'−4 kg'},
    {name:'Magnesium', cost:180000, savings:'−2.5 kg'}
  ],
  temples: [
    {id:'tirumala', title:'Sri Venkateswara Swamy', place:'Tirumala · Andhra Pradesh', detail:'Known for the Ananda Nilayam golden vimana and its location among the Seshachalam hills.', mantra:'Om Namo Venkatesaya'},
    {id:'arunachala', title:'Arunachaleswarar', place:'Tiruvannamalai · Tamil Nadu', detail:'An important Shiva temple associated with the element of fire and the sacred Arunachala hill.', mantra:'Om Namah Shivaya'},
    {id:'hampi', title:'Virupaksha Temple', place:'Hampi · Karnataka', detail:'A historic temple within the Vijayanagara landscape along the Tungabhadra River.', mantra:'Om Namah Shivaya'}
  ]
};
