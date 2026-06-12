import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Experience {
  company: string;
  role: string;
  period: string;
  type: string;
  typeClass: string;
  bullets: string[];
  side: 'left' | 'right';
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements AfterViewInit, OnDestroy {
  experiences: Experience[] = [
    {
      company: 'Asian Solution Pvt. Ltd.',
      role: 'Full Stack Developer',
      period: 'Aug 2023 – Present',
      type: 'Onsite',
      typeClass: 'badge-violet',
      side: 'left',
      bullets: [
        'Built CCTV GuardAI — AI-powered surveillance platform with real-time analytics',
        'Implemented SSO/IDP authentication for secure single sign-on',
        'Collaborated cross-functionally on security features & performance optimization'
      ]
    },
    {
      company: 'Apexcify Technologies',
      role: 'Full Stack Web Developer',
      period: 'Present',
      type: 'Remote',
      typeClass: 'badge-cyan',
      side: 'right',
      bullets: [
        'Built responsive Angular + TypeScript web applications',
        'Implemented Python/PostgreSQL backend services',
        'Integrated third-party APIs, optimized database queries'
      ]
    },
    {
      company: 'Decode Labs',
      role: 'AI Developer',
      period: 'Present',
      type: 'Remote',
      typeClass: 'badge-cyan',
      side: 'left',
      bullets: [
        'Built NLP-based AI applications using ML models',
        'Implemented intelligent automation for business process optimization',
        'Handled AI model training, testing, and production deployment'
      ]
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Alternating slide-in animation
    document.querySelectorAll('.exp-card').forEach((card, i) => {
      const fromLeft = i % 2 === 0;
      gsap.fromTo(card,
        { opacity: 0, x: fromLeft ? -60 : 60 },
        {
          opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
