import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Our Lady of Assumption Church, Pallikkunnu | Parish Web Portal',
  description: 'Official Parish Portal of Our Lady of Assumption Church, Pallikkunnu, Varandarappilly, Thrissur. Holy Mass timings, Thirunal celebrations, pastoral clergy, and prayer petitions.',
  keywords: ['Assumption Church Pallikkunnu', 'Pallikkunnu Church', 'Varandarappilly', 'Thrissur Archdiocese', 'Holy Mass Timings', 'Thirunal', 'Swargarohana Matha'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased scroll-smooth`}
    >
      <body className={`${plusJakartaSans.className} min-h-full flex flex-col bg-slate-50/50 text-slate-900 font-sans selection:bg-sky-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
