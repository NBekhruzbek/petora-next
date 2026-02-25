import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  console.log("DOCUMENT - PAGES ROUTER");
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="title" content="Petora-next" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" type="img/png" href="/img/logo/Favicon.png" />

        {/* SEO */}
        <meta
          name="keyword"
          content={
            "petora, pet, pet.uz, pet.kr, pets.kr, pets, pets.uz, petcare, mern nestjs fullstack"
          }
        />
        <meta
          name="description"
          content={
            "Buy pet products and Use pet services anywhere anytime in South Korea. | " +
            "Покупайте товары для домашних животных и пользуйтесь услугами для животных в любом месте и в любое время в Южной Кореи. | " +
            "한국 어디에서든 반려동물 용품을 구매하고 반려동물 서비스를 이용하세요."
          }
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
