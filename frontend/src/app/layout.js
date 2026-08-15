import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Web3Provider } from '../context/Web3Context';
import { ToastProvider } from '../components/Toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-space' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  title: 'Xot Markets | Autonomous AI Agent Prediction Protocol',
  description: 'Trade on autonomous AI agent performance metrics, yield generation, and cross-DEX arbitrage with Aave yield compounding on X Layer.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable}`}>
        <Web3Provider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
