"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckoutStepsProps {
  currentStep: number;
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { id: "cart", name: "Panier", href: "/cart" },
    { id: "checkout", name: "Informations", href: "/checkout" },
    { id: "payment", name: "Paiement", href: "/checkout/payment" },
    { id: "confirmation", name: "Confirmation", href: "/checkout/success" },
  ];

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="flex items-center">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={cn(
              index !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
              "relative flex-1"
            )}
          >
            {index < currentStep ? (
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
                <Check className="h-5 w-5 text-white" aria-hidden="true" />
                <span className="sr-only">{step.name}</span>
              </div>
            ) : index === currentStep ? (
              <div
                className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-600 bg-white"
                aria-current="step"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full bg-green-600"
                  aria-hidden="true"
                />
                <span className="sr-only">{step.name}</span>
              </div>
            ) : (
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                <span
                  className="h-2.5 w-2.5 rounded-full bg-transparent"
                  aria-hidden="true"
                />
                <span className="sr-only">{step.name}</span>
              </div>
            )}
            <div className="mt-2 hidden text-sm font-medium sm:block">
              {step.name}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
