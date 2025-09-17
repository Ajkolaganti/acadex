import type { Metadata } from 'next';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import HowItWorks from '@/components/home/HowItWorks';

export const metadata: Metadata = {
  title: 'Find Your Perfect University Program',
  description: 'Discover and compare universities and programs worldwide. Get AI-powered recommendations tailored to your academic goals and preferences.',
  openGraph: {
    title: 'Acadex - Find Your Perfect University Program',
    description: 'Discover and compare universities and programs worldwide. Get AI-powered recommendations tailored to your academic goals and preferences.',
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acadex - Find Your Perfect University Program',
    description: 'Discover and compare universities and programs worldwide. Get AI-powered recommendations tailored to your academic goals and preferences.',
  },
};

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <FeaturedCategories />
      <HowItWorks />
    </Layout>
  );
}