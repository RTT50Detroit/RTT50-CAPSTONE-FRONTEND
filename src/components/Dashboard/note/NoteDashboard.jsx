import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NoteList from './NoteList';
import NotePosting from './NotePosting';
import './Notes.css';

const apiUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');
const noteTypeStorageKey = 'journal-entry-types';

const readStoredNoteTypes = () => {
  try {
    const storedTypes = JSON.parse(localStorage.getItem(noteTypeStorageKey) || '{}');
    return storedTypes && typeof storedTypes === 'object' ? storedTypes : {};
  } catch {
    return {};
  }
};

const writeStoredNoteTypes = (types) => {
  localStorage.setItem(noteTypeStorageKey, JSON.stringify(types));
};

const getNoteId = (note) => note?._id || note?.id;

const normalizeNote = (note, storedTypes = readStoredNoteTypes()) => {
  const noteId = getNoteId(note);
  const type = note?.type === 'note' || note?.type === 'journal'
    ? note.type
    : storedTypes[noteId] || 'journal';

  return { ...note, type };
};

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
      const savedNoteWithType = normalizeNote({
        ...note,
        ...savedNote,
        type: savedNote.type || note.type || 'journal',
      });
      const savedNoteId = getNoteId(savedNoteWithType);
      if (savedNoteId) {
        const storedTypes = readStoredNoteTypes();
        writeStoredNoteTypes({ ...storedTypes, [savedNoteId]: savedNoteWithType.type });
      }
      setNotes((prevNotes) => [...prevNotes, savedNoteWithType]);
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
      const updatedNoteWithType = normalizeNote({ ...updatedNote, ...updates });
      const updatedNoteId = getNoteId(updatedNoteWithType);
      if (updatedNoteId) {
        const storedTypes = readStoredNoteTypes();
        writeStoredNoteTypes({ ...storedTypes, [updatedNoteId]: updatedNoteWithType.type });
      }
      setNotes((prevNotes) => prevNotes.map((note) => (
        note._id === id ? { ...note, ...updatedNoteWithType } : note
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
      const storedTypes = readStoredNoteTypes();
      delete storedTypes[id];
      writeStoredNoteTypes(storedTypes);
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
        const fetchedNotes = Array.isArray(data) ? data : data?.notes || [];
        setNotes(fetchedNotes.map((note) => normalizeNote(note)));
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

        <div className="journal-composer">
          <NotePosting onAddNote={addNote} />
        </div>

        <section className="notes-list-section" aria-labelledby="saved-notes-heading">
          <div className="notes-list-heading">
            <div>
              <p className="notes-section-kicker">Your Posts</p>
              <h2 id="saved-notes-heading">Notes &amp; Journal</h2>
            </div>
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