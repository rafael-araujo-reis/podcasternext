/***
 * Cria-se uma pagina utilizando entre [] o nome que será utilizado na url
 * neste caso foi utilizado slug
 */
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router'

import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

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

  return (
    <h1>{episode.title}</h1>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
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