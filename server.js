//Dependencies
const http = require('http');
const hostname = 'localhost';
const PORT = process.env.PORT || 5000;
const {getRepos, writeRepos} = require('./Controllers/repoController');

//Creating Server
const server = http.createServer((req, res) => {
    if (req.url === '/v1/google/repositories' && req.method === 'GET') {
        // GET '/v1/google/repositories'
        getRepos(req,res);
    } else if (req.url === '/v1/google/repositories/to_file'  && req.method === 'PUT') {
        // PUT '/v1/google/repositories/to_file'
        writeRepos(req,res);
    } else {
        // Error Handle -> Not a valid ROUTE
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end('Route Not Found')
    }
});

server.listen(PORT, hostname, () => {
    console.log(`Server running at http://${hostname}:${PORT}/`);
});