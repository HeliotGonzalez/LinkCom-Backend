// app.js
import express, {query} from 'express';
import cors from 'cors';
import supabase from './config/supabaseClient.js';

const app = express();

app.use(cors());
app.use(express.json());

const executeQuery = async (query) => {
  const { data, error } = await query;

  if (error) {
    console.error('Error en Supabase:', error.message);
    return { success: false, error: error.message};
  }

  return { success: true, data };
};

app.post('/createCommunity', async (req, res) => {
  const { userID, description, name, isPrivate, communityInterests } = req.body;

  const createCommunityResponse = await executeQuery(supabase.from('Communities').insert([{ userID, description, name, isPrivate}]));
  if (!createCommunityResponse["success"]) return res.status(500).json({ error: createCommunityResponse["error"]});

  const createdCommunityIDResponse = await executeQuery(supabase.from('Communities').select('id').eq('userID', userID).eq('name', name));
  if (!createCommunityResponse["success"]) return res.status(500).json({ error: createdCommunityIDResponse["error"]});

  for (let interestName of communityInterests) {
    interestName = interestName.replace("#", "");
    const communityInterestResponse = await executeQuery(supabase.from('CommunityInterest').insert([{
      communityID: createdCommunityIDResponse.data[0]["id"],
      interestName,
      communityName: name,
      userID
    }]));
    if (!communityInterestResponse["success"]) return res.status(500).json({ error: communityInterestResponse["error"]});
  }

  res.status(201).json({message: 'Community created successfully', data: req.body});
});

app.get('/communities', async (req, res) => {
  const communitiesResponse = await executeQuery(supabase.from('Communities').select('*'));

  if (!communitiesResponse.success) return res.status(500).json({ error: communitiesResponse["error"]});

  res.json(communitiesResponse.data);
});

app.post('/createEvent', async (req, res) => {
  const { title, description, communityID, userID, dateOfTheEvent } = req.body;

  const createEventResponse = await executeQuery(supabase.from('Events').insert([{
    title,
    description,
    communityID,
    userID,
    dateOfTheEvent
  }]));
  if (!createEventResponse.success) return res.status(500).json({ error: createEventResponse["error"]});

  const createdEventIDResponse = await executeQuery(supabase.from('Events').select('id').eq('communityID', communityID).eq('userID', userID));
  if (!createdEventIDResponse.success) return res.status(500).json({ error: createdEventIDResponse["error"]});

  let eventID = createdEventIDResponse.data[0]["id"];

  const eventUserResponse = await executeQuery(supabase.from('EventUser').insert([{
    eventID,
    userID,
    communityID
  }]));
  if (!eventUserResponse.success) return res.status(500).json({ error: eventUserResponse["error"]});

  res.status(201).json({message: 'Event created successfully', data: req.body});
});

app.get('/userEvents', async (req, res) => {
  const { userID } = req.body;

  const userEventsResponse = await executeQuery(supabase.from('EventUser').select('*').eq('userID', userID));
  if (!userEventsResponse.success) return res.status(500).json({ error: userEventsResponse["error"]});

  const userEventsIDs = userEventsResponse.data.reduce(e => e["eventID"]);

  const eventsResponse = await executeQuery(supabase.from('Events').select('*').in('id', userEventsIDs));
  if (!eventsResponse.success) return res.status(500).json({ error: eventsResponse["error"]});

  res.status(201).json({message: 'User events found!', data: eventsResponse.data});
});

app.get('/communityEvents', async (req, res) => {
  const { communityID } = req.body;

  const communityEventsResponse = await executeQuery(supabase.from('Events').select('*').eq('communityID', communityID));
  if (!communityEventsResponse.success) return res.status(500).json({ error: communityEventsResponse["error"]});

  const communityEventsIDs = communityEventsResponse.data.reduce(e => e["communityID"]);

  const eventsResponse = await executeQuery(supabase.from('Events').select('*').in('id', communityEventsIDs));
  if (!eventsResponse.success) return res.status(500).json({ error: eventsResponse["error"]});

  res.status(201).json({message: 'User events found!', data: eventsResponse.data});
});

app.get('/events', async (req, res) => {
  const eventsResponse = await executeQuery(supabase.from('Events').select('*'));
  if (!eventsResponse.success) return res.status(500).json({ error: eventsResponse["error"]});

  res.status(201).json({message: 'User events found!', data: eventsResponse.data});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
