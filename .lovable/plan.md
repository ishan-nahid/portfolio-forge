

# 🌙 Midnight Minimalist Portfolio

A high-performance, single-page portfolio website for a Software Engineer with a dark, engineering-focused aesthetic.

## Design System
- **Background:** #0a0a0a (near-black)
- **Text:** #e5e5e5 (soft white)
- **Accent:** Electric Teal/Blue for links, buttons, and highlights
- **Font:** Inter from Google Fonts
- **Vibe:** Clean, minimal, strong typography, generous whitespace

## Sections

### 1. Sticky Navigation
- Glassmorphism navbar (blur + transparency)
- Smooth-scroll links: Home, Work, Skills, About, Contact
- Right side: outline "Resume" button + GitHub/LinkedIn icon links
- Mobile: hamburger menu

### 2. Hero Section
- Large bold headline: "Building scalable distributed systems."
- Subtitle with name and focus areas
- Two CTAs: "View Projects" (primary teal) and "Contact Me" (ghost/outline)
- Subtle fade-in animation on load

### 3. Tech Stack Grid
- Horizontal marquee/scrolling strip of tech logos/names
- Categorized: Languages, Frameworks, Tools, Infrastructure
- Clean badge-style display

### 4. Featured Projects
- Large alternating cards (image left/right on desktop, stacked on mobile)
- Each card: Title, problem-focused description, tech stack badges, impact metrics, Demo/Repo links
- Scroll-reveal animations

### 5. Experience Timeline
- Vertical timeline with connecting line
- Each entry: Role, Company, Date range, 2-3 bullet points
- Alternating left/right on desktop, single column on mobile

### 6. Bento Grid (Education & More)
- Masonry-style grid layout with varied card sizes
- Large card: Education (degree, university, GPA, coursework)
- Tall card: Volunteering & mentorship
- Wide card: Awards & scholarships
- Small card: Hobbies & interests

### 7. Footer
- Minimal footer with email link
- "Built with React & Tailwind" credit
- Social links repeated

## Architecture
- **All content data** stored in a single `PORTFOLIO_DATA` constant object at the top of the data file — easy to edit names, projects, links without touching JSX
- **Semantic HTML** throughout (`<section>`, `<article>`, `<header>`, `<nav>`, `<footer>`)
- **ARIA labels** on interactive elements
- **Fully responsive** — mobile-first stacked layouts, desktop side-by-side
- **Scroll-reveal animations** using Intersection Observer + CSS transitions (no extra dependencies)

