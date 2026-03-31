import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  FileText,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";
import { useState } from "react";

const FAQS = [
  {
    q: "How do I cancel a booking?",
    a: "Go to My Bookings and click 'Cancel Booking' next to the event. Cancellations are processed within 24-48 hours.",
  },
  {
    q: "Can I transfer my ticket to someone else?",
    a: "Ticket transfers are available up to 24 hours before the event. Contact support with your booking ID to arrange a transfer.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major credit and debit cards, PayPal, and ICP tokens for blockchain-based payments.",
  },
  {
    q: "How will I receive my tickets?",
    a: "Tickets are emailed immediately after purchase and stored in your My Bookings page for easy access.",
  },
  {
    q: "What is the refund policy?",
    a: "Full refunds are available up to 7 days before the event. After that, we offer a 50% refund or a credit towards a future event.",
  },
];

export function Support() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-foreground mb-2">
        Support Center
      </h1>
      <p className="text-muted-foreground mb-12">How can we help you today?</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
        {[
          {
            icon: Mail,
            title: "Email Support",
            desc: "support@tickethub.ai",
            sub: "Response in 24 hours",
          },
          {
            icon: MessageSquare,
            title: "Live Chat",
            desc: "Chat with us",
            sub: "Available 9am–6pm EST",
          },
          {
            icon: Phone,
            title: "Phone Support",
            desc: "+1 (800) 555-TICKET",
            sub: "Mon–Fri, 9am–5pm EST",
          },
        ].map((c) => (
          <div
            key={c.title}
            className="rounded-xl border border-border bg-card p-6 flex flex-col gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <c.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{c.desc}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Frequently Asked
            Questions
          </h2>
          <div className="space-y-2">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
                  data-ocid="support.toggle"
                >
                  <span className="text-sm font-semibold text-foreground">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${openFaq === faq.q ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === faq.q && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground border-t border-border pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground mb-5">
            Send a Message
          </h2>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="support-name"
                  className="text-xs font-semibold text-muted-foreground mb-1.5 block"
                >
                  Your Name
                </Label>
                <Input
                  id="support-name"
                  placeholder="Full name"
                  className="bg-accent border-border"
                  data-ocid="support.input"
                />
              </div>
              <div>
                <Label
                  htmlFor="support-email"
                  className="text-xs font-semibold text-muted-foreground mb-1.5 block"
                >
                  Email Address
                </Label>
                <Input
                  id="support-email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-accent border-border"
                  data-ocid="support.input"
                />
              </div>
              <div>
                <Label
                  htmlFor="support-subject"
                  className="text-xs font-semibold text-muted-foreground mb-1.5 block"
                >
                  Subject
                </Label>
                <Input
                  id="support-subject"
                  placeholder="What is your question about?"
                  className="bg-accent border-border"
                  data-ocid="support.input"
                />
              </div>
              <div>
                <Label
                  htmlFor="support-message"
                  className="text-xs font-semibold text-muted-foreground mb-1.5 block"
                >
                  Message
                </Label>
                <Textarea
                  id="support-message"
                  placeholder="Describe your issue..."
                  rows={5}
                  className="bg-accent border-border resize-none"
                  data-ocid="support.textarea"
                />
              </div>
              <Button
                className="w-full bg-primary hover:bg-primary/90 font-semibold"
                data-ocid="support.submit_button"
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
