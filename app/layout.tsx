import type { Metadata } from 'next';
import { Playfair_Display, Lora } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sister Wendy — Art Guide',
  description: 'Contemplations on great paintings, offered in the voice of Sister Wendy Beckett.',
  openGraph: {
    title: 'Sister Wendy — Art Guide',
    description: 'Bring Sister Wendy a painting. She will tell you what it is really about.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${lora.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
