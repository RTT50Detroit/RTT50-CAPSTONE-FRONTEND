import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NoteList from './NoteList';
import NotePosting from './NotePosting';


const NotesDashboard = () => {
  const [notes, setNotes] = useState([]); // Stores all notes
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch notes from the API
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/members/notes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setNotes(data);
    } catch (error) {
      console.error('Error while fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new note (passed to NotePosting)
  const addNote = async (noteContent) => {
    try {
      const { data } = await axios.post(
          '/api/members/notes',
          { content: noteContent },
          { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );
      setNotes((prevNotes) => [...prevNotes, data]); // Add new note to the list
    } catch (error) {
      console.error('Error while adding a note:', error);
    }
  };

  // Update an existing note (passed to NoteList for editing)
  const updateNote = async (id, content) => {
    try {
      const { data } = await axios.put(
          `/api/members/notes/${id}`,
          { content },
          { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );
      setNotes((prevNotes) => prevNotes.map((note) => (note._id === id ? data : note))); // Replace updated note
    } catch (error) {
      console.error('Error while updating note:', error);
    }
  };

  // Delete an existing note (also used by NoteList)
  const deleteNote = async (id) => {
    try {
      await axios.delete(`/api/members/notes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id)); // Remove from list
    } catch (error) {
      console.error('Error while deleting note:', error);
    }
  };

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
      <div>
        <h2>Notes Dashboard</h2>

        {/* Note Posting */}
        <NotePosting onAddNote={addNote} />

        {/* Note List */}
        {loading ? <p>Loading notes...</p> : <NoteList notes={notes} onEditNote={updateNote} onDeleteNote={deleteNote} />}
      </div>
  );
};

export default NotesDashboard;