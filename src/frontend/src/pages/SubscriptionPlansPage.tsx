import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Footer from "../components/layout/Footer";
import GoBackButton from "../components/navigation/GoBackButton";
import GlassCard from "../components/primitives/GlassCard";
import Section from "../components/primitives/Section";

interface SubscriptionPlansPageProps {
  onGoBack: () => void;
}

interface PricingPlan {
  name: string;
  price: string;
  sessions: string;
  duration: string;
  features: string[];
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: "Single Session",
    price: "₹200",
    sessions: "1 session",
    duration: "One-time",
    features: [
      "One 60-minute session",
      "Confidential and secure",
      "Professional therapist",
      "Flexible scheduling",
    ],
  },
  {
    name: "Monthly Plan",
    price: "₹800",
    sessions: "4 sessions",
    duration: "Per month",
    features: [
      "Four 60-minute sessions",
      "Weekly support",
      "Progress tracking",
      "Priority scheduling",
      "Continuity with same therapist",
    ],
    popular: true,
  },
  {
    name: "Quarterly Plan",
    price: "₹1,600",
    sessions: "12 sessions",
    duration: "Over 3 months",
    features: [
      "Twelve 60-minute sessions",
      "Comprehensive support",
      "Regular progress reviews",
      "Priority scheduling",
      "Dedicated therapist",
      "Best value per session",
    ],
  },
];

export default function SubscriptionPlansPage({
  onGoBack,
}: SubscriptionPlansPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Go back button */}
      <div className="fixed top-4 left-4 z-50">
        <GoBackButton onGoBack={onGoBack} />
      </div>

      <div className="flex-grow">
        <Section
          eyebrow="Pricing"
          title="Subscription Plans"
          description="Choose the plan that works best for you. All plans include professional support and complete confidentiality."
        >
          {/* Free first session callout */}
          <Alert className="mb-12 max-w-3xl mx-auto bg-accent/10 border-accent">
            <Check className="h-5 w-5 text-accent" />
            <AlertTitle className="text-lg font-semibold text-foreground">
              Your first session is entirely free
            </AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Experience the support you deserve with no commitment. Start your
              journey to better mental health today.
            </AlertDescription>
          </Alert>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <GlassCard
                key={plan.name}
                className={`p-8 flex flex-col ${
                  plan.popular ? "ring-2 ring-accent shadow-xl" : ""
                }`}
              >
                {plan.popular && (
                  <div className="mb-4 -mt-4 -mx-4 px-4 py-2 bg-accent/20 text-accent text-sm font-semibold text-center rounded-t-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {plan.duration}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {plan.sessions}
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  Get Started
                </Button>
              </GlassCard>
            ))}
          </div>

          {/* Additional information */}
          <div className="mt-16 max-w-3xl mx-auto text-center space-y-4">
            <p className="text-muted-foreground">
              All sessions are conducted by licensed professionals in a secure,
              confidential environment.
            </p>
            <p className="text-sm text-muted-foreground">
              Need help choosing? Contact us and we'll help you find the right
              plan for your needs.
            </p>
          </div>
        </Section>
      </div>

      <Footer />
    </div>
  );
}
