import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VanillaTilt from 'vanilla-tilt';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  type: string;
  typeClass: string;
  name: string;
  description: string;
  stack: string[];
  github: string | null;
  live: string | null;
  featured: boolean;
  privateRepo: boolean;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {
  projects: Project[] = [
    {
      id: 'cctv-guardai',
      type: 'AI + Full Stack | Production',
      typeClass: 'badge-violet',
      name: 'CCTV GuardAI',
      description: 'AI-powered real-time surveillance and monitoring platform with intelligent analytics — built during internship at Asian Solution.',
      stack: ['Python', 'Angular', 'AI/ML', 'REST APIs', 'SSO/IDP'],
      github: null,
      live: null,
      featured: true,
      privateRepo: true
    },
    {
      id: 'shopzee',
      type: 'E-Commerce | Full Stack',
      typeClass: 'badge-cyan',
      name: 'ShopZee',
      description: 'Full-featured cosmetics e-commerce platform with product catalog, cart, authentication, and CI/CD pipeline.',
      stack: ['Angular', 'Python', 'FastAPI', 'PostgreSQL', 'Railway'],
      github: 'https://github.com/MeharRaza/GlowMart',
      live: 'https://shopzee.me',
      featured: false,
      privateRepo: false
    },
    {
      id: 'gym-mgmt',
      type: 'Management Platform | Full Stack',
      typeClass: 'badge-violet',
      name: 'Gym Management System',
      description: 'Comprehensive gym platform — member registration, attendance tracking, billing, role-based dashboards.',
      stack: ['Angular', 'Python', 'SQLite'],
      github: 'https://github.com/MeharRaza/Gym-Managment-System',
      live: null,
      featured: false,
      privateRepo: false
    },
    {
      id: 'student-form',
      type: 'CRUD Application',
      typeClass: 'badge-white',
      name: 'Student Registration Form',
      description: 'Full-stack CRUD app with REST API integration and optimized database queries.',
      stack: ['Angular', 'TypeScript', 'REST API'],
      github: 'https://github.com/MeharRaza/Student-Form',
      live: null,
      featured: false,
      privateRepo: false
    },
    {
      id: 'my-bot',
      type: 'AI Chatbot | Python',
      typeClass: 'badge-cyan',
      name: 'My Bot',
      description: 'Intelligent AI assistant chatbot built with Python — conversational AI for automated responses and user interaction.',
      stack: ['Python', 'AI/ML', 'NLP', 'Automation'],
      github: 'https://github.com/MeharRaza/My-Bot',
      live: null,
      featured: false,
      privateRepo: false
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Featured card
    gsap.fromTo('.featured-card',
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.featured-card', start: 'top 80%', toggleActions: 'play none none none' }
      }
    );

    // Regular cards
    gsap.fromTo('.project-card',
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1, scale: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.projects-grid', start: 'top 82%', toggleActions: 'play none none none' }
      }
    );

    // Vanilla-tilt
    setTimeout(() => {
      const cards = document.querySelectorAll<HTMLElement>('.tilt-card');
      VanillaTilt.init(Array.from(cards), {
        max: 8,
        speed: 400,
        glare: true,
        'max-glare': 0.12,
        scale: 1.03
      });
    }, 800);
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
