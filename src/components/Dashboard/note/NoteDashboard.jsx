import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NoteList from './NoteList';
import NotePosting from './NotePosting';
import './Notes.css';
import '../../../pages/css/game_interface.css';

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
  const [selectedNoteIds, setSelectedNoteIds] = useState([]);
  const [editRequestIds, setEditRequestIds] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const settingsControlsRef = useRef(null);
  const settingsTriggerRef = useRef(null);
  const settingsMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!settingsOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!settingsControlsRef.current?.contains(event.target)) {
        setSettingsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSettingsOpen(false);
        settingsTriggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [settingsOpen]);

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

  const handleSelectionChange = (id, isSelected) => {
    setSelectedNoteIds((currentIds) => (
      isSelected
        ? [...new Set([...currentIds, id])]
        : currentIds.filter((currentId) => currentId !== id)
    ));
  };

  const handleSelectAll = (isSelected) => {
    setSelectedNoteIds(isSelected ? notes.map(getNoteId) : []);
  };

  const toggleSelectionMode = () => {
    setSelectionMode((isActive) => !isActive);
    setSelectedNoteIds([]);
  };

  const handleBatchDelete = async () => {
    if (!selectedNoteIds.length || !window.confirm(
        `Delete ${selectedNoteIds.length} selected ${selectedNoteIds.length === 1 ? 'entry' : 'entries'}?`
    )) {
      return;
    }

    try {
      await Promise.all(selectedNoteIds.map((id) => deleteNote(id)));
      setSelectedNoteIds([]);
      setEditRequestIds([]);
      setSelectionMode(false);
      setSettingsOpen(false);
    } catch (requestError) {
      console.error('Error while deleting selected entries:', requestError);
    }
  };

  const handleBatchEdit = () => {
    if (!selectedNoteIds.length) return;
    setEditRequestIds([...selectedNoteIds]);
    setSelectionMode(false);
    setSettingsOpen(false);
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
      <main className="page-content notes-page game-interface">
        <section className="notes-heading">
          <div className="page-header-copy">
            <p className="notes-eyebrow">Private Journal</p>
            <h1>Journal</h1>
            <p>Capture the thoughts, plans, and little moments worth keeping.</p>
          </div>
        </section>

        <div className="notes-page-settings" ref={settingsControlsRef}>
          <button
              type="button"
              className="notes-settings-trigger"
              ref={settingsTriggerRef}
              aria-expanded={settingsOpen}
              aria-controls="journal-post-settings"
              aria-label={settingsOpen ? 'Close Journal Settings' : 'Open Journal Settings'}
              title={settingsOpen ? 'Close Journal Settings' : 'Open Journal Settings'}
              onClick={() => setSettingsOpen((isOpen) => !isOpen)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
              <path d="M19.14 12.94a7.5 7.5 0 0 0 .05-.94 7.5 7.5 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.2 7.2 0 0 0-1.63-.94l-.36-2.54A.49.49 0 0 0 13.89 2h-3.78a.49.49 0 0 0-.49.42L9.26 4.96c-.6.23-1.15.55-1.63.94l-2.39-.96a.5.5 0 0 0-.61.22L2.71 8.48a.5.5 0 0 0 .12.64l2.03 1.58a7.5 7.5 0 0 0-.05.94c0 .32.02.63.05.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.12.21.37.3.61.22l2.39-.96c.48.39 1.03.71 1.63.94l.36 2.54c.04.24.24.42.49.42h3.78c.25 0 .45-.18.49-.42l.36-2.54c.6-.23 1.15-.55 1.63-.94l2.39.96c.24.09.49-.01.61-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
            </svg>
          </button>
          {settingsOpen && (
            <section
                className="notes-settings-menu"
                id="journal-post-settings"
                ref={settingsMenuRef}
                aria-label="Journal Post Settings"
            >
              <div>
                <p className="notes-section-kicker">Manage Posts</p>
                <h3>Post Settings</h3>
                <p>Select entries to edit or delete them together.</p>
              </div>
              <div className="notes-settings-actions">
                <button type="button" onClick={toggleSelectionMode}>
                  {selectionMode ? 'Cancel Selection' : 'Select Entries'}
                </button>
                {selectionMode && (
                  <button
                      type="button"
                      onClick={() => handleSelectAll(selectedNoteIds.length !== notes.length)}
                      disabled={!notes.length}
                  >
                    {selectedNoteIds.length === notes.length && notes.length
                      ? 'Clear Selection'
                      : 'Select All'}
                  </button>
                )}
                {selectionMode && (
                  <button
                      type="button"
                      onClick={() => {
                        setSelectedNoteIds([]);
                        setSelectionMode(false);
                      }}
                  >
                    Done Selecting
                  </button>
                )}
                <button type="button" onClick={handleBatchEdit} disabled={!selectedNoteIds.length}>
                  Edit Selected
                </button>
                <button
                    type="button"
                    className="button-danger"
                    onClick={handleBatchDelete}
                    disabled={!selectedNoteIds.length}
                >
                  Delete Selected
                </button>
              </div>
              <span className="notes-selection-count">
                {selectedNoteIds.length} selected
              </span>
            </section>
          )}
        </div>

        <div className="journal-composer">
          <NotePosting onAddNote={addNote} />
        </div>

        <section className="notes-list-section" aria-labelledby="saved-notes-heading">
          <div className="notes-list-heading">
            <div>
              <p className="notes-section-kicker">Your Posts</p>
              <h2 id="saved-notes-heading">Notes &amp; Journal</h2>
            </div>
            <div className="notes-list-controls">
              <span>{notes.length} {notes.length === 1 ? 'entry' : 'entries'}</span>
            </div>
          </div>
          {loading && <p className="notes-status">Opening your journal...</p>}
          {error && <p className="notes-status notes-error">{error}</p>}
          {!loading && !error && (
            <NoteList
                notes={notes}
                onEditNote={updateNote}
                selectedNoteIds={selectedNoteIds}
                editRequestIds={editRequestIds}
                selectionMode={selectionMode}
                onSelectionChange={handleSelectionChange}
                onSelectAll={handleSelectAll}
            />
          )}
        </section>
      </main>
  );
};

export default NotesDashboard;