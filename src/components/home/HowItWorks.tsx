'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Search, Brain, Heart, Plane } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Search & Discover',
    description: 'Use our powerful search engine to find programs that match your interests, budget, and academic background.',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
  },
  {
    icon: Brain,
    title: 'Get AI Recommendations',
    description: 'Our AI advisor analyzes your profile and preferences to suggest the best programs tailored just for you.',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400'
  },
  {
    icon: Heart,
    title: 'Compare & Shortlist',
    description: 'Save your favorite programs and compare them side-by-side to make informed decisions about your future.',
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400'
  },
  {
    icon: Plane,
    title: 'Apply & Succeed',
    description: 'Get guidance on applications, scholarships, and visa processes to turn your educational dreams into reality.',
    color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How <span className="gradient-text">Acadex</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform makes finding and applying to universities simple,
            personalized, and efficient. Here&apos;s how we help you succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="mb-6 mt-4">
                      <div className={`w-16 h-16 mx-auto rounded-2xl ${step.color} flex items-center justify-center`}>
                        <Icon className="h-8 w-8" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Connection Line (not for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-primary/60 to-primary/20"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-primary/10 text-primary rounded-full text-sm font-medium">
            🚀 Ready to start your journey? Get personalized recommendations now!
          </div>
        </div>
      </div>
    </section>
  );
}