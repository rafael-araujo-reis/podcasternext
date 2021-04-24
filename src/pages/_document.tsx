import Document, { Html, Head, Main, NextScript } from 'next/document'
/**
 *  utilizado para configurar o que ficara por volta de nossas paginas (customizado)
 *  o _document é carregado apenas uma vez
 * 
 *  utizado /> para fechar a tag link devido ao padrão do React
 *  */
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet" />
          <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}


