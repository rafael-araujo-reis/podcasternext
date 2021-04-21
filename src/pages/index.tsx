/**
 * Modelo SPA:
 * useEffect react => executa algo, sempre que ocorra algo na aplicacao
 *    useEffect(() => {}, [variavel]) //ocorre sempre que o componente mudar
 * *    useEffect(() => {}, []) //ocorre apenas na primeira execução do componente
 * 
 * // carregamento após (via javascript do browser)
 *   useEffect(() => {
    fetch('http://localhost:3333/episodes')
      .then(response => response.json())
      .then(data => console.log('episodes: ', data))
  }, []);
 */

import { useEffect } from "react";


export default function Home(props) {
  // useEffect(() => {
  //   fetch('http://localhost:3333/episodes')
  //     .then(response => response.json())
  //     .then(data => console.log('episodes: ', data))
  // }, []);

  console.log(props.episodes)

  return (
    <>
      < h1 > Hello World</h1 >
      <p>{JSON.stringify(props.episodes)}</p>
    </>
  );
}

/**
 * Modelo SSR:
 * Essa solução carrega a cada execução da página.. isso pode gerar requests sem necessidades
 */
//exportando essa função, a pagina sabe que deve executar antes de exibir para o usuario
// export async function getServerSideProps() {
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json()

//   return {
//     props: {
//       episodes: data,
//     }
//   }
// }

/**
 * Modelo SSG:
 * Será executado uma primeira vez e servirá para todos os demais usuários, evitando requests desnecessárias
 */
export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8 //seg * min * hora => execute 3 vezes por dia
  }
}