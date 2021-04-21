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
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss'

type Episode = {
  id: string,
  title: string,
  thumbnail: string,
  description: string,
  members: string,
  duration: number;
  durationAsString: string,
  url: string,
  publishedAt: string
}

type HomeProps = {
  latestEpisodes: Episode[],
  allEpisodes: Episode[],
}
export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        {/* o for it apenas percorre, o map percore e retorna */}
        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <a href="">{episode.title}</a>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}></section>
    </div>
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

  //format data before of return to component
  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      thumbnail: episode.thumbnail,
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    }
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8 //seg * min * hora => execute 3 vezes por dia
  }
}