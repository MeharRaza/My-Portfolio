import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

// ─────────────────────────────────────────────────────────────────────────────
//  HOW TO SET UP (one-time):
//  1. Go to https://www.emailjs.com/ and create a free account
//  2. Add an Email Service (Gmail recommended) → copy the Service ID below
//  3. Create an Email Template with these variables:
//       {{from_name}}  {{from_email}}  {{subject}}  {{message}}  {{to_email}}
//     Copy the Template ID below
//  4. Go to Account → API Keys → copy your Public Key below
//  Done — form submissions will land in meharraza371@gmail.com
// ─────────────────────────────────────────────────────────────────────────────

const EMAILJS_SERVICE_ID  = 'service_qx8vwno';
const EMAILJS_TEMPLATE_ID = 'template_8y2edea';
const EMAILJS_PUBLIC_KEY  = '99TIT3cJsbc2k8Zfa';

@Injectable({ providedIn: 'root' })
export class EmailJsService {
  private initialized = false;

  private init(): void {
    if (!this.initialized) {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      this.initialized = true;
    }
  }

  async send(params: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<void> {
    this.init();

    // ── 1. EmailJS — primary (unchanged) ──
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name:  params.name,
      from_email: params.email,
      subject:    params.subject || '(No subject)',
      message:    params.message,
      to_email:   'meharraza371@gmail.com'
    });

    // ── 2. n8n Webhook — fires after EmailJS, silently fails if error ──
    try {
      fetch('https://asiansol.app.n8n.cloud/webhook-test/emailjs-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    params.name,
          email:   params.email,
          phone:   '',              // not collected in form, kept for n8n schema
          message: params.message,
          subject: params.subject || '(No subject)'
        })
      }).catch(() => {
        // Webhook failure is silent — EmailJS already succeeded above
      });
    } catch {
      // Extra safety — EmailJS result is unaffected
    }
  }
}
