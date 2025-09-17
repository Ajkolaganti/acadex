import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Acadex - Find Your Perfect University Program',
    template: '%s | Acadex'
  },
  description: 'Discover and compare universities and programs worldwide. Get AI-powered recommendations tailored to your academic goals and preferences.',
  keywords: [
    'university',
    'college',
    'programs',
    'education',
    'study abroad',
    'scholarships',
    'AI recommendations',
    'university comparison'
  ],
  authors: [{ name: 'Acadex Team' }],
  creator: 'Acadex',
  publisher: 'Acadex',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Acadex - Find Your Perfect University Program',
    description: 'Discover and compare universities and programs worldwide. Get AI-powered recommendations tailored to your academic goals and preferences.',
    siteName: 'Acadex',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Acadex - University Program Discovery Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acadex - Find Your Perfect University Program',
    description: 'Discover and compare universities and programs worldwide. Get AI-powered recommendations tailored to your academic goals and preferences.',
    images: ['/og-image.jpg'],
    creator: '@acadex',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}