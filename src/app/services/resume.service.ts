import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  async download(): Promise<void> {
    try {
      // Fetch as ArrayBuffer
      const res = await fetch('/assets/Husnain-Raza-CV.pdf');
      if (!res.ok) throw new Error(`${res.status}`);
      const buffer = await res.arrayBuffer();

      // Use octet-stream so browser NEVER tries to open — always saves to disk
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      const url  = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href     = url;
      a.download = 'Husnain-Raza-CV.pdf';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);

    } catch {
      // Last resort fallback
      const a = document.createElement('a');
      a.href     = '/assets/Husnain-Raza-CV.pdf';
      a.download = 'Husnain-Raza-CV.pdf';
      a.target   = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
}
