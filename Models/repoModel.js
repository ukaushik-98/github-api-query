const https = require('https');
const { resolve } = require('path');
const headers = {
    hostname: "api.github.com",
    method: 'GET',
    headers: {
        'user-agent': 'node.js',
    }
}

const launchQuery = (path) => {
    headers.path = path
    return new Promise((resolve,reject) => {
        var req = https.get(headers, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                console.log(res.statusCode)
                return reject(new Error('statusCode=' + res.statusCode));
            }
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
            
        }).on('error', (e) => {
            console.error(e)
        });
        req.end();
    })
}

const countRepos = async () => { 
    const result = await launchQuery('/users/Google');
    return result.public_repos;
}

const fetchRepos = async (pageNumber) => {
    console.log(`/users/Google/repos?per_page=100&page=${pageNumber}`)
    return await launchQuery(`/users/Google/repos?per_page=100&page=${pageNumber}`);
};

module.exports = {
    countRepos,
    fetchRepos
}