import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Ease & Bloom — Women's Wellness Sanctuary",
  description: "A mindful, safe community web app for women's mental and physical health.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ease & Bloom',
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF7F5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bloom-bg text-bloom-text dark:bg-bloom-dark dark:text-bloom-darkText antialiased">
        {children}
      </body>
    </html>
  );
}
