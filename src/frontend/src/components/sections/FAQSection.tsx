import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useInView } from '../../lib/useInView';
import Section from '../primitives/Section';

const faqs = [
  {
    question: 'Is this really anonymous?',
    answer: 'Yes, completely. MindVault does not collect, store, or require any identifying information. No email, no phone number, no name. Your conversations are encrypted and not tied to any personal identity. Even if you choose to connect with a therapist, you control what information you share and when.'
  },
  {
    question: 'When will I talk to a real person?',
    answer: 'You decide. The AI companion is available immediately for support, guidance, and self-regulation tools. If you feel you would benefit from speaking with a licensed therapist, the AI can facilitate that connection at any time. There is no pressure—you move at your own pace.'
  },
  {
    question: 'What if I am in crisis?',
    answer: 'If you are experiencing a mental health emergency, MindVault will recognize the urgency and immediately provide crisis resources, including hotlines and emergency services. The AI is designed to detect crisis indicators and prioritize your immediate safety above all else.'
  },
  {
    question: 'How does the AI understand what I am feeling?',
    answer: 'The AI uses advanced natural language processing to recognize emotional patterns, context, and intensity in what you share. It is trained on empathetic communication and mental health frameworks, but it is not a replacement for human care—it is a bridge to help you understand yourself and access the right support.'
  },
  {
    question: 'Can my employer see my conversations?',
    answer: 'No. Even if your organization provides access to MindVault as a benefit, your conversations remain completely private. Employers receive only anonymized, aggregated insights about overall wellbeing trends—never individual data or identifiable information.'
  },
  {
    question: 'What makes this different from other mental health apps?',
    answer: 'MindVault prioritizes anonymity from the first interaction. Many apps require accounts and collect data. We do not. We also focus on emotional triage—understanding the severity and nature of what you are experiencing—so we can guide you to the most appropriate support, whether that is self-help tools or professional care.'
  }
];

export default function FAQSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <Section
      ref={ref}
      eyebrow="FAQ"
      title="Questions you might have"
      description="Clear answers about how MindVault works"
      className={`transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      aria-label="Frequently asked questions"
    >
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glass-card px-6 border-0"
            >
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-accent transition-colors py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
