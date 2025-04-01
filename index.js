const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., CSS, images) from the 'views' directory
app.use(express.static(path.join(__dirname, 'views')));

// Home page route
app.get('/', async (req, res) => {
    const homePath = path.join(__dirname, '/views/login page.html');
    const home = await fs.promises.readFile(homePath, 'utf-8');
    res.send(home);
});

// Login page route
app.get('/login', async (req, res) => {
    const UsersprofilePath = 'Users.json';
    const UprofilePage = await fs.promises.readFile(UsersprofilePath, 'utf-8');
    const user = JSON.parse(UprofilePage);

    const loginPath = path.join(__dirname, '/views/Login page.html');
    const loginPage = await fs.promises.readFile(loginPath, 'utf-8');
    res.send(loginPage);
});

// Handle profile form submission (POST request)
app.post('/login', async (req, res) => {
    const { firstName, lastName, email, bio, username, password } = req.body;

    // Create a user object with form data
    const newUser = { firstName, lastName, email, bio, username, password };

    try {
        const dataPath = path.join(__dirname, 'Users.json');
        let users = [];

        // If the Users.json file exists, read and parse the current content
        if (fs.existsSync(dataPath)) {
            const fileContent = await fs.promises.readFile(dataPath, 'utf-8');
            users = JSON.parse(fileContent); // Parse the existing users
        }

        // Check if the username already exists
        const isUsernameTaken = users.some(user => user.username === username);

        if (isUsernameTaken) {
            // Render the login page with an error message
            const loginPath = path.join(__dirname, '/views/Login page.html');
            const loginPage = await fs.promises.readFile(loginPath, 'utf-8');
            return res.send(
                loginPage.replace(
                    '{{error}}',
                    'This username is already taken. Please choose a different one.'
                )
            );
        }

        // Add the new user to the list
        users.push(newUser);

        // Write the updated user list back to the JSON file
        await fs.promises.writeFile(dataPath, JSON.stringify(users, null, 2));

        res.redirect('/login'); // Redirect to login page after saving the profile
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).send('An error occurred while saving the profile.');
    }
});

// Profile page route
app.get('/profile', async (req, res) => {
    const profilePath = path.join(__dirname, '/views/PAVCA.html');
    const profilePage = await fs.promises.readFile(profilePath, 'utf-8');
    res.send(profilePage);
});

// Handle login form submission (POST request)
app.post('/submit', async (req, res) => {
    const { username, password } = req.body;

    try {
        const dataPath = path.join(__dirname, 'Users.json');
        let users = [];

        // Read and parse the existing users
        if (fs.existsSync(dataPath)) {
            const fileContent = await fs.promises.readFile(dataPath, 'utf-8');
            users = JSON.parse(fileContent);
        }

        // Validate username and password
        const user = users.find(
            user => user.username === username && user.password === password
        );

        if (user) {
            res.redirect('/home'); // Redirect to home page if login is successful
        } else {
            const loginPath = path.join(__dirname, '/views/Login page.html');
            const loginPage = await fs.promises.readFile(loginPath, 'utf-8');
            return res.send(
                loginPage.replace('{{error}}', 'Invalid username or password.')
            );
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('An error occurred while processing your login.');
    }
});



// Serve home page (for after login)
app.get('/home', async (req, res) => {
    const homePagePath = path.join(__dirname, '/views/Home.html');
    const homePage = await fs.promises.readFile(homePagePath, 'utf-8');
    res.send(homePage);
});

// Serve home page (for after login)
app.post('/mainGroup', async (req, res) => {
    const mainGroupPath = path.join(__dirname, '/views/main group page.html');
    const mainG = await fs.promises.readFile(mainGroupPath, 'utf-8');
    
    // const homePagePath = path.join(__dirname, '/views/Home.html');
    // const homePage = await fs.promises.readFile(homePagePath, 'utf-8');
    res.send(mainG);
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
