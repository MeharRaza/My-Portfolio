import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VanillaTilt from 'vanilla-tilt';

gsap.registerPlugin(ScrollTrigger);

interface TechItem {
  name: string;
  devicon: string;
  symbol: string;
  color: string;
}

interface TechGroup {
  label: string;
  icon: string;
  colorClass: string;
  items: TechItem[];
}

@Component({
  selector: 'app-tech-stack',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-stack.component.html',
  styleUrls: ['./tech-stack.component.scss']
})
export class TechStackComponent implements AfterViewInit, OnDestroy {

  groups: TechGroup[] = [
    {
      label: 'Frontend',
      icon: '🖥',
      colorClass: 'violet',
      items: [
        { name: 'Angular',      devicon: 'devicon-angularjs-plain',   symbol: 'A',  color: '#dd0031' },
        { name: 'TypeScript',   devicon: 'devicon-typescript-plain',  symbol: 'TS', color: '#3178c6' },
        { name: 'HTML5',        devicon: 'devicon-html5-plain',        symbol: 'H',  color: '#e34f26' },
        { name: 'Tailwind CSS', devicon: 'devicon-tailwindcss-plain',  symbol: 'T',  color: '#38bdf8' }
      ]
    },
    {
      label: 'Backend',
      icon: '⚙️',
      colorClass: 'cyan',
      items: [
        { name: 'Python',    devicon: 'devicon-python-plain',  symbol: 'Py', color: '#ffd343' },
        { name: 'FastAPI',   devicon: 'devicon-fastapi-plain', symbol: 'F',  color: '#009688' },
        { name: 'Node.js',   devicon: 'devicon-nodejs-plain',  symbol: 'N',  color: '#68a063' },
        { name: 'REST APIs', devicon: '',                      symbol: '⇄',  color: '#a78bfa' }
      ]
    },
    {
      label: 'Database',
      icon: '🗄',
      colorClass: 'violet',
      items: [
        { name: 'PostgreSQL', devicon: 'devicon-postgresql-plain', symbol: 'P', color: '#336791' },
        { name: 'SQLite',     devicon: 'devicon-sqlite-plain',     symbol: 'S', color: '#44a4d3' },
        { name: 'SQL',        devicon: '',                         symbol: '⊞', color: '#a78bfa' }
      ]
    },
    {
      label: 'AI / ML',
      icon: '🤖',
      colorClass: 'cyan',
      items: [
        { name: 'LangChain',  devicon: '', symbol: '⛓', color: '#06b6d4' },
        { name: 'NLP',        devicon: '', symbol: '◎', color: '#7c3aed' },
        { name: 'Automation', devicon: '', symbol: '⚙', color: '#a78bfa' }
      ]
    },
    {
      label: 'Tools & Infra',
      icon: '🛠',
      colorClass: 'violet',
      items: [
        { name: 'Git',    devicon: 'devicon-git-plain',    symbol: '⑂', color: '#f05032' },
        { name: 'GitHub', devicon: 'devicon-github-original', symbol: '⬡', color: '#ffffff' },
        { name: 'Railway',devicon: '',                     symbol: '▲', color: '#a78bfa' },
        { name: 'Docker', devicon: 'devicon-docker-plain', symbol: '🐳', color: '#2496ed' },
        { name: 'AWS',    devicon: 'devicon-amazonwebservices-original', symbol: '☁', color: '#ff9900' }
      ]
    },
    {
      label: 'Auth & Security',
      icon: '🔐',
      colorClass: 'cyan',
      items: [
        { name: 'SSO / IDP', devicon: '', symbol: '⬡', color: '#7c3aed' },
        { name: 'JWT',       devicon: '', symbol: '⊕', color: '#06b6d4' },
        { name: 'CI/CD',     devicon: '', symbol: '↻', color: '#a78bfa' }
      ]
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Group blocks scroll in with 3D flip
    document.querySelectorAll('.group-block').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 60, rotateX: -15, transformPerspective: 800 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 0.7, ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // Skill cards stagger inside each group
    document.querySelectorAll('.group-block').forEach((block) => {
      const cards = block.querySelectorAll('.skill-card');
      gsap.fromTo(cards,
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: 0.4, stagger: 0.06, ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: block,
            start: 'top 82%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // Vanilla-tilt on skill cards only (inner cards)
    setTimeout(() => {
      const cards = document.querySelectorAll<HTMLElement>('.skill-card');
      VanillaTilt.init(Array.from(cards), {
        max: 18,
        speed: 300,
        glare: true,
        'max-glare': 0.2,
        scale: 1.08,
        perspective: 500
      });
    }, 1000);
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
