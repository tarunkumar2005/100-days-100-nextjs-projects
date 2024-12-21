import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata = {
  title: 'AI Form Builder',
  description: 'Build forms with AI assistance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}