import { useState } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import Bracket  from '../../../components/Bracket.js';
import dbConnect from '../../../database/connect.js';
import Tournament from '../../../database/models/Tournament.js';
import styles from '../../../styles/TournamentPage.module.css';

const TournamentPage = ({ tournament }) => {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [contestant, setContestant] = useState({
    name: ''
  });

  const addContestant = async (contestant) => {
    try {
      const res = await fetch(`/api/tournaments/${tournament._id}/contestant`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contestant)
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      router.push(`/tournaments/${tournament._id}`);
    } catch (error) {
      setMessage('Failed to sign up');
    }
  }

  const deleteContestant = async (contestant) => {
    try {
      const res = await fetch(`/api/tournaments/${tournament._id}/contestant`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: contestant })
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      router.push(`/tournaments/${tournament._id}`);
    } catch (error) {
      setMessage('Failed to remove contestant');
    }
  }

  const startTournament = async () => {
    try {
      const res = await fetch(`/api/tournaments/${tournament._id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({started: true})
      });
      if (!res.ok) {
        throw new Error(res.status);
      }
      router.push(`/tournaments/${tournament._id}`);
    } catch (error) {
      setMessage('Failed to start');
    }
  }

  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    setContestant({
      ...contestant,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    addContestant(contestant);
  }

  const handleDelete = (e, contestant) => {
    console.log(contestant)
    deleteContestant(contestant);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <a className={styles.title}>{tournament.name}</a>
        <a className={styles.subtitle}>{tournament.category}</a>
        <div className={styles.editbutton_container}>
          <Link href="/tournaments/[id]/edit" as={`/tournaments/${tournament._id}/edit`}>
            <button className={styles.button}>Edit</button>
          </Link>
        </div>

        <div className={styles.entry_module_wrapper}>
          <div className={styles.contestant_list}>
            <a>Contestants</a>
            {tournament.contestants.map((contestant, index) => (
                <div key={index} className={styles.contestant}>
                  <a>{index + 1}. {contestant}</a>
                  {/* Display removal button if tournament not started */}
                  {tournament.started ? <></> :
                    <button
                      onClick={(e) => handleDelete(e, contestant)}
                      className={styles.button}
                    >
                      Remove
                    </button>
                  }
                </div>

            ))}
          </div>
          {/* Only allow signup before tournament starts */}
          {tournament.started ?
            <></>
            :
            <form className={styles.signup} onSubmit={handleSubmit}>
              <input
                name="name"
                value={contestant.name}
                onChange={handleChange}
              />
              <button className={styles.button} type="submit">Sign Up</button>
            </form>
          }
        </div>

        {/* Error message */}
        <p>{message}</p>
        <div>
          {Object.keys(errors).map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </div>

        <div className={styles.bracket_wrapper}>
          <a>Bracket</a>

          {/* Display based on tournament state and number of contestants */}
          {tournament.started ?
            <div className={styles.start}>
              <a>Started</a>
            </div>
          :
            tournament.contestants.length > 0 ?
              <div className={styles.start}>
                <a>Not Started</a>
                <button onClick={startTournament}>Start</button>
              </div>
              :
              <div className={styles.start}>
                <a>Not Started</a>
              </div>
          }

          {/* Bracket component */}
          <div className={styles.bracket_container}>
            <Bracket tournament={tournament}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  await dbConnect();

  const tournament = await Tournament.findById(params.id).lean();
  tournament._id = tournament._id.toString();

  return { props: { tournament }};
}

export default TournamentPage;