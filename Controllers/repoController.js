const Repos = require('../Models/repoModel');

async function getRepos(req,res) {
    let num = await Repos.countRepos();
    let calls = 5; //number of calls running in one loop
    data = []
    for (let i = 1 ; i <= Math.ceil(num/100); i++) {
        // await Promise.all()
        temp =  await Repos.fetchRepos(i);
        for (var t in temp) {
            data.push({'name':  temp[t].name});
        }
    }
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(data));
    res.end();
};

async function writeRepos(req,res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    console.log(pulled)
    res.write('Written To File!');
    res.end();
    // res.end(JSON.stringify(products))
};

module.exports = {
    getRepos,
    writeRepos
}