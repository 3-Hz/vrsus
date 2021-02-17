import { useState } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';

import styles from '../styles/Form.module.css';

const Form = ({ formId, tournamentForm, forNewTournament = true }) => {
  const router = useRouter();
  const contentType = 'application/json';
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    name: tournamentForm.name,
    category: tournamentForm.category
  });

  /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async (form) => {
    const { id } = router.query;

    try {
      const res = await fetch(`/api/tournaments/${id}`, {
        method: 'PUT',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(form)
      })

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      }

      const { data } = await res.json();

      mutate(`/api/tournaments/${id}`, data, false) // Update the local data without a revalidation
      router.push(`/tournaments/${id}`);
    } catch (error) {
      setMessage('Failed to update tournament');
    }
  }

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form) => {
    try {
      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(form),
      })

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status)
      }

      let body = await res.json();
      router.push(`/tournaments/${body.data._id}`);
    } catch (error) {
      setMessage('Failed to add tournament');
    }
  }

  const deleteTournament = async () => {
    const { id } = router.query;
    try {
      const res = await fetch(`/api/tournaments/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) {
        throw new Error(res.status);
      }
      router.push(`/tournaments`);
    } catch (error) {
      setMessage('Failed to delete tournament');
    }
  }

  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = formValidate();
    if (Object.keys(errs).length === 0) {
      forNewTournament ? postData(form) : putData(form)
    } else {
      setErrors({ errs })
    }
  }

  /* Validate tournament info */
  const formValidate = () => {
    let err = {}
    if (!form.name) err.name = 'Name is required'
    if (!form.category) err.owner_name = 'Category is required'
    return err
  }

  return forNewTournament ?
  (
    <>
      <form className={styles.form} id={formId} onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          maxLength="140"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="category">Category</label>
        <input
          type="text"
          maxLength="50"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Submit
        </button>
      </form>
      <p>{message}</p>
      <div>
        {Object.keys(errors).map((err, index) => (
          <li key={index}>{err}</li>
        ))}
      </div>
    </>
  )
  :
  (
    <>
      <form className={styles.form} id={formId} onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          maxLength="140"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="category">Category</label>
        <input
          type="text"
          maxLength="50"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        />
        <div className={styles.button_container}>
          <button onClick={handleSubmit}>
            Submit
          </button>
          <button onClick={deleteTournament}>
            Delete
          </button>
        </div>
      </form>
      <p>{message}</p>
      <div>
        {Object.keys(errors).map((err, index) => (
          <li key={index}>{err}</li>
        ))}
      </div>
    </>
  )
}

export default Form;