import heroImage from '../assets/hero.png'

export const createId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`

export const defaultPortfolioContent = {
  hero: {
    name: 'Muhammad abdhel razza khoirie',
    title: 'Software Engineer',
    pageTitle: 'Software Engineer Portfolio',
    handle: 'abdhelkhoirie',
    status: 'Open to Collaboration',
    summary: 'A formal and minimal personal website focused on clarity, structure, and consistent engineering craft.',
    avatarUrl: heroImage,
    miniAvatarUrl: heroImage,
    contactText: 'Contact Me',
    behindGlowColor: 'rgba(171, 171, 171, 0.35)',
    innerGradient: 'linear-gradient(145deg,#111111 0%,#2d2d2d 100%)',
  },
  introduction: {
    eyebrow: 'Introduction',
    title: 'Building calm, formal interfaces with disciplined structure.',
    summary:
      'I focus on clean product experiences, modular UI, and code that stays readable over time. The goal is to keep the portfolio minimal, functional, and straightforward to scan.',
    highlights: [
      {
        id: createId('intro-highlight'),
        label: 'Design',
        description: 'Monochrome layouts, balanced spacing, and clear hierarchy.',
      },
      {
        id: createId('intro-highlight'),
        label: 'Development',
        description: 'React, Vite, and reusable components with practical state flow.',
      },
      {
        id: createId('intro-highlight'),
        label: 'Delivery',
        description: 'Portfolio pages that stay consistent on large and small screens.',
      },
    ],
  },
  gallery: [
    {
      id: createId('gallery'),
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
      text: 'Morning walk',
    },
    {
      id: createId('gallery'),
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
      text: 'Coffee stop',
    },
    {
      id: createId('gallery'),
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
      text: 'Travel shots',
    },
    {
      id: createId('gallery'),
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      text: 'Creative build',
    },
  ],
  footer: {
    kicker: 'Portfolio',
    brandName: 'Muhammad Abdhel Razza Khoirie',
    description:
      'A focused portfolio built to showcase practical engineering, clean interfaces, and work that is easy to verify.',
    phoneDisplay: '+62 895-3392-11320',
    phoneHref: 'tel:+62895339211320',
    emailDisplay: 'razwaijea6466@gmail.com',
    emailHref: 'mailto:razwaijea6466@gmail.com',
    socials: [
      { name: 'Instagram', href: 'https://www.instagram.com/razzzzzwa/', icon: 'https://cdn.simpleicons.org/instagram/ffffff' },
      { name: 'X', href: 'https://x.com/RazzzzzwaToo', icon: 'https://cdn.simpleicons.org/x/ffffff' },
      { name: 'GitHub', href: 'https://github.com/BigManRazwa', icon: 'https://cdn.simpleicons.org/github/ffffff' },
      {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/in/razza-khoirie-4a4004389/',
        icon:
          'data:image/svg+xml;charset=utf-8,' +
          encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="3" fill="white"/>
              <path d="M8.1 8.2v7.6M8.1 6.8v.2M12 10.3v5.5" stroke="black" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M12 10.3c.6-1 1.6-1.5 2.8-1.5 1.8 0 3 1.1 3 3v5.5" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          `),
      },
      { name: 'Linktree', href: 'https://linktr.ee/Razzzwa', icon: 'https://cdn.simpleicons.org/linktree/ffffff' },
      { name: 'Gmail', href: 'mailto:razwaijea6466@gmail.com', icon: 'https://cdn.simpleicons.org/gmail/ffffff' },
    ],
  },
  stats: [
    { id: createId('stat'), value: '03+', label: 'Production projects' },
    { id: createId('stat'), value: '10+', label: 'Core technologies' },
    { id: createId('stat'), value: '100%', label: 'Responsive layouts' },
  ],
  projects: [
    {
      id: createId('project'),
      title: 'Portfolio Platform',
      summary: 'A structured portfolio website with authenticated admin dashboard and clean content management.',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      tag: 'Web App',
      url: '',
      gitRepoUrl: '',
    },
    {
      id: createId('project'),
      title: 'Task Tracking API',
      summary: 'RESTful API service with secure routes, role-based permissions, and production-ready validation.',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
      tag: 'Backend',
      url: '',
      gitRepoUrl: '',
    },
    {
      id: createId('project'),
      title: 'Business Landing Page',
      summary: 'Formal marketing website focused on clear hierarchy, conversion-focused messaging, and responsiveness.',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      tag: 'Landing Page',
      url: '',
      gitRepoUrl: '',
    },
  ],
  certificates: [
    {
      id: createId('certificate'),
      title: 'Frontend Development Fundamentals',
      issuer: 'Dicoding',
      date: '2025',
      category: 'coding',
      imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: createId('certificate'),
      title: 'JavaScript Algorithms and Data Structures',
      issuer: 'freeCodeCamp',
      date: '2025',
      category: 'coding',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: createId('certificate'),
      title: 'Version Control with Git and GitHub',
      issuer: 'Coursera',
      date: '2024',
      category: 'academic',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  uiSettings: {
    nightMode: true,
    soundEnabled: true,
    soundSource: 'synth',
    soundCustomUrl: '',
    soundVolume: 0.55,
    soundBaseFrequency: 330,
    soundSpread: 60,
    soundWave: 'triangle',
    adminTapCount: 10,
    adminTapWindowMs: 2200,
  },
  about: {
    introduction: 'Hey! I\'m a software engineer who loves building things that look good and work even better. When I\'m not coding, you\'ll find me exploring new tech or just vibing.',
    hobbies: ['Gaming', 'Traveling', 'Photography', 'Reading sci-fi novels'],
    gallery: [
      {
        id: createId('about-gallery'),
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
        text: 'Morning walk',
      },
      {
        id: createId('about-gallery'),
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
        text: 'Coffee stop',
      },
      {
        id: createId('about-gallery'),
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
        text: 'Travel shots',
      },
      {
        id: createId('about-gallery'),
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        text: 'Creative build',
      },
    ],
    funFacts: [
      'I once built an app in 24 hours just for fun',
      'I can code in 5 different programming languages',
      'I\'ve attended 10+ tech conferences',
    ],
    favorites: {
      color: 'Purple',
      animal: 'Dogs',
      food: 'Ramen',
      music: 'Lo-fi Hip Hop',
    },
    personality: 'Creative, curious, and always up for a challenge. I believe in clean code, good UX, and making a positive impact through technology.',
  },
}
