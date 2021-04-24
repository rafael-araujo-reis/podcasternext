/***
 * Cria-se uma pagina utilizando entre [] o nome que será utilizado na url
 * neste caso foi utilizado slug
 */
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss'
import { usePlayer } from '../../contexts/PlayerContext';

type Episode = {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  duration: number;
  durationAsString: string,
  description: string,
  url: string,
  publishedAt: string
}

type EpisodeProps = {
  episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();
  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title} | Podcaster</title>
      </Head>
      <div className={styles.thumbnailContainer}>

        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>

        <div className={styles.description}
          dangerouslySetInnerHTML={{ __html: episode.description }} />
      </header>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {

  /**
   * Quando passamos os paths vazios, nenhuma página estática é gerado no momento da build;
   * Se o fallback for enviado como false, caso o usuário tente acessar uma pagina diferente do que existe no servidor,
   * o retorno será 404
   * 
   * Caso seja passado valores nos paths e o fallback estiver como false, apenas os valores atribuídos no path estarão disponíveis
   * O fallback blocking retorna as paginas 
   * 
   * Passando valores no paths e fallback true, caso o cliente tente acessar um episódio do não gerado no path, o fallback
   * tentará gerar esse episódio, porém executado do lado do client
   * Para não dar problema no carregamento das páginas, é necessário importar o hook do next (useRouter) e incluir uma 
   * verificação if(userRouter.fallback){return 'Carregando...'}
   * 
   * Utilizando o fallback: 'blocking', o carregamento da página ocorre no next.js (node.js), assim o cliente será 
   * direcionado apenas quando o conteúdo estiver carregado na página a ser acessada
   * 
   * 
   * **************************************************
   * Exemplo:
   * Pensando em um serviço com 10 opções, poderia ser gerado as 10 opções diretos no path, para uma melhor experiência 
   * do cliente, isso dificílmente iria onerar o build
   * Pensando em um serviço com 10.000 opções, poderia ser gerado no path os 50 mais acessados, e os demais conforme as 
   * requisições dos clientes. Se eu fosse gerar todas as 10.000 requisições, provavelmente iria afetar o build da aplicação 
   * 
   * No next esse processo chama-se incremental static regeneration (fallback true and blocking)
   * **************************************************
   */

  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params;
  const { data } = await api.get(`/episodes/${slug}`)
  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    thumbnail: data.thumbnail,
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  }
  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24 // 60 seconds * 60 minutos (1 hour) * 24 hours
  }
}