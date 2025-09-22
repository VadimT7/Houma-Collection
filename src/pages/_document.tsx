import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="description" content="HOUMA - Luxury streetwear rooted in North African culture. Where heritage meets modern edge." />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/Resources/Logos-and-Images/Logo-White-No-Background.png" />
        <link rel="shortcut icon" type="image/png" href="/Resources/Logos-and-Images/Logo-White-No-Background.png" />
        <link rel="apple-touch-icon" href="/Resources/Logos-and-Images/Logo-White-No-Background.png" />
      </Head>
      <body className="bg-houma-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
