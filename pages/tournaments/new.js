import styles from '../../styles/NewTournament.module.css';
import Form from '../../components/Form.js';

export default function NewTournament() {
  const tournamentForm = {
    name: '',
    category: ''
  }
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.message}>
            <a>Create A Tournament</a>
          </div>
          <Form formId="add-tournament-form" tournamentForm={tournamentForm} />
        </div>
      </div>
    </>
  )
}