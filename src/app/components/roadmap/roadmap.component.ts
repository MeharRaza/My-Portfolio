import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RoadmapColumn {
  title: string;
  colorClass: string;
  borderClass: string;
  items: string[];
}

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.scss']
})
export class RoadmapComponent implements AfterViewInit, OnDestroy {
  columns: RoadmapColumn[] = [
    {
      title: 'Current Skills',
      colorClass: 'col-violet',
      borderClass: 'border-violet',
      items: ['Angular', 'Python', 'FastAPI', 'PostgreSQL', 'SSO / JWT / Auth', 'LangChain / NLP', 'CI/CD, Railway']
    },
    {
      title: 'Learning Now',
      colorClass: 'col-cyan',
      borderClass: 'border-cyan',
      items: ['Docker (deep)', 'Kubernetes', 'AWS (advanced)', 'React (expanding)', 'System Design']
    },
    {
      title: 'Future Goals',
      colorClass: 'col-white',
      borderClass: 'border-white',
      items: ['Senior Full Stack Dev', 'AI-integrated products', 'Founding a tech product', 'Open source contributor', 'Tech lead by 25']
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    gsap.fromTo('.roadmap-col',
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.roadmap-grid', start: 'top 82%', toggleActions: 'play none none none' }
      }
    );
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
