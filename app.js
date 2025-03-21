// app.js
import express from 'express';
import cors from 'cors';
import supabase from './config/supabaseClient.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Hola desde Node.js' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.get('/test', async (req, res) => {
  const { data, error } = await supabase.from('test').select('*');

  if (error) {
    console.error('Error en Supabase:', error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.post('/add-email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const { data, error } = await supabase.from('test').insert([{ email }]);

  if (error) {
    console.error('Error inserting email into Supabase:', error);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: 'Email added successfully', data });
});

// New endpoint for user registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  try {
    // Insert user data into the database
    const { data, error } = await supabase.from('test').insert([
      {
        username,
        email,
        password, // Note: Store hashed passwords in production!
      },
    ]);

    if (error) {
      console.error('Error inserting user into Supabase:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: 'User registered successfully', data });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

