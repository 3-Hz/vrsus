import styles from '../styles/Bracket.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';

const Bracket = ({ tournament }) => {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const updateBracket = async (roundIndex, matchIndex, winner) => {
    let updatedBracket = tournament.bracket;
    updatedBracket[roundIndex + 1][matchIndex >> 1][matchIndex % 2] = winner;
    try {
      const res = await fetch(`/api/tournaments/${tournament._id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({bracket: updatedBracket})
      })
      if (!res.ok) {
        throw new Error(res.status);
      }
      router.push(`/tournaments/${tournament._id}`);
    } catch (error) {
      setMessage('Failed to update bracket.');
    }
  }

  const updateChampion = async (winner) => {
    try {
      const res = await fetch(`/api/tournaments/${tournament._id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ champion: winner })
      })
      if (!res.ok) {
        throw new Error(res.status);
      }
      router.push(`/tournaments/${tournament._id}`);
    } catch (error) {
      setMessage('Failed to update champion.');
    }
  }

  const handleClick = (e, roundIndex, matchIndex, winner) => {
    if (tournament.started && winner !== 'tbd' && winner !== 'bye') {
      if (roundIndex < tournament.bracket.length - 1) {
        updateBracket(roundIndex, matchIndex, winner);
      } else if (roundIndex === tournament.bracket.length - 1) {
        updateChampion(winner);
      }
    }
  }

  return (
    <>
      <p>{message}</p>
      <div>
        {Object.keys(errors).map((err, index) => (
          <li key={index}>{err}</li>
        ))}
      </div>
      <div className={styles.bracket_container}>
        {tournament.bracket.map((round, roundIndex) => (
          <div key={roundIndex} className={styles.bracket_round}>
            {round.map((match, matchIndex) => (
              <div key={matchIndex} className={styles.match_card}>
                {match.map((player, playerIndex) => (
                  <div key={playerIndex} className={styles.player_card} onClick={(e) => handleClick(e, roundIndex, matchIndex, player)}>
                    {player}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
        <div className={styles.bracket_round}>
          <div className={styles.match_card}>
            <div className={styles.player_card}>
              {tournament.champion || "tbd"}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Bracket;