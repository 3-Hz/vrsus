import styles from '../styles/Bracket.module.css';
import createBracket from '../utils/createBracket.js';

const Bracket = ({ tournament }) => {


  if (!tournament.started) {
    createBracket(tournament.contestants);
  }

  return (
    <div className={styles.bracket_container}>

    </div>
  )
}

export default Bracket;