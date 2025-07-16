const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'https://great-reads-bookshelf.vercel.app',
    'https://great-reads-git-main-camdenkitowski-projects.vercel.app',
    'https://great-reads-backend.vercel.app/',
    'https://great-reads-backend-git-main-camdenkitowskis-projects.vercel.app/',
    'http://localhost:3001', 
    'http://localhost:5173'
  ]
}));
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
 
app.get('/', (req, res) => {
  return "This is the backend..."
});

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


// Fetch User Books
app.get('/api/user-books', async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const { data, error } = await supabase
      .from('UserBooks')
      .select('Books (key, title, author, cover_i), status')
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const books = data.map(item => ({
      openLibraryKey: item.Books.key,
      title: item.Books.title,
      author: item.Books.author,
      cover_i: item.Books.cover_i,
      status: item.status
    }));

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch user books by status -- endpoint for Bookshelf.jsx
app.get('/api/books-by-status', async (req, res) => {
  const { user_id, status } = req.query;
  if (!user_id || !status) {
    return res.status(400).json({ error: 'User ID and status are required' });
  }

  try {
    const { data, error } = await supabase
      .from('UserBooks')
      .select('book_id, user_book_id, Books (key, title, author, cover_i)')
      .eq('user_id', user_id)
      .eq('status', status);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const flattenedBooks = data.map(item => ({
      user_book_id: item.user_book_id,
      book_id: item.book_id,
      openLibraryKey: item.Books.key,
      title: item.Books.title,
      author: item.Books.author,
      cover_i: item.Books.cover_i,
      url: item.Books.cover_i ? `https://covers.openlibrary.org/b/id/${item.Books.cover_i}-L.jpg` : null
    }));

    res.json(flattenedBooks);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Set Book Status
app.post('/api/set-book-status', async (req, res) => {
  const { user_id, book, status } = req.body;
  if (!user_id || !book || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  console.log("book " , book);
  console.log("status " , status);

  try {
    let generatedBookId;

    const { data: existingBook, error: checkError } = await supabase
      .from('Books')
      .select('book_id')
      .eq('key', book.openLibraryKey)
      .maybeSingle();
    console.log(existingBook, ' this is the existing books');

    if (checkError && checkError.code !== 'PGRST116') {
      return res.status(500).json({ error: checkError.message });
    }

    // add book to books table
    if (!existingBook) {
      const { data: newBook, error: insertError } = await supabase
        .from('Books')
        .insert([{
          key: book.openLibraryKey,
          title: book.title,
          author: book.author,
          cover_i: book.cover_i
        }])
        .select('book_id')
        .single();

      if (insertError) {
        return res.status(500).json({ error: insertError.message });
      }
      generatedBookId = newBook.book_id;
    } else {
      generatedBookId = existingBook.book_id;
    }

    // update the status on this book
    const { data, error } = await supabase
      .from('UserBooks')
      .upsert({
        user_id,
        book_id: generatedBookId,
        status
      }, {
        onConflict: ['user_id', 'book_id']
      })
      .select('user_book_id')
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ openLibraryKey: book.openLibraryKey, status });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user book
app.delete('/api/delete-user-book', async (req, res) => {
  const { user_id, book_id, openLibraryKey } = req.body;
  if (!user_id || !book_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { error } = await supabase
      .from('UserBooks')
      .delete()
      .eq('user_id', user_id)
      .eq('book_id', book_id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ openLibraryKey });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch notes -- endpoint for Notes.jsx
app.get('/api/notes', async (req, res) => {
  const { user_book_id } = req.query;
  if (!user_book_id) {
    return res.status(400).json({ error: 'User book ID is required' });
  }

  try {
    const { data, error } = await supabase
      .from('UserBooks')
      .select('notes')
      .eq('user_book_id', user_book_id)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ notes: data.notes || '<p></p>' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save notes -- endpoint for Notes.jsx
app.patch('/api/notes', async (req, res) => {
  const { user_book_id, notes } = req.body;
  if (!user_book_id || !notes) {
    return res.status(400).json({ error: 'User book ID and notes are required' });
  }

  try {
    const { error } = await supabase
      .from('UserBooks')
      .update({ notes })
      .eq('user_book_id', user_book_id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Notes saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Authentication for Supbase 
app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return res.status(401).json({ error: error.message });
    }
    res.json({ user: data.user, session: data.session });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ user: data.user, session: data.session });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/signout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'Signed out successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/session', async (req, res) => {
  const { access_token } = req.query;
  if (!access_token) {
    return res.status(400).json({ error: 'Access token is required' });
  }
  try {
    const { data, error } = await supabase.auth.getUser(access_token);
    if (error) {
      return res.status(401).json({ error: error.message });
    }
    res.json({ user: data.user });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = app;