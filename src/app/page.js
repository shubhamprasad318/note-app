'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import useSWR from 'swr';

axios.defaults.withCredentials = true;

const fetchNotes = async () => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notes`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Unauthorized');
    }
    throw error;
  }
};

export default function Home() {
  const [token, setToken] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fileText, setFileText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState(null);
  const router = useRouter();
  const { data: notes, error, mutate } = useSWR('/notes', fetchNotes);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
      return;
    }
    setToken(storedToken);
  }, [router]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required');
      return;
    }

    try {
      if (isEditing) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/notes/${editId}`,
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/notes`,
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setTitle('');
      setContent('');
      mutate();
    } catch (error) {
      console.error('Error saving note:', error.response?.data || error.message || error);
      alert('An error occurred while saving the note. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      mutate();
    } catch (error) {
      console.error('Error deleting note:', error.response?.data || error.message || error);
      alert('An error occurred while deleting the note. Please try again.');
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(true);
    setEditId(note._id);
  };

  const handleFavorite = async (note) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/notes/${note._id}`,
        { favorite: note.favorite ? false : true }, // Fix toggle logic
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mutate(); // Refresh the notes after updating
    } catch (error) {
      console.error('Error updating favorite:', error.response?.data || error.message || error);
      alert('An error occurred while updating the favorite status.');
    }
  };
  

  const extractTextFromFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'text/plain') {
        alert('Please upload a text file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setFileText(e.target.result);
      reader.readAsText(file);
    }
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported by your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.start();
    setRecording(true);
    setRecognitionInstance(recognition);

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setContent((prev) => prev + ' ' + transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      alert('An error occurred with voice recognition.');
    };

    recognition.onend = () => {
      setRecording(false);
    };
  };

  const stopVoiceRecognition = () => {
    if (recognitionInstance) {
      recognitionInstance.stop();
      setRecording(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`);
      localStorage.removeItem('token');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout.');
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">My Notes</h1>
        <button
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-lg border border-gray-200">
        <input
          className="border p-4 w-full mt-4 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-4 w-full mt-4 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Write a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <input type="file" className="mt-4 text-sm" onChange={extractTextFromFile} />
        <p className="text-gray-500 mt-2 text-sm">Extracted Text: {fileText}</p>
        <div className="mt-6 flex gap-4">
          <button
            className="bg-blue-600 text-white py-3 px-6 rounded-lg w-full transition-all hover:bg-blue-700"
            onClick={handleSubmit}
          >
            {isEditing ? 'Update Note' : 'Add Note'}
          </button>
          <button
            className={`bg-green-600 text-white py-3 px-6 rounded-lg w-full transition-all ${recording ? 'bg-gray-500' : 'hover:bg-green-700'}`}
            onClick={recording ? stopVoiceRecognition : startVoiceRecognition}
          >
            {recording ? 'Stop Recording' : 'Voice to Text'}
          </button>
        </div>
      </div>

      <div className="mt-12 max-w-3xl mx-auto space-y-4">
  {/* Favorite Notes Section */}
  {notes?.filter(note => note.favorite).length > 0 && (
    <div>
      <h2 className="text-2xl font-semibold text-purple-600">Favorite Notes</h2>
      {notes.filter(note => note.favorite).map((note) => (
        <div key={note._id} className="border p-6 bg-purple-50 shadow-lg rounded-lg flex justify-between items-start hover:shadow-2xl transition-all">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{note.title}</h2>
            <p className="text-gray-600 mt-2">{note.content}</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600" onClick={() => handleEdit(note)}>Edit</button>
            <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700" onClick={() => handleDelete(note._id)}>Delete</button>
            <button className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500" onClick={() => handleFavorite(note)}>★</button>
          </div>
        </div>
      ))}
    </div>
  )}

  {/* Regular Notes Section */}
  <h2 className="text-2xl font-semibold text-blue-600 mt-8">All Notes</h2>
  {notes?.filter(note => !note.favorite).map((note) => (
    <div key={note._id} className="border p-6 bg-white shadow-lg rounded-lg flex justify-between items-start hover:shadow-2xl transition-all">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{note.title}</h2>
        <p className="text-gray-600 mt-2">{note.content}</p>
      </div>
      <div className="flex gap-3">
        <button className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600" onClick={() => handleEdit(note)}>Edit</button>
        <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700" onClick={() => handleDelete(note._id)}>Delete</button>
        <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700" onClick={() => handleFavorite(note)}>★</button>
      </div>
    </div>
        ))}
        {error && <p className="text-red-500 text-center">Failed to load notes. Please try again later.</p>}
      </div>
    </div>
  );
}
