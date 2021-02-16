import Link from 'next/link';
import dbConnect from '../../database/connect.js';
import Tournament from '../../database/models/Tournament.js'
import styles from '../../styles/TournamentList.module.css';

const TournamentList = ({ tournaments }) => {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.container}>

          <div className={styles.message}>
            <a>Tournaments</a>
          </div>

          <div className={styles.tournament_list}>
            {/* make card for each tournament */}
            {tournaments.map(tournament => (
              <div key={tournament._id}>
                <Link href="/tournaments/[id]" as={`tournaments/${tournament._id}`}>
                  <div className={styles.card}>
                    <a>{tournament.name}</a>
                    <a className={styles.category}>{tournament.category}</a>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  await dbConnect();

  const result = await Tournament.find({});
  const tournaments = result.map(doc => {
    const tournament = doc.toObject();
    tournament._id = tournament._id.toString();
    return tournament;
  })
  return { props: { tournaments: tournaments } };
}

export default TournamentList;