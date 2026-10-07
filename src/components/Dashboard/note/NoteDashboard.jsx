import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NoteList from './NoteList';
import NotePosting from './NotePosting';
import './Notes.css';

const apiUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');

const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
});

const handleRequestError = (requestError, message, navigate) => {
  const status = requestError.response?.status;
  if (status === 400 || status === 401) {
    localStorage.removeItem('authToken');
    navigate('/login', { replace: true });
    return;
  }

  return message;
};

const NotesDashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('notes-page-active');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.classList.remove('notes-page-active');
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const addNote = async (note) => {
    setError('');
    try {
      const { data } = await axios.post(
          `${apiUrl}/api/members/notes`,
          note,
          authConfig()
      );
      const savedNote = data.note || data;
      setNotes((prevNotes) => [...prevNotes, {
        ...note,
        ...savedNote,
        type: savedNote.type || note.type || 'journal',
      }]);
    } catch (requestError) {
      console.error('Error while saving note:', requestError);
      const message = handleRequestError(
          requestError,
          'Your note could not be saved. Please try again.',
          navigate
      );
      if (message) setError(message);
      throw requestError;
    }
  };

  const updateNote = async (id, updates) => {
    setError('');
    try {
      const { data } = await axios.put(
          `${apiUrl}/api/members/notes/${id}`,
          updates,
          authConfig()
      );
      const updatedNote = data.note || data;
      setNotes((prevNotes) => prevNotes.map((note) => (
        note._id === id ? { ...note, ...updatedNote, ...updates } : note
      )));
    } catch (requestError) {
      console.error('Error while updating note:', requestError);
      const message = handleRequestError(
          requestError,
          'Your note could not be updated. Please try again.',
          navigate
      );
      if (message) setError(message);
      throw requestError;
    }
  };

  const deleteNote = async (id) => {
    setError('');
    try {
      await axios.delete(`${apiUrl}/api/members/notes/${id}`, authConfig());
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (requestError) {
      console.error('Error while deleting note:', requestError);
      const message = handleRequestError(
          requestError,
          'Your note could not be deleted. Please try again.',
          navigate
      );
      if (message) setError(message);
      throw requestError;
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`${apiUrl}/api/members/notes`, authConfig());
        setNotes(Array.isArray(data) ? data : data?.notes || []);
      } catch (requestError) {
        console.error('Error while fetching notes:', requestError);
        const message = handleRequestError(
            requestError,
            'Your notes could not be loaded. Please try again.',
            navigate
        );
        if (message) setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [navigate]);

  return (
      <main className="page-content notes-page">
        <section className="notes-heading">
          <p className="notes-eyebrow">Private journal</p>
          <h1>Journal</h1>
          <p>Capture the thoughts, plans, and little moments worth keeping.</p>
        </section>

        <NotePosting onAddNote={addNote} />

        <section className="notes-list-section" aria-labelledby="saved-notes-heading">
          <div className="notes-list-heading">
            <h2 id="saved-notes-heading">Saved Entries</h2>
            <span>{notes.length} {notes.length === 1 ? 'entry' : 'entries'}</span>
          </div>
          {loading && <p className="notes-status">Opening your journal...</p>}
          {error && <p className="notes-status notes-error">{error}</p>}
          {!loading && !error && (
            <NoteList
                notes={notes}
                onEditNote={updateNote}
                onDeleteNote={deleteNote}
            />
          )}
        </section>
      </main>
  );
};

export default NotesDashboard;