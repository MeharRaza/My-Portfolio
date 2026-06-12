import {
  Component,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  NgZone,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import * as THREE from 'three';
import Typed from 'typed.js';
import { ResumeService } from '../../services/resume.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animFrameId!: number;
  private typedHeadline!: Typed;
  private typedRole!: Typed;
  private mouseX = 0;
  private mouseY = 0;
  private particles!: THREE.Points;
  private linesMesh!: THREE.LineSegments;
  private geo1!: THREE.Mesh;
  private geo2!: THREE.Mesh;
  private geo3!: THREE.Mesh;
  private resizeObserver!: ResizeObserver;
  private mouseMoveHandler!: (e: MouseEvent) => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private resumeService: ResumeService
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => {
      this.initThree();
      this.initTyped();
      this.animateEntrance();
    }, 100);
  }

  // ─── Three.js ────────────────────────────────────────────────────────────
  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, w / h, 0.1, 1000);
    this.camera.position.set(0, 0, 60);

    this.buildParticles();
    this.buildConnections();
    this.buildGeometries();

    this.mouseMoveHandler = this.onMouseMove.bind(this);
    window.addEventListener('mousemove', this.mouseMoveHandler);

    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(canvas);

    this.ngZone.runOutsideAngular(() => this.renderLoop());
  }

  private buildParticles(): void {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      const t = Math.random();
      colors[i * 3]     = 0.48 + t * (0.024 - 0.48);
      colors[i * 3 + 1] = 0.23 + t * (0.71 - 0.23);
      colors[i * 3 + 2] = 0.93 + t * (0.83 - 0.93);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  private buildConnections(): void {
    const subset = 250;
    const positions = (this.particles.geometry.attributes['position'] as THREE.BufferAttribute).array as Float32Array;
    const linePositions: number[] = [];
    const threshold = 18;

    for (let i = 0; i < subset; i++) {
      const ax = positions[i * 3], ay = positions[i * 3 + 1], az = positions[i * 3 + 2];
      for (let j = i + 1; j < subset; j++) {
        const bx = positions[j * 3], by = positions[j * 3 + 1], bz = positions[j * 3 + 2];
        const dist = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2);
        if (dist < threshold) {
          linePositions.push(ax, ay, az, bx, by, bz);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));

    const mat = new THREE.LineBasicMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.12
    });

    this.linesMesh = new THREE.LineSegments(geo, mat);
    this.scene.add(this.linesMesh);
  }

  private buildGeometries(): void {
    const icoGeo = new THREE.IcosahedronGeometry(18, 1);
    const icoMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.06 });
    this.geo1 = new THREE.Mesh(icoGeo, icoMat);
    this.geo1.position.set(-40, 15, -30);
    this.scene.add(this.geo1);

    const torusGeo = new THREE.TorusGeometry(14, 3, 8, 30);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.06 });
    this.geo2 = new THREE.Mesh(torusGeo, torusMat);
    this.geo2.position.set(45, -10, -40);
    this.scene.add(this.geo2);

    const octGeo = new THREE.OctahedronGeometry(16);
    const octMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.06 });
    this.geo3 = new THREE.Mesh(octGeo, octMat);
    this.geo3.position.set(10, 30, -50);
    this.scene.add(this.geo3);
  }

  private renderLoop(): void {
    this.animFrameId = requestAnimationFrame(() => this.renderLoop());
    const t = Date.now() * 0.0003;

    this.particles.rotation.y = t * 0.05;
    this.particles.rotation.x = t * 0.02;
    this.linesMesh.rotation.y = t * 0.05;
    this.linesMesh.rotation.x = t * 0.02;

    this.particles.rotation.y += this.mouseX * 0.00015;
    this.particles.rotation.x += this.mouseY * 0.00015;

    this.geo1.rotation.x += 0.003;
    this.geo1.rotation.y += 0.004;
    this.geo2.rotation.x += 0.002;
    this.geo2.rotation.z += 0.003;
    this.geo3.rotation.y += 0.005;
    this.geo3.rotation.x += 0.002;

    this.camera.position.x += (this.mouseX * 0.006 - this.camera.position.x) * 0.04;
    this.camera.position.y += (-this.mouseY * 0.004 - this.camera.position.y) * 0.04;
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
  }

  private onMouseMove(e: MouseEvent): void {
    this.mouseX = e.clientX - window.innerWidth / 2;
    this.mouseY = e.clientY - window.innerHeight / 2;
  }

  private onResize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  // ─── Typed.js — role cycling ─────────────────────────────────────────────
  private initTyped(): void {
    // Role line (smaller, below name)
    this.typedRole = new Typed('#typed-role', {
      strings: [
        'Full Stack Developer',
        'AI Engineer',
        'Angular Specialist',
        'Python Developer',
        'Problem Solver'
      ],
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 1800,
      loop: true,
      showCursor: true,
      cursorChar: '|'
    });

    // Dynamic headline — cycles 2 big statements
    this.typedHeadline = new Typed('#typed-headline', {
      strings: [
        'Building Intelligent<br>Digital Experiences',
        'Shipping Real Products<br>for Real Clients',
        'From Idea to<br>Production — Fast'
      ],
      typeSpeed: 45,
      backSpeed: 20,
      backDelay: 2800,
      loop: true,
      showCursor: false,
      contentType: 'html'
    });
  }

  // ─── GSAP Entrance ───────────────────────────────────────────────────────
  private animateEntrance(): void {
    const tl = gsap.timeline({ delay: 0.4 });

    tl.fromTo('.hero-canvas',
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
    .fromTo('.hero-photo-wrap',
      { opacity: 0, x: -60, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo('.hero-eyebrow',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      '-=0.5'
    )
    .fromTo('.hero-greeting',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo('.hero-headline-wrap',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo('.hero-role-line',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
      '-=0.2'
    )
    .fromTo('.hero-subtitle',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
      '-=0.2'
    )
    .fromTo('.hero-typed',
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
      '-=0.1'
    )
    .fromTo('.hero-ctas',
      { opacity: 0, scale: 0.88 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' },
      '-=0.1'
    )
    .fromTo('.hero-stats',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
      '-=0.1'
    );
  }

  scrollToProjects(e: Event): void {
    e.preventDefault();
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToContact(e: Event): void {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  downloadResume(): void {
    this.resumeService.download();
  }

  ngOnDestroy(): void {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.typedRole) this.typedRole.destroy();
    if (this.typedHeadline) this.typedHeadline.destroy();
    if (this.renderer) this.renderer.dispose();
    if (this.resizeObserver) this.resizeObserver.disconnect();
    window.removeEventListener('mousemove', this.mouseMoveHandler);
  }
}
