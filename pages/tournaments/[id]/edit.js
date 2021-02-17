import { useRouter } from 'next/router'
import useSWR from 'swr'
import Form from '../../../components/Form'

const fetcher = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data)

const EditTournament = () => {
  const router = useRouter()
  const { id } = router.query
  const { data: tournament, error } = useSWR(id ? `/api/tournaments/${id}` : null, fetcher)

  if (error) return <p>Failed to load</p>
  if (!tournament) return <p>Loading...</p>

  const tournamentForm = {
    name: tournament.name,
    category: tournament.category
  }

  return <Form formId="edit-tournament-form" tournamentForm={tournamentForm} forNewTournament={false} />
}

export default EditTournament