'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Carousel, CarouselItem } from '@/components/ui/Carousel';
import {
  Code,
  Stethoscope,
  Building,
  Palette,
  Calculator,
  Globe,
  Users,
  Atom,
  ArrowRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';

const categories = [
  {
    icon: Code,
    title: 'Computer Science',
    description: 'Software engineering, AI, cybersecurity',
    count: '2,500+ programs',
    href: '/programs?discipline=Computer%20Science',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    icon: Stethoscope,
    title: 'Medicine & Health',
    description: 'Medical degrees, nursing, public health',
    count: '1,200+ programs',
    href: '/programs?discipline=Medicine',
    gradient: 'from-red-500 to-pink-600'
  },
  {
    icon: Building,
    title: 'Business & Management',
    description: 'MBA, finance, entrepreneurship',
    count: '3,000+ programs',
    href: '/programs?discipline=Business%20Administration',
    gradient: 'from-green-500 to-teal-600'
  },
  {
    icon: Calculator,
    title: 'Engineering',
    description: 'Mechanical, civil, electrical engineering',
    count: '2,800+ programs',
    href: '/programs?discipline=Engineering',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    icon: Palette,
    title: 'Arts & Design',
    description: 'Fine arts, graphic design, architecture',
    count: '800+ programs',
    href: '/programs?discipline=Art%20%26%20Design',
    gradient: 'from-purple-500 to-indigo-600'
  },
  {
    icon: Atom,
    title: 'Science & Research',
    description: 'Physics, chemistry, biology, research',
    count: '1,500+ programs',
    href: '/programs?discipline=Physics',
    gradient: 'from-cyan-500 to-blue-600'
  },
  {
    icon: Users,
    title: 'Social Sciences',
    description: 'Psychology, sociology, anthropology',
    count: '900+ programs',
    href: '/programs?discipline=Psychology',
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    icon: Globe,
    title: 'International Studies',
    description: 'Global affairs, diplomacy, languages',
    count: '600+ programs',
    href: '/programs?discipline=International%20Relations',
    gradient: 'from-emerald-500 to-green-600'
  }
];

export default function FeaturedCategories() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-xl"
          animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Popular Categories</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Explore Programs by{' '}
            <span className="gradient-text relative">
              Category
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-purple-500" />
              </motion.div>
            </span>
          </h2>

          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Browse thousands of programs across popular fields of study.
            Find your passion and start your educational journey today.
          </motion.p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-8 mb-16">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={category.href} className="group block">
                  <motion.div
                    className="card-modern p-8 h-full relative overflow-hidden"
                    whileHover={{
                      y: -8,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Background Pattern */}
                    <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${category.gradient}`} />

                    <div className="relative flex flex-col items-center text-center space-y-6">
                      {/* Icon with enhanced styling */}
                      <motion.div
                        className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-xl relative`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="h-10 w-10 text-white" />
                        <motion.div
                          className="absolute inset-0 rounded-3xl bg-white/20"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>

                      {/* Content */}
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {category.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm font-bold text-blue-600">
                            {category.count}
                          </span>
                          <div className="w-1 h-1 rounded-full bg-blue-600" />
                          <span className="text-xs text-gray-500">Available</span>
                        </div>
                      </div>

                      {/* Hover indicator */}
                      <motion.div
                        className="flex items-center gap-2 text-blue-600 font-medium"
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-sm">Explore</span>
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile/Tablet Carousel */}
        <div className="lg:hidden mb-12">
          <Carousel
            autoplay={true}
            delay={5000}
            slidesToShow={1}
            className="px-4"
          >
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <CarouselItem key={index}>
                  <Link href={category.href} className="group block">
                    <motion.div
                      className="card-modern p-8 mx-2 relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${category.gradient}`} />

                      <div className="relative flex flex-col items-center text-center space-y-6">
                        <motion.div
                          className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-xl`}
                          whileHover={{ scale: 1.1 }}
                        >
                          <Icon className="h-10 w-10 text-white" />
                        </motion.div>

                        <div className="space-y-3">
                          <h3 className="text-xl font-bold text-gray-900">
                            {category.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {category.description}
                          </p>
                          <span className="text-sm font-bold text-blue-600">
                            {category.count}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </CarouselItem>
              );
            })}
          </Carousel>
        </div>

        {/* Enhanced CTA Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <Link href="/programs">
            <motion.button
              className="btn-modern px-10 py-4 text-lg flex items-center gap-3 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="h-5 w-5" />
              View All Programs
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}