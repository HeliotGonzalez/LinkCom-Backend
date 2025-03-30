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


// New endpoint for user registration using Supabase Auth
app.post('/user-register', async (req, res) => {
  console.log('Request body:', req.body); // Debugging log
  const { email, password, username, description } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, password, and username are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // Register the user with Supabase Auth
    const {data, error} = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Error during user registration:', authError);
      return res.status(400).json({ error: authError.message });
    }

    // Insert additional user data into the Users table
    console.log(req.body.password)
    const { data: userData, error: userError } = await supabase.from('Users').insert([
      {
        id: authData.user.id, // Use the ID from Supabase Auth
        username: req.body.username,
        email:req.body.email,
        description: req.body.description,
      },
    ]);

    if (userError) {
      console.error('Error inserting user into Users table:', userError);
      return res.status(500).json({ error: userError.message });
    }

    res.status(201).json({ message: 'User registered successfully', user: userData });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// New endpoint for user login using Supabase Auth
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Authenticate the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Error during login:', authError);
      return res.status(401).json({ error: authError.message });
    }

    res.status(200).json({ message: 'Login successful', token: authData.session.access_token });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

