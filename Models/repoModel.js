// Dependencies
const https = require('https');
const { resolve } = require('path');

// Header used in API calls
const headers = {
    hostname: "api.github.com",
    method: 'GET',
    headers: {
        'user-agent': 'node.js',
    }
}

// Creating API CALL
const launchQuery = (path) => {
    headers.path = path //Adding necessary path to execute specific request
    return new Promise((resolve,reject) => {
        // Get Request wrapped in promise -> allows async and handles errors with reject
        var req = https.get(headers, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                console.log(res);
                return reject('statusCode=' + res.statusCode);  //API call failed
            }
            let data = '';
            res.on('data', (chunk) => data += chunk);   //Adding data chunk to string 
            res.on('end', () => resolve(JSON.parse(data))); //Parsing completed data chunk
            
        }).on('error', (e) => {
            console.error(e)    //Error Handling
        });
        req.end();  //Completed request
    })
}

const countRepos = async () => {
    /*
    Query that gets number of repos from entity (Google). 
    This will be used to automate how many times the api calls need to be made.
    */ 
    const result = await launchQuery('/users/Google');
    return result.public_repos;
}

const fetchRepos = async (pageNumber) => {
    /*
    Query that gets repos from entity (Google).
    Pagination Issue:
        - Github's API has a hard max limit of 100 repos per page
        - Cycle through ceiling of # of repos/100 to get all repos
        - Update what page to get via page number
    */ 
    console.log(`/users/Google/repos?per_page=100&page=${pageNumber}`)
    return await launchQuery(`/users/Google/repos?per_page=100&page=${pageNumber}`);
};

module.exports = {
    countRepos,
    fetchRepos
}