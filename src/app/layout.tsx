import type { Metadata } from 'next';
import Header from '@/components/Header/Header';
import '@/styles/index.css';

export const metadata: Metadata = {
	title: 'Test',
	description: 'Testing test',
	metadataBase: new URL("https://woolfftest.netlify.app/"),
    openGraph: {
        type: "website",
        url: "https://woolfftest.netlify.app/",
        title: "Test",
        description: "Testing test",
        locale: "en_US",
    },
    alternates: {
        canonical: "/",
    },
    icons: {
        icon: "/assets/icons/favicon.ico",
    },
};

const RootLayout: React.FC<{children?: React.ReactNode}> = ({children}) => {
  return (
    <html lang='en'>
      <body>
        <Header />
          <main>
            {children}
          </main>
      </body>
    </html>
  )
};

export default RootLayout;