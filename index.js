const http = require('http');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
// Connection to Mongo
async function main() {
    const uri = `mongodb+srv://sharathchandrareddydumpali:RzYycpwr3EQhQFKx@cluster0.5v8ee.mongodb.net/BooksDB?retryWrites=true&w=majority`;
    const client = new MongoClient(uri);
    // tries to Connect 
    try {
        await client.connect();
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

// Create a server

const server = http.createServer(async (req, res) => {
    // Get the path of the requested resource
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
        // Api Url 
    } else if (req.url === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });    //Can access from all origins
        const uri = `mongodb+srv://sharathchandrareddydumpali:RzYycpwr3EQhQFKx@cluster0.5v8ee.mongodb.net/BooksDB?retryWrites=true&w=majority`; // MongoDB connect Url
        const client = new MongoClient(uri);
        try {
            await client.connect();
            let response = await getDataFromMongo(client)
            res.end(JSON.stringify(response)) // change the data to strings from objects or arrays
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
// if nothing found
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(" <h1> 404 Nothing Found </h1>")
    }
});

// Get data from Mongo

async function getDataFromMongo(client) {
    const cursor = client.db("BooksDB").collection("Books")
        .find();
    const results = await cursor.toArray();
    if (results.length > 0) {
        return results[0];
    }
}
// Port either 4040 or any available port in the render or netlify
const PORT = process.env.PORT || 4040;
server.listen(PORT, () => console.log(`Our server is running on port: ${PORT}`));