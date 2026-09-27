import { Code, Smartphone, Component, Cloud, BrainCircuit, Users, Share2, Megaphone, PenTool, Camera, Clapperboard } from 'lucide-react'
import p1 from '../assets/img/p1.jpg'
import p2 from '../assets/img/p2.jpg'
import p3 from '../assets/img/p3.jpg'
import p4 from '../assets/img/p4.jpg'
import w1 from '../assets/img/w1.jpg'
import w2 from '../assets/img/w2.jpg'
import w3 from '../assets/img/w3.jpg'
import w4 from '../assets/img/w4.jpg'
import a1 from '../assets/img/a1.jpg'
import a2 from '../assets/img/a2.jpg'
import a3 from '../assets/img/a3.jpg'

export const navLinks = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Products', id: 'products' },

  { label: 'Technology', id: 'technology' },
  { label: 'Contact', id: 'contact' },
]

export const services = [
  { icon: Code, title: 'Web Development', text: 'Modern, responsive and scalable web applications for your business.' },
  { icon: Smartphone, title: 'Mobile App Development', text: 'High-performance mobile apps for Android & iOS (React Native).' },
  { icon: Component, title: 'UI/UX Design', text: 'Beautiful and intuitive interfaces that users love.' },

  { icon: BrainCircuit, title: 'AI & Automation', text: 'Smart solutions using AI and automation to increase efficiency.' },
  { icon: Users, title: 'IT Consulting', text: 'Strategic guidance for digital transformation and growth.' },
  { icon: Share2, title: 'Social Media Management', text: 'End-to-end handling of your social channels to grow reach and engagement.' },
  { icon: Megaphone, title: 'Meta Ads & Digital Advertising', text: 'Targeted Facebook & Instagram campaigns that drive leads and sales.' },
  { icon: PenTool, title: 'Logo & Brand Identity', text: 'Memorable logos and cohesive brand identities that stand out.' },
  { icon: Camera, title: 'Content Creation', text: 'Engaging posts, graphics and copy crafted for your audience.' },
  { icon: Clapperboard, title: 'Video Editing', text: 'Professional reels, ads and brand videos that tell your story.' },
]

export const products = [
  { name: 'WolvoTask', sub: 'Task Management App', tag: 'Productivity', img: p1 },
  { name: 'WolvoFit', sub: 'Fitness & Health App', tag: 'Health', img: p2 },
  { name: 'WolvoLearn', sub: 'E-Learning Platform', tag: 'Education', img: p3 },
  { name: 'WolvoPay', sub: 'Finance Management App', tag: 'Finance', img: p4 },
]

export const portfolio = [
  { name: 'WolvoTask', sub: 'Task Management App', img: w1 },
  { name: 'WolvoFit', sub: 'Fitness & Health App', img: w2 },
  { name: 'WolvoLearn', sub: 'E-Learning Platform', img: w3 },
  { name: 'WolvoPay', sub: 'Finance Management App', img: w4 },
]

const techLogos = import.meta.glob('../assets/tech/*.svg', { eager: true, import: 'default' })
const logo = (slug) => techLogos[`../assets/tech/${slug}.svg`]

export const technologies = [
  { name: 'React', logo: logo('react') },
  { name: 'React Native', logo: logo('react') },
  { name: 'Python', logo: logo('python') },
  { name: 'Django', logo: logo('django') },
  { name: 'PostgreSQL', logo: logo('postgresql') },
  { name: 'Supabase', logo: logo('supabase') },
  { name: 'AWS', logo: logo('amazonwebservices') },
  { name: 'Docker', logo: logo('docker') },
  { name: 'Firebase', logo: logo('firebase') },
  { name: 'Node.js', logo: logo('nodejs') },
  { name: 'TypeScript', logo: logo('typescript') },
  { name: 'JavaScript', logo: logo('javascript') },
  { name: 'Next.js', logo: logo('nextjs') },
  { name: 'MongoDB', logo: logo('mongodb') },
  { name: 'Tailwind CSS', logo: logo('tailwindcss') },
  { name: 'Figma', logo: logo('figma') },
  { name: 'Git', logo: logo('git') },
  { name: 'Kubernetes', logo: logo('kubernetes') },
  { name: 'Redis', logo: logo('redis') },
  { name: 'ChatGPT', logo: logo('chatgpt') },
  { name: 'Claude', logo: logo('claude') },
  { name: 'Gemini', logo: logo('gemini') },
  { name: 'Google Flow', logo: logo('googleflow') },
  { name: 'Photoshop', logo: logo('photoshop') },
  { name: 'Illustrator', logo: logo('illustrator') },
  { name: 'Premiere Pro', logo: logo('premierepro') },
  { name: 'After Effects', logo: logo('aftereffects') },
  { name: 'DaVinci Resolve', logo: logo('davinciresolve') },
  { name: 'CapCut', logo: logo('capcut') },
  { name: 'Canva', logo: logo('canva') },
  { name: 'Blender', logo: logo('blender') },
]

export const testimonials = [
  { quote: 'WOLVO delivered our app on time with excellent quality. Their team is professional, responsive and easy to work with.', name: 'Aarav Sharma', role: 'Founder, NextGen Solutions', img: a1 },
  { quote: 'The team at WOLVO understood our vision and turned it into a product that exceeded our expectations. Highly recommended!', name: 'Priya Mehta', role: 'CEO, BrightPath Learning', img: a2 },
  { quote: 'Reliable, skilled and a pleasure to work with. WOLVO helped us scale our business with innovative solutions.', name: 'Rohit Verma', role: 'Product Manager, FinTech Pro', img: a3 },
  { quote: 'From wireframes to launch, WOLVO kept us in the loop every week. Our booking app went live two weeks ahead of schedule.', name: 'Sneha Iyer', role: 'Co-founder, StayEasy Homes' },
  { quote: 'They rebuilt our inventory dashboard and cut our daily reporting time in half. Very transparent and dependable team.', name: 'Arjun Patnaik', role: 'Operations Head, Kalinga Traders' },
  { quote: 'WOLVO understood the needs of our patients and built a clean, simple appointment app. The support after launch has been excellent.', name: 'Dr. Kavya Reddy', role: 'Director, CarePlus Clinics' },
  { quote: 'Our online store now loads faster and converts better. The team was quick to respond and easy to work with.', name: 'Vikram Singh', role: 'Founder, Desi Threads' },
  { quote: 'Great communication and solid engineering. WOLVO helped us move our systems to the cloud without any downtime.', name: 'Ananya Das', role: 'CTO, EduSpark Technologies' },
]
