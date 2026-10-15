import { Raleway, Open_Sans } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';
import HideOnDashboard from "@/components/HideOnDashboard";



const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-raleway',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});


const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-open-sans',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata = {
  title: 'MediCore Hospital - Quality Healthcare Services',
  description: 'Leading healthcare provider offering comprehensive medical services, expert doctors, and state-of-the-art facilities.',
  keywords: ['hospital', 'healthcare', 'doctors', 'medical', 'clinic', 'health services'],
  openGraph: {
    title: 'MediCore Hospital - Quality Healthcare Services',
    description: 'Leading healthcare provider with expert doctors and modern facilities',
    url: 'https://medicore-hospital.com',
    siteName: 'MediCore Hospital',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MediCore Hospital',
      },
    ],
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${raleway.variable} ${openSans.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#007b7f" />
        <link rel="icon" href="/favicon.ico" />
      </head>
            <body>
        <HideOnDashboard><Header /></HideOnDashboard>
        {children}
        <HideOnDashboard><Footer /></HideOnDashboard>
      </body>
    </html>
  );
}
