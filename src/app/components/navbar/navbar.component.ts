import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ResumeService } from '../../services/resume.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isScrolled = signal(false);
  mobileOpen = signal(false);

  navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' }
  ];

  constructor(private resumeService: ResumeService) {}

  ngOnInit(): void {
    gsap.fromTo('.navbar',
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: 'power3.out' }
    );
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleMobile(): void {
    this.mobileOpen.update(v => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  scrollTo(href: string, event: Event): void {
    event.preventDefault();
    this.closeMobile();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  downloadResume(event: Event): void {
    event.preventDefault();
    this.resumeService.download();
  }

  ngOnDestroy(): void {}
}
