// Dependencies
const fs = require('fs');
const Repos = require('../Models/repoModel');

// Generalized API Fetch Call
async function launchQuery() {
    try {
        /*
        Time Complexity: 
            -> O(n): Fetching results and then iterating through to pull repo name
        Possible optimization:
            -> Launch concurrent child proccesses that finish with Promise.allSettled() and get recorded.
            -> Order won't be mantained and will be written in order of completion
            -> Dependent on bandwith
        */
        let num = await Repos.countRepos(); //Gets number of repo from entity (Google in this case)
        data = []
        for (let i = 1 ; i <= Math.ceil(num/100); i++) {
            /*
            Point of Faliure Causes:
                1. Possible that API Rate Limit is hit while call is being executed.
                2. Malformed query shot to API
            */
            temp =  await Repos.fetchRepos(i); // fetches 100 repos from page i 
            for (var t in temp) {
                data.push({'name': temp[t].name}); // iterates and pulls name
            }
        }
        return data;
    } catch(e) {
        console.log(e);
    }
}

async function getRepos(req,res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    data = await launchQuery()  //forcing sync call to wait for data
    if (!data) {
        // If API Rate Limit exceeded send error
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'FAILED TO EXECUTE QUERY'}));
    } else {
        // Succeeded so return data in JSON
        res.end(JSON.stringify(data));
    }
};

async function writeRepos(req,res) {
    fs.unlink('tmp/knock_interview.json.gz', 
    (errors) => {
        if (errors) {
            /*
            Point of Faliure Causes:
                1. File aready deleted 
                2. Error while deleting file
            */
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'FAILED TO DELETE FILE'}));
        };
        console.log('knock_interview.json.gz was deleted')
    });
    data = await launchQuery(); //forcing sync call to wait for data
    if (!data) {
        // If API Rate Limit exceeded send error
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'FAILED TO EXECUTE QUERY'}));
    } else {
        // Succeeded so write data in JSON into file
        fs.writeFile('tmp/knock_interview.json.gz', JSON.stringify(data), 
        (errors) => {
            if (errors) {
                // Error while writing to file.
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'FAILED TO WRITE TO FILE'}))
            }
        });
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end('Written To File!');
    }
};

module.exports = {
    getRepos,
    writeRepos
}