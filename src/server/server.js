const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 8081; 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const Auth= "412da268fa8e2241ecd77e1c7fd15a";

// GET STORES
app.get('/api/stores', async (req, res) => {
    
    try {
        const response = await axios.get('https://shop.interconnecta.dev/api/stores', {
            headers: {
                Authtoken: `${Auth}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(error.response.status).json({ error: 'Error' });
    }
});

// SAVE STORES
app.post('/api/stores', async (req, res) => {
    try {
        const response = await axios.post('https://shop.interconnecta.dev/api/stores', req.body, {
            headers: {
                Authtoken: `${Auth}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error', error);
        res.status(error.response.status).json({ error: 'Error' });
    }
});
// ----------------------------------------------------------------------------------------------------------------------
// GET PRODUTCS
app.get('/api/products', async (req, res) => {
    try {
        const response = await axios.get('https://shop.interconnecta.dev/api/products', {
            headers: {
                Authtoken: `${Auth}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error', error);
        res.status(error.response.status).json({ error: 'Error' });
    }
});

// SAVE PRODUCTS
app.post('/api/products', async (req, res) => {
    console.log(req);
    try {
        const response = await axios.post('https://shop.interconnecta.dev/api/products', req.body, {
            headers: {
                Authtoken: `${Auth}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(error.response.status).json({ error: 'Error' });
    }
});

// Server
app.listen(port, () => {
    console.log("The Server is Running on port "+port);
});
