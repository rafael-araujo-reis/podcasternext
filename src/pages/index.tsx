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

import { GetStaticProps } from 'next'
import { api } from '../services/api';

type Episode = {
  id: string,
  title: string,
  members: string,
  // published_at: string,
  // thumbnail: string,
  // description: string,
  // file: {
  //   url: string,
  //   type: string,
  //   duration: number;
  // }
}

type HomeProps = {
  episodes: Episode[];
}
export default function Home(props: HomeProps) {
  return (
    <>
      < h1 > Hello World</h1 >
      <p>{JSON.stringify(props.episodes)}</p>
    </>
  );
}

/**
 * Modelo SSG:
 * Será executado uma primeira vez e servirá para todos os demais usuários, evitando requests desnecessárias
 */
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8 //seg * min * hora => execute 3 vezes por dia
  }
}