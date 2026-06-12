import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TimelineItem {
  year: string;
  event: string;
  detail: string;
  active?: boolean;
}

interface Stat {
  value: number;
  label: string;
  current: number;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit, OnDestroy {

  // ── ORDER FIXED: BS before First Internship ──
  timelineItems: TimelineItem[] = [
    { year: '2022', event: 'Started Programming',      detail: 'Began with ICS — fell in love with building things' },
    { year: '2024', event: 'BS Software Engineering',  detail: 'Enrolled at Superior University Lahore, CGPA 3.99' },
    { year: '2023', event: 'First Internship',          detail: 'Asian Solution — built CCTV GuardAI, a real production product' },
    { year: '2024', event: 'Joined Apexcify',           detail: 'Full Stack — Angular + Python at Apexcify Technologies' },
    { year: '2024', event: 'Joined Decode Labs',        detail: 'AI Developer — NLP & intelligent automation' },
    { year: 'Now',  event: 'AI + Full Stack',           detail: 'Building at the intersection of AI and Full Stack development', active: true }
  ];

  stats: Stat[] = [
    { value: 3,    label: 'Active Internships', current: 0 },
    { value: 4,    label: 'Deployed Projects',  current: 0 },
    { value: 3.99, label: 'CGPA',               current: 0 }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initScrollAnimations();
  }

  private initScrollAnimations(): void {
    // ── Each timeline item: 3D scroll reveal ──
    // Every item gets its own ScrollTrigger so it animates IN when
    // scrolling down and OUT (reverses) when scrolling back up
    document.querySelectorAll('.timeline-item').forEach((el, i) => {
      gsap.fromTo(el,
        {
          opacity: 0,
          x: -50,
          rotateY: -25,
          transformPerspective: 600,
          transformOrigin: 'left center'
        },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 0.55,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            end: 'top 30%',
            // toggleActions: onEnter onLeave onEnterBack onLeaveBack
            // 'play reverse play reverse' = animates in on scroll down,
            // reverses out when scrolled back up — the "loop" effect
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // Right bio slides in/out
    gsap.fromTo('.about-bio',
      { opacity: 0, x: 50 },
      {
        opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-bio',
          start: 'top 85%',
          toggleActions: 'play reverse play reverse'
        }
      }
    );

    // Stats count-up (once only)
    this.stats.forEach((stat) => {
      ScrollTrigger.create({
        trigger: '.stats-grid',
        start: 'top 85%',
        once: true,
        onEnter: () => this.countUp(stat)
      });
    });
  }

  private countUp(stat: Stat): void {
    const steps = 60;
    const increment = stat.value / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const current = Math.min(increment * step, stat.value);
      stat.current = parseFloat(current.toFixed(stat.value % 1 !== 0 ? 2 : 0));
      if (step >= steps) {
        stat.current = stat.value;
        clearInterval(timer);
      }
    }, 30);
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
