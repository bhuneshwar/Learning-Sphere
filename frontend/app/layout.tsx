import { Providers } from '@/src/providers';
import { Navbar } from '@/components/layout/Navbar';
import './globals.css';

export const metadata = {
  title: 'LearningSphere - Your Gateway to Smarter Learning',
  description: 'An interactive e-learning platform for students and educators',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
