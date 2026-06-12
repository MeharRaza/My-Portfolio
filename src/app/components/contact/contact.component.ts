import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EmailJsService } from '../../services/emailjs.service';

gsap.registerPlugin(ScrollTrigger);

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements AfterViewInit, OnDestroy {
  form: ContactForm = { name: '', email: '', subject: '', message: '' };
  loading = false;
  submitted = false;
  error = '';

  contactLinks = [
    {
      icon: 'mail',
      label: 'meharraza371@gmail.com',
      href: 'mailto:meharraza371@gmail.com',
      ariaLabel: 'Email Husnain'
    },
    {
      icon: 'phone',
      label: '+92 313-7202227',
      href: 'tel:+923137202227',
      ariaLabel: 'Call Husnain'
    },
    {
      icon: 'map-pin',
      label: 'Lahore, Pakistan',
      href: '#',
      ariaLabel: 'Location: Lahore, Pakistan'
    },
    {
      icon: 'github',
      label: 'github.com/MeharRaza',
      href: 'https://github.com/MeharRaza',
      ariaLabel: 'GitHub MeharRaza'
    }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private emailService: EmailJsService
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    gsap.fromTo('.contact-left',
      { opacity: 0, x: -50 },
      {
        opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-grid', start: 'top 80%', toggleActions: 'play none none none' }
      }
    );

    gsap.fromTo('.contact-right',
      { opacity: 0, x: 50 },
      {
        opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-grid', start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  }

  async onSubmit(): Promise<void> {
    this.error = '';

    if (!this.form.name.trim() || !this.form.email.trim() || !this.form.message.trim()) {
      this.error = 'Please fill in your name, email, and message.';
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.form.email)) {
      this.error = 'Please enter a valid email address.';
      return;
    }

    this.loading = true;

    try {
      await this.emailService.send({
        name:    this.form.name.trim(),
        email:   this.form.email.trim(),
        subject: this.form.subject.trim(),
        message: this.form.message.trim()
      });

      this.submitted = true;
      this.form = { name: '', email: '', subject: '', message: '' };
    } catch (err) {
      console.error('EmailJS error:', err);
      this.error = 'Failed to send message. Please email me directly at meharraza371@gmail.com';
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
