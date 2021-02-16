import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Bracket  from '../../../components/Bracket.js';
import dbConnect from '../../../database/connect.js';
import Tournament from '../../../database/models/Tournament.js';
import styles from '../../../styles/TournamentPage.module.css';

const TournamentPage = ({ tournament }) => {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [contestant, setContestant] = useState({
    name: ''
  });

  const addContestant = async (contestant) => {
    try {
      const res = await fetch(`/api/tournaments/${tournament._id}/addcontestant`, {
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
    } catch (error) {
      setMessage('Failed to sign up');
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
    addContestant(contestant);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <a className={styles.title}>{tournament.name}</a>
        <a className={styles.subtitle}>{tournament.category}</a>

        <div className={styles.entry_module_wrapper}>
          <div className={styles.contestant_list}>
            <a>Contestants</a>
            {tournament.contestants.map((contestant, index) => (
              <div key={index} className={styles.contestant}>
                {contestant}
              </div>
            ))}
          </div>
          <form className={styles.signup} onSubmit={handleSubmit}>
            <input
              name="name"
              value={contestant.name}
              onChange={handleChange}
            />
            <button type="submit">Sign Up</button>
            <p>{message}</p>
            <div>
              {Object.keys(errors).map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </div>
          </form>
        </div>

        <div className={styles.bracket_wrapper}>
          <a>Bracket</a>
          <div className={styles.bracket_container}>
            <Bracket contestants={tournament.contestants} bracket={tournament.bracket}/>
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