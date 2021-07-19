const fs = require('fs');
const Repos = require('../Models/repoModel');

async function launchQuery() {
    try {
        let num = await Repos.countRepos();
        // let calls = 5; //number of calls running in one loop
        data = []
        for (let i = 1 ; i <= Math.ceil(num/100); i++) {
            temp =  await Repos.fetchRepos(i);
            for (var t in temp) {
                data.push({'name': temp[t].name});
            }
        }
        return data;
    } catch(e) {
        console.log(e);
    }
}

async function getRepos(req,res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    data = await launchQuery()
    if (!data) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'FAILED TO EXECUTE QUERY'}));
    } else {
        res.write(JSON.stringify(data));
        res.end();
    }
};

async function writeRepos(req,res) {
    fs.unlink('tmp/knock_interview.json.gz', 
    (errors) => {
        if (errors) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'FAILED TO DELETE FILE'}));
        };
        console.log('knock_interview.json.gz was deleted')
    });
    data = await launchQuery();
    if (!data) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'FAILED TO EXECUTE QUERY'}));
    } else {
        fs.writeFile('tmp/knock_interview.json.gz', JSON.stringify(data), 
        (errors) => {
            if (errors) {
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'FAILED TO WRITE TO FILE'}))
            }
        });
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write('Written To File!');
        res.end();
    }
};

module.exports = {
    getRepos,
    writeRepos
}