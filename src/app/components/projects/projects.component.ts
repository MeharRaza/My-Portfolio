import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  image: string;
  aspectRatio: string; // CSS aspect-ratio value
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
      privateRepo: true,
      image: 'assets/projects/cctv-guardai.png',
      aspectRatio: '16/9'
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
      privateRepo: false,
      image: 'assets/projects/shopzee.png',
      aspectRatio: '16/9'
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
      privateRepo: false,
      image: 'assets/projects/gym-mgmt.png',
      aspectRatio: '16/9'
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
      privateRepo: false,
      image: 'assets/projects/student-form.png',
      aspectRatio: '16/9'
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
      privateRepo: false,
      image: 'assets/projects/my-bot.png',
      aspectRatio: '16/9'
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Scroll-triggered auto-flip: when card reaches 50% of viewport, flip to back
    document.querySelectorAll('.flip-card').forEach((card) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 55%',
        end: 'top 20%',
        onEnter: () => card.classList.add('flipped'),
        onLeave: () => card.classList.remove('flipped'),
        onEnterBack: () => card.classList.add('flipped'),
        onLeaveBack: () => card.classList.remove('flipped')
      });
    });

    // Entrance animation — cards scale up from below
    gsap.fromTo('.flip-card',
      { opacity: 0, y: 60, scale: 0.92 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.65, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.projects-flip-grid',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Featured card entrance
    gsap.fromTo('.featured-flip-card',
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.featured-flip-card',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
