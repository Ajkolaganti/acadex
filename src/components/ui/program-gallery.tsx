"use client";

import { ArrowLeft, ArrowRight, ExternalLink, Clock, DollarSign, Award } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

import { ShadcnButton } from "@/components/ui/shadcn-button";
import {
  ShadcnCarousel,
  CarouselApi,
  ShadcnCarouselContent,
  ShadcnCarouselItem,
} from "@/components/ui/shadcn-carousel";
import { Program } from "@/types";

export interface ProgramGalleryProps {
  title?: string;
  description?: string;
  programs: Program[];
  onProgramClick?: (program: Program) => void;
}

const ProgramGallery = ({
  title = "University Programs",
  description = "Discover and compare university programs from top institutions worldwide. Find your perfect match with our AI-powered recommendations.",
  programs,
  onProgramClick
}: ProgramGalleryProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  const handleProgramClick = (program: Program) => {
    if (onProgramClick) {
      onProgramClick(program);
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-medium md:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="max-w-lg text-muted-foreground">{description}</p>
          </div>
          <div className="hidden shrink-0 gap-2 md:flex">
            <ShadcnButton
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </ShadcnButton>
            <ShadcnButton
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </ShadcnButton>
          </div>
        </div>
      </div>
      <div className="w-full">
        <ShadcnCarousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <ShadcnCarouselContent className="ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
            {programs.map((program) => (
              <ShadcnCarouselItem
                key={program.id}
                className="max-w-[320px] pl-[20px] lg:max-w-[360px]"
              >
                <div
                  className="group rounded-xl cursor-pointer"
                  onClick={() => handleProgramClick(program)}
                >
                  <div className="group relative h-full min-h-[32rem] max-w-full overflow-hidden rounded-xl glass-card">
                    <img
                      src={program.university.images?.[0] || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center"}
                      alt={`${program.university.name} campus`}
                      className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 h-full bg-[linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.4),rgba(0,0,0,0.8)_100%)]" />

                    {/* Degree Level Badge */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium uppercase">
                        {program.degree_level}
                      </span>
                      {program.scholarships_available && (
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Scholarships Available
                        </span>
                      )}
                    </div>

                    {/* University Logo */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <img
                        src={program.university.logo || "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100&h=100&fit=crop&crop=center"}
                        alt={program.university.name}
                        className="w-8 h-8 object-contain rounded-full"
                      />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-white">
                      <div className="mb-3 text-xl font-semibold line-clamp-2">
                        {program.title}
                      </div>

                      <div className="mb-2 text-sm opacity-90 flex items-center gap-1">
                        <span className="font-medium">{program.university.name}</span>
                        <span>•</span>
                        <span>{program.university.city}, {program.university.country}</span>
                      </div>

                      <div className="mb-4 text-sm opacity-80 line-clamp-2">
                        {program.description}
                      </div>

                      {/* Program Details */}
                      <div className="w-full space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>${program.tuition_usd?.toLocaleString()}/year</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{Math.round(program.duration_months / 12)} years</span>
                          </div>
                        </div>

                        {program.application_deadline && (
                          <div className="flex items-center gap-2 text-sm">
                            <Award className="h-4 w-4" />
                            <span>Deadline: {new Date(program.application_deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center text-sm font-medium">
                        View Details
                        <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </ShadcnCarouselItem>
            ))}
          </ShadcnCarouselContent>
        </ShadcnCarousel>
        <div className="mt-8 flex justify-center gap-2">
          {programs.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-primary" : "bg-primary/20"
              }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { ProgramGallery };