// application.js
import express from 'express';
import cors from 'cors';
import supabase from './config/supabaseClient.js';
import {getUser, getCommunityIds, getRecentEvents, getRecentAnnounces} from './feedService.js';
import {getImage, saveImage} from "./application/utils/imagesStore.js";
import communityRouter from './application/controllers/CommunityController.js';
import userRouter from './application/controllers/UserController.js';
import eventRouter from './application/controllers/EventController.js';

const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'}));

app.use(express.urlencoded({limit: '50mb', extended: true}));  // Si usas formularios

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

const executeQuery = async (query) => {
    const {data, error} = await query;

    if (error) {
        console.error('Error en Supabase:', error.message);
        return {success: false, error: error.message};
    }

    return {success: true, data};
};

app.use('/communities', communityRouter);
app.use('/users', userRouter);
app.use('events', eventRouter);

app.get('/removeCommunity', async (req, res) => {
    const {communityID} = req.query;

    const removeCommunityInterestsResponse = await executeQuery(supabase.from('CommunityInterest').delete().eq('communityID', communityID));
    if (!removeCommunityInterestsResponse["success"]) return res.status(500).json({error: removeCommunityInterestsResponse["error"]});

    const removeCommunityUserResponse = await executeQuery(supabase.from('CommunityUser').delete().eq('communityID', communityID));
    if (!removeCommunityUserResponse["success"]) return res.status(500).json({error: removeCommunityUserResponse["error"]});

    const removeCommunityEventUserResponse = await executeQuery(
        supabase.from('EventUser')
            .delete()
            .eq('communityID', communityID)
    )
    if (!removeCommunityEventUserResponse["success"]) return res.status(500).json({error: removeCommunityEventUserResponse["error"]});

    const removeCommunityEventResponse = await executeQuery(
        supabase.from('Events')
            .delete()
            .eq('communityID', communityID)
    )
    if (!removeCommunityEventResponse["success"]) return res.status(500).json({error: removeCommunityEventResponse["error"]});

    const removeCommunityResponse = await executeQuery(supabase.from('Communities').delete().eq('id', communityID));
    if (!removeCommunityResponse["success"]) return res.status(500).json({error: removeCommunityResponse["error"]});

    res.status(201).json({message: 'Community removed successfully', communityID});
});

app.post('/createCommunity', async (req, res) => {
    const {userID, description, name, isPrivate, img, communityInterests} = req.body;

    const createCommunityResponse = await executeQuery(supabase.from('Communities').insert([{
        creatorID: userID,
        description,
        name,
        isPrivate,
    }]));
    if (!createCommunityResponse["success"]) return res.status(500).json({error: createCommunityResponse["error"]});

    const createdCommunityIDResponse = await executeQuery(supabase.from('Communities').select('id').eq('creatorID', userID).eq('name', name));
    if (!createCommunityResponse["success"]) return res.status(500).json({error: createdCommunityIDResponse["error"]});

    const communityID = createdCommunityIDResponse['data'][0]['id'];

    for (let interestName of communityInterests) {
        interestName = interestName.replace("#", "");
        const communityInterestResponse = await executeQuery(supabase.from('CommunityInterest').insert([{
            communityID,
            interestName,
            communityName: name,
            userID
        }]));
        if (!communityInterestResponse["success"]) return res.status(500).json({error: communityInterestResponse["error"]});
    }

    const setUserCommunityResponse = await executeQuery(supabase.from('CommunityUser').insert([{
        communityID,
        userID,
        communityRole: "administrator"
    }]));
    if (!setUserCommunityResponse["success"]) return res.status(500).json({error: setUserCommunityResponse["error"]});

    res.status(201).json({message: 'Community created successfully', data: {...req.body, communityID}});
});

app.post('/storeImage', async (req, res) => {
    const {image, directory} = req.body;
    await saveImage(image, directory);
    res.status(201).json({message: 'Image stored successfully', data: {image, directory}});
});

app.post('/updateCommunityImage', async (req, res) => {
    const {imagePath, communityID} = req.body;
    const updateCommunityImageResponse = await executeQuery(supabase.from('Communities').update({imagePath}).eq('id', communityID));
    if (!updateCommunityImageResponse.success) return res.status(500).json({error: updateCommunityImageResponse["error"]});

    res.status(201).json({message: 'Community image path updated successfully', data: {communityID, imagePath}});
});

app.post('/updateEventImage', async (req, res) => {
    const {imagePath, communityID, eventID} = req.body;
    const updateCommunityImageResponse = await executeQuery(supabase.from('Events').update({imagePath}).eq('id', eventID).eq('communityID', communityID));
    if (!updateCommunityImageResponse.success) return res.status(500).json({error: updateCommunityImageResponse["error"]});

    res.status(201).json({message: 'Community image path updated successfully', data: {eventID, imagePath}});
});

app.get('/communities', async (req, res) => {
    const communitiesResponse = await executeQuery(supabase.from('Communities').select('*'));
    if (!communitiesResponse.success) return res.status(500).json({error: communitiesResponse["error"]});

    for (let i = 0; i < communitiesResponse.data.length; i++) {
        communitiesResponse.data[i]['imagePath'] = await getImage(`images/communities/${communitiesResponse.data[i]['id']}/communityImage.png`);

    }

    res.json(communitiesResponse.data);
});

app.post('/createEvent', async (req, res) => {
    const {title, description, communityID, userID, dateOfTheEvent} = req.body;

    const createEventResponse = await executeQuery(supabase.from('Events').insert([{
        title,
        description,
        communityID,
        userID,
        dateOfTheEvent
    }]));
    if (!createEventResponse.success) return res.status(500).json({error: createEventResponse["error"]});

    const createdEventIDResponse = await executeQuery(supabase.from('Events').select('id').eq('communityID', communityID).eq('userID', userID));
    if (!createdEventIDResponse.success) return res.status(500).json({error: createdEventIDResponse["error"]});

    let eventID = createdEventIDResponse.data[0]["id"];

    const eventUserResponse = await executeQuery(supabase.from('EventUser').insert([{
        eventID,
        userID,
        communityID
    }]));
    if (!eventUserResponse.success) return res.status(500).json({error: eventUserResponse["error"]});

    res.status(201).json({message: 'Event created successfully', data: {...req.body, eventID}});
});

app.get('/userEvents', async (req, res) => {
    const {userID} = req.query;

    const userEventsResponse = await executeQuery(supabase.from('EventUser').select('*').eq('userID', userID));
    if (!userEventsResponse.success) return res.status(500).json({error: userEventsResponse["error"]});

    const userEventsIDs = userEventsResponse.data.map(e => e['eventID']);

    const eventsResponse = await executeQuery(supabase.from('Events').select('*').in('id', userEventsIDs));
    if (!eventsResponse.success) return res.status(500).json({error: eventsResponse['error']});

    res.status(201).json({message: 'User events found!', data: eventsResponse.data});
});

app.get('/communityEvents', async (req, res) => {
    const {communityID} = req.query;

    const communityEventsResponse = await executeQuery(supabase.from('Events').select('*').eq('communityID', communityID).order('dateOfTheEvent', {ascending: true}));
    if (!communityEventsResponse.success) return res.status(500).json({error: communityEventsResponse["error"]});

    let i = 0;
    for (const event of communityEventsResponse.data) {
        let eventID = communityEventsResponse.data[i]['id'];
        communityEventsResponse.data[i++]['imagePath'] = await getImage(`images/communities/${communityID}/${eventID}/image.png`);
    }

    res.status(201).json({message: 'Community events found!', data: communityEventsResponse.data});
});

app.get('/events', async (req, res) => {
    const eventsResponse = await executeQuery(supabase.from('Events').select('*'));
    if (!eventsResponse.success) return res.status(500).json({error: eventsResponse["error"]});

    res.status(201).json({message: 'User events found!', data: eventsResponse.data});
});

app.get('/interests', async (req, res) => {
    const interestsResponse = await executeQuery(supabase.from('Interests').select('*'));
    if (!interestsResponse.success) return res.status(500).json({error: interestsResponse["error"]});

    res.status(201).json({message: 'Interests found!', data: interestsResponse.data});
});

app.get('/test', async (req, res) => {
    const {data, error} = await supabase.from('test').select('*');

    if (error) {
        console.error('Error en Supabase:', error);
        return res.status(500).json({error: error.message});
    }

    res.json(data);
});

// New endpoint for user registration using Supabase Auth
app.post('/user-register', async (req, res) => {
    const {email, password, username, description} = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({error: 'Email, password, and username are required'});
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({error: 'Invalid email format'});
    }

    try {
        // Register the user with Supabase Auth
        const {data, error} = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            console.error('Error during user registration:', error);
            return res.status(400).json({error: error.message});
        }

        // Insert additional user data into the Users table
        const {data: userData, error: userError} = await supabase.from('Users').insert([
            {
                id: data.user.id, // Use the ID from Supabase Auth
                username: username,
                email: email,
                description: description,
            },
        ]);

        if (userError) {
            console.error('Error inserting user into Users table:', userError);
            return res.status(500).json({error: userError.message});
        }

        res.status(201).json({message: 'User registered successfully', user: userData});
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({error: 'An unexpected error occurred'});
    }
});

// New endpoint for user login using Supabase Auth
app.post('/login', async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required'});
    }

    try {
        // Authenticate the user with Supabase Auth
        const {data: authData, error: authError} = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            console.error('Error during login:', authError);
            return res.status(401).json({error: authError.message});
        }

        res.status(200).json({
            message: 'Login successful',
            token: authData.session.access_token,
            userID: authData.session.user.id
        });
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({error: 'An unexpected error occurred'});
    }
});

// GET /Feed -> Devuelve la lista de eventos y anuncios recientes de las comunidades a las que pertenece el usuario
app.get('/feed', async (req, res) => {
    const {userId} = req.query;
    if (!userId) {
        return res.status(400).json({error: 'El parámetro userId es requerido'});
    }

    try {
        // 1. Buscar el usuario
        const user = await getUser(userId);

        // 2. Obtener las comunidades a las que pertenece el usuario
        const communityIds = await getCommunityIds(userId);
        if (communityIds.length === 0) {
            return res.json([]);
        }

        // 3. Definir la fecha límite: hace 2 días
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

        // 4. Obtener eventos (excluyendo los ya unidos) y anuncios recientes
        const eventsData = await getRecentEvents(communityIds, twoDaysAgo, userId);
        const announcesData = await getRecentAnnounces(communityIds, twoDaysAgo);

        // 5. Transformar los datos al formato del feed
        const eventsFeed = eventsData.map(ev => ({
            id: ev.ID,           // Ajusta según tu esquema (puede ser "ID" o "id")
            type: 'event',
            communityID: ev.communityID,
            title: ev.title,
            content: ev.description,
            date: ev.created_at,
        }));

        const announcesFeed = announcesData.map(an => ({
            id: an.ID,
            type: 'news',
            title: an.title,
            content: an.content,
            date: an.created_at,
        }));

        // 6. Combinar y ordenar (más recientes primero)
        const combinedFeed = [...eventsFeed, ...announcesFeed].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        return res.json(combinedFeed);

    } catch (error) {
        console.error('Error al obtener feed:', error);
        res.status(500).json({error: error.message});
    }
});

app.get('/communitiesEventsExcludingUser', async (req, res) => {
    const {userID} = req.query;

    const userCommunitiesIDsResponse = await executeQuery(
        supabase.from('CommunityUser')
            .select('communityID')
            .eq('userID', userID)
    );
    if (!userCommunitiesIDsResponse.success) return res.status(500).json({
        error: userCommunitiesIDsResponse["error"],
        message: "Getting userCommunitiesIDsResponse"
    });
    userCommunitiesIDsResponse.data = userCommunitiesIDsResponse.data.map(e => e['communityID']);

    const publicUserCommunitiesResponse = await executeQuery(
        supabase.from('Communities')
            .select('id')
            .eq('isPrivate', false)
            .in('id', userCommunitiesIDsResponse.data)
    );
    if (!publicUserCommunitiesResponse.success) return res.status(500).json({
        error: publicUserCommunitiesResponse["error"],
        message: "Getting publicUserCommunitiesResponse"
    });

    const userCommunitiesIDs = publicUserCommunitiesResponse.data.map(e => e['id']);

    const userCommunitiesEventsIDs = await executeQuery(
        supabase.from('EventUser')
            .select('eventID')
            .eq('userID', userID)
            .in('communityID', userCommunitiesIDs)
    );
    if (!userCommunitiesEventsIDs.success) return res.status(500).json({
        error: userCommunitiesEventsIDs["error"],
        message: "Getting eventsIDsExcludingUserResponse"
    });
    userCommunitiesEventsIDs.data = userCommunitiesEventsIDs.data.map(e => e['eventID']);

    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

    const userCommunitiesEventsExcludingUserResponse = await executeQuery(
        supabase.from('Events')
            .select('*')
            .not('id', 'in', `(${userCommunitiesEventsIDs.data.join(',')})`)
            .in('communityID', userCommunitiesIDs)
            .gte('created_at', twoDaysAgo)
            .order('created_at', {ascending: true})
    );
    if (!userCommunitiesEventsExcludingUserResponse.success) return res.status(500).json({
        error: userCommunitiesEventsExcludingUserResponse["error"],
        message: "Getting userCommunitiesEventsExcludingUserResponse"
    });

    return res.status(201).json({
        message: 'Event created successfully',
        data: userCommunitiesEventsExcludingUserResponse.data
    });
});

// GET /nonBelongingCommunities -> Devuelve la lista de comunidades desde la tabla "Communities"
app.get('/nonBelongingCommunities', async (req, res) => {
    const {userId} = req.query;

    if (!userId) {
        return res.status(400).json({error: 'El parámetro userId es requerido'});
    }

    try {
        const {data: user, error: userError} = await supabase.from('Users').select('*').eq('id', userId).single();

        // Consulta 1: Obtener comunidades públicas
        const {data, error} = await supabase.from('Communities').select('id, userID, name, description, created_at')
            .eq('isPrivate', false)
            .limit(3);

        // Consulta 2: Obtener las comunidades en las que el usuario ya está
        const {data: memberships, error: membershipsError} = await supabase
            .from('CommunityUser')
            .select('communityID')
            .eq('userID', user.id);

        // Extraer los IDs de las comunidades a las que pertenece el usuario
        const membershipIDs = memberships.map(item => item.communityID);

        // Filtrar las comunidades para eliminar aquellas en las que el usuario ya está
        const filteredCommunities = data.filter(community => !membershipIDs.includes(community.id));


        if (error) return res.status(500).json({error: error.message});
        return res.json(filteredCommunities);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// GET /events -> Devuelve los eventos a los que el usuario pertenece
app.get('/getCalendarEvents', async (req, res) => {
    const {userID} = req.query;

    if (!userID) {
        return res.status(400).json({error: 'El parámetro userId es requerido'});
    }

    try {
        // 1. Consultar la tabla "EventUser" para obtener los eventIDs a los que pertenece el usuario
        const {
            data: eventUserData,
            error: eventUserError
        } = await supabase.from('EventUser').select('eventID').eq('userID', userID);

        if (eventUserError) throw eventUserError;

        const eventIDs = eventUserData.map(item => item.eventID);
        if (eventIDs.length === 0) {
            // Si el usuario no tiene eventos, se devuelve un arreglo vacío
            return res.json([]);
        }

        // 2. Consultar la tabla "Events" para obtener los eventos cuyos IDs están en eventIDs
        const {data, error} = await supabase.from('Events').select('*').in('id', eventIDs);

        if (error) throw error;

        return res.json(data);
    } catch (error) {
        console.error('Error al obtener eventos del usuario:', error);
        return res.status(500).json({error: error.message});
    }
});

// POST /
app.post('/joinEvent', async (req, res) => {
    const {userID, eventID, communityID} = req.body;

    if (!userID || !eventID || !communityID) {
        return res.status(400).json({error: 'userID, eventID y communityID son requeridos'});
    }

    // Asignar la fecha de creación actual en formato ISO
    const created_at = new Date().toISOString();

    try {
        const {data, error} = await supabase.from('EventUser').insert([{userID, eventID, communityID, created_at}]);

        if (error) {
            console.error('Error al crear EventUser:', error);
            return res.status(500).json({error: error.message});
        }

        return res.status(201).json({message: 'EventUser creado correctamente', data});
    } catch (err) {
        console.error('Error inesperado:', err);
        return res.status(500).json({error: 'Error inesperado'});
    }
});

app.post('/joinCommunity', async (req, res) => {
    const {userID, communityID} = req.body;

    if (!userID || !communityID) {
        return res.status(400).json({error: 'userID y communityID son requeridos'});
    }

    // Asignar la fecha de creación actual en formato ISO
    const created_at = new Date().toISOString();
    const communityRole = 'member';

    try {
        const {data, error} = await supabase.from('CommunityUser').insert([{
            userID,
            communityID,
            created_at,
            communityRole
        }]);

        if (error) {
            return res.status(500).json({error: error.message});
        }

        return res.status(201).json({message: 'El usuario se ha unido a la comunidad correctamente', data});

    } catch (err) {
        return res.status(500).json({error: 'Error inesperado'});
    }
});

app.get("/users", async (req, res) => {
    const {communityID} = req.query;

    if (!communityID) {
        return res.status(400).json({error: 'communityID son requeridos'});
    }

    const userIdsResponse = await executeQuery(supabase.from('CommunityUser').select('userID, communityRole').eq('communityID', communityID));
    if (!userIdsResponse.success) return res.status(500).json({error: userIdsResponse["error"]});

    const usersResponse = await executeQuery(supabase.from('Users').select('*').in('id', userIdsResponse.data.map(user => user.userID)));
    if (!usersResponse.success) return res.status(500).json({error: usersResponse["error"]});
    const users = usersResponse.data;
    const data = users.map(user => {
        const userId = user.id;
        const communityRole = userIdsResponse.data.find(u => u.userID === userId).communityRole;
        return {...user, communityRole};
    });
    return res.status(201).json({message: 'Usuarios encontrados', data});
});

app.get('/updateusers', async (req, res) => {
    const {userID, communityID, role} = req.query;

    if (!userID || !communityID || !role) {
        return res.status(400).json({error: 'userID, communityID y role son requeridos'});
    }

    try {
        const {
            data,
            error
        } = await supabase.from('CommunityUser').update({communityRole: role}).eq('userID', userID).eq('communityID', communityID);

        if (error) {
            return res.status(500).json({error: error.message});
        }

        return res.status(201).json({message: 'El usuario ha actualizado su rol correctamente', data});

    } catch (err) {
        return res.status(500).json({error: 'Error inesperado'});
    }
});

app.get('/community', async (req, res) => {
    const { communityID } = req.query;

    if (!communityID) {
        return res.status(400).json({error: 'communityID es requerido'});
    }

    const communityResponse = await executeQuery(supabase.from('Communities').select('*').eq('id', communityID));
    if (!communityResponse.success) return res.status(500).json({error: communityResponse["error"]});

    communityResponse.data[0]['imagePath'] = await getImage(`images/communities/${communityID}/communityImage.png`);

    return res.status(201).json({message: 'Usuarios encontrados', data: communityResponse.data});
});

app.post('/leaveCommunity', async (req, res) => {
    const { userID, communityID } = req.body;

    const leaveCommunityResponse = await executeQuery(
        supabase.from('CommunityUser')
            .delete()
            .eq('userID', userID)
            .eq('communityID', communityID)
            .select('*')
    );
    if (!leaveCommunityResponse.success) return res.status(500).json({error: leaveCommunityResponse["error"]});

    console.log(leaveCommunityResponse.data)

    const leaveEventResponse = await executeQuery(
        supabase.from('EventUser')
            .delete()
            .eq('userID', userID)
            .eq('communityID', communityID)
            .select('*')
    );
    if (!leaveEventResponse.success) return res.status(500).json({error: leaveEventResponse["error"]});

    return res.status(201).json({message: 'Community left properly', data: {community: leaveCommunityResponse.data, events: leaveEventResponse.data}});
});

app.post('/leaveEvent', async (req, res) => {
    const { userID, eventID } = req.body;

    const leaveEventResponse = await executeQuery(
        supabase.from('EventUser')
            .delete()
            .eq('userID', userID)
            .eq('eventID', eventID)
            .select('*')
    );
    if (!leaveEventResponse.success) return res.status(500).json({error: leaveEventResponse["error"]});

    return res.status(201).json({message: 'Event left properly', data: leaveEventResponse.data});
});

app.get('/userCommunities', async (req, res) => {
    const { userID } = req.query;

    const userCommunitiesIDsResponse = await executeQuery(
        supabase.from('CommunityUser')
            .select('communityID')
            .eq('userID', userID)
    );
    if (!userCommunitiesIDsResponse.success) return res.status(500).json({error: userCommunitiesIDsResponse["error"]});

    userCommunitiesIDsResponse.data = userCommunitiesIDsResponse.data.map(c => c['communityID']);

    const userCommunitiesResponse = await executeQuery(
        supabase.from('Communities')
            .select('id')
            .in('id', userCommunitiesIDsResponse.data)
    );
    if (!userCommunitiesResponse.success) return res.status(500).json({error: userCommunitiesResponse["error"]});

    return res.status(201).json({message: 'User communities found!', data: userCommunitiesResponse.data});
});

export default app;