import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useInView } from "@/lib/useInView";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const faqs = [
  {
    question: "Is MindVault really anonymous?",
    answer:
      "Yes, MindVault is designed with anonymity at its core. You can use the platform without providing any personal information. All conversations are encrypted end-to-end, and we never track or store identifying data.",
  },
  {
    question: "How does the AI analysis work?",
    answer:
      "Our AI uses natural language processing to analyze your messages and detect emotional patterns. It provides immediate insights and reassurance based on your mood. However, all AI analysis is reviewed by licensed therapists to ensure accuracy and safety.",
  },
  {
    question: "Can I talk to a real therapist?",
    answer:
      "Absolutely. While our AI provides immediate support, you can request a session with a licensed therapist at any time. We believe in a blended care model that combines AI efficiency with human expertise.",
  },
  {
    question: "What if I am in crisis?",
    answer:
      "If you are experiencing a mental health crisis, please call your local emergency services or a crisis hotline immediately. MindVault is designed for ongoing support and is not a substitute for emergency care.",
  },
  {
    question: "How much does MindVault cost?",
    answer:
      "Your first session is completely free. After that, we offer flexible pricing plans starting at ₹200 for a single session, ₹800 for 4 sessions per month, or ₹1,600 for 12 sessions over 3 months.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we use military-grade end-to-end encryption to protect all your data. Your conversations are encrypted on your device before being stored, and we never sell or share your information with third parties. We are HIPAA-compliant and follow the highest security standards.",
  },
];

export default function FAQSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="faq-section"
      ref={ref}
      className="py-24 px-4"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.13 0.05 45) 0%, oklch(0.11 0.04 260) 60%, oklch(0.12 0.04 260) 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="text-center mb-12"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(20px)",
            transition: prefersReducedMotion
              ? "none"
              : "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <p
            className="font-semibold mb-2 uppercase tracking-wide text-sm"
            style={{ color: "oklch(0.78 0.18 70)" }}
          >
            FAQ
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.18 70), oklch(0.68 0.22 28))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-lg" style={{ color: "oklch(0.75 0.06 270)" }}>
            Everything you need to know about MindVault
          </p>
        </div>

        <div
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(20px)",
            transition: prefersReducedMotion
              ? "none"
              : "opacity 0.6s ease-out 200ms, transform 0.6s ease-out 200ms",
          }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="rounded-lg px-6"
                style={{
                  background: "oklch(0.17 0.05 260 / 0.8)",
                  border: "1px solid oklch(0.28 0.06 260)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <AccordionTrigger
                  className="text-left transition-colors"
                  style={{ color: "oklch(0.95 0.01 240)" }}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent style={{ color: "oklch(0.80 0.05 270)" }}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
