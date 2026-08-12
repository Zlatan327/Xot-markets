import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AppKitProvider } from '../context/AppKitProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-space' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  title: 'Xot Markets | Infrastructure',
  description: 'Sovereign AI Prediction Market Infrastructure.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable}`}>
        <AppKitProvider>
          {children}
        </AppKitProvider>
      </body>
    </html>
  );
}
