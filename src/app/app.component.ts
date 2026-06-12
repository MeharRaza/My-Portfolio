import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { TechStackComponent } from './components/tech-stack/tech-stack.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { RoadmapComponent } from './components/roadmap/roadmap.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { FloatingActionsComponent } from './components/floating-actions/floating-actions.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    TechStackComponent,
    ExperienceComponent,
    ProjectsComponent,
    RoadmapComponent,
    ContactComponent,
    FooterComponent,
    FloatingActionsComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <main>
      <app-hero></app-hero>
      <app-about></app-about>
      <app-tech-stack></app-tech-stack>
      <app-experience></app-experience>
      <app-projects></app-projects>
      <app-roadmap></app-roadmap>
      <app-contact></app-contact>
    </main>
    <app-footer></app-footer>
    <!-- Floating WhatsApp + Resume buttons -->
    <app-floating-actions></app-floating-actions>
  `,
  styles: [`
    main {
      position: relative;
      z-index: 1;
    }
  `]
})
export class AppComponent {}
