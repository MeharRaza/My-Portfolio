import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ResumeService } from '../../services/resume.service';

@Component({
  selector: 'app-floating-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-actions.component.html',
  styleUrls: ['./floating-actions.component.scss']
})
export class FloatingActionsComponent implements AfterViewInit {
  @ViewChild('waBtn') waBtnRef!: ElementRef<HTMLElement>;

  readonly waNumber  = '923137202227';
  readonly waMessage = encodeURIComponent('Hi Husnain! 👋 I visited your portfolio and would love to connect.');

  get waLink(): string {
    return `https://wa.me/${this.waNumber}?text=${this.waMessage}`;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private resumeService: ResumeService
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    gsap.fromTo('.fab-container',
      { opacity: 0, y: 60, scale: 0.5 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: 1.5, ease: 'back.out(1.8)' }
    );

    gsap.to('.fab-wa', {
      y: -10, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });

    gsap.to('.fab-resume', {
      y: -8, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5
    });
  }

  downloadResume(): void {
    this.resumeService.download();
  }
}
