/***
 * Cria-se uma pagina utilizando entre [] o nome que será utilizado na url
 * neste caso foi utilizado slug
 */

import { useRouter } from 'next/router'

export default function Episode() {

  const router = useRouter();
  return (
    <h1>{router.query.slug}</h1>
  )
}