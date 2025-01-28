import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from 'sonner';
import ReduxTKLayout from './ReduxTKLayout';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'AIverse',
  description: 'Chatbot',
  icons: {
    icon: ['/favicon.ico?v=1'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png'],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster
          richColors
          position='top-center'
          toastOptions={{ duration: 4000 }}
        />

        <ReduxTKLayout> {children}</ReduxTKLayout>
      </body>
    </html>
  );
}
