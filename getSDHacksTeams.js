/*
 * Run this script with
 *      node getSDHacksTeams.js <path to cherry pick json array>
 * 
 * The cherry pick json file is optional - if it is not provided the script will default to building the whole teams CSV
 * */

const mongoose = require('mongoose');
let csv = require('fast-csv');
let fs = require('fs');
require('dotenv').config({silent: process.env.NODE_ENV !== 'development'});

const SDHACKS_OBJECT_ID = '5b2ec82efb6fc048e105e593';

let writeToCSV = (masterList) => {

  console.log('\x1b[32m', '✓ Writing To teams.csv' ,'\x1b[0m');

  let csvStream = csv.createWriteStream({headers: true}),
    writableStream = fs.createWriteStream("teams.csv");

  csvStream.pipe(writableStream);

  masterList.forEach((o, i) => {
    o.team = [...o.team];
    csvStream.write(o);

    if (i === masterList.length - 1) {
      console.log('\x1b[32m', '✓ Done' ,'\x1b[0m');
      return csvStream.end();
    }
  });

}

let cherryPick = (masterList, indexMapper) => {
  //if nothing is passed, build the whole csv
  if (!process.argv[2]) {
    console.log("\x1b[35m", `You did not pass a cherry pick JSON file - building all teams` , "\x1b[35m");
    return writeToCSV(masterList);
  }

  let toBePicked = require(process.argv[2]);
  let newMasterList = [];

  toBePicked.forEach((x) => {
    if (!indexMapper[x]) {
      console.log("\x1b[31m", `X There was an email, ${x} in your file that there is no application for -- this should never happen` , "\x1b[31m");
      return;
    }
    newMasterList.push(masterList[indexMapper[x]]);
  })

  return writeToCSV(newMasterList);
}

let bfs = (vertices) => {

  /*vertices = {
    'David': ['Panda'],
    'Yacoub': ['Panda'],
    'Nick' : ['Yacoub', 'David'],
    'Panda' : [],
  };*/
 
  let visited = new Set(),
    indexMapper = {},
    masterList = [];

    console.log('\x1b[32m', '✓ Building Teams' ,'\x1b[0m');

  //for each node...
  Object.keys(vertices).forEach((v, j) => {


    let q = [v],
      currTeam = new Set(),
      flag = true,
      info = 'Applications Not Found: ';

    while (q.length !== 0) {
      v = q.shift();

      //don't revisit
      if (visited.has(v)) {
        continue;
      }

      visited.add(v);
      currTeam.add(v);

      //if an application for this email exists..
      if (vertices[v]) {
        //loop through children
        vertices[v].forEach(c => {

          if (visited.has(c)) {

            //if we hit a child that exists in masterList
            if (masterList[indexMapper[c]]) {

              //update masterList and reflect the change in indexMapper
              masterList[indexMapper[c]].team = masterList[indexMapper[c]].team.add(v);
              indexMapper[v] = indexMapper[c];

              //set flag to end BFS 
              flag = false;
            }
            return;
          }
          else {

            //unvisit node, enqueue it
            q.push(c);
          }
        });
      }
      else {
        //no application found
        info += v + "     ";
      }

      //break out of the BFS
      if (flag === false) {
        break;
      }
    }

    //these changes are already made in lines 74-76 for when flag = false
    if (flag && currTeam.size > 0) {
      currTeam.forEach(c => indexMapper[c] = masterList.length);
      masterList.push({team: currTeam, info});
    }

    //write to CSV on end of this loop
    if (j === Object.keys(vertices).length - 1) {
      return cherryPick(masterList, indexMapper);
    }
  });
};

let buildVertices = (users) => {
  console.log('\x1b[32m', '✓ Building Graph Vertices' ,'\x1b[0m');
  let vertices = {};

  users.forEach((user, i) => {
    let currNodeChildren = [];
    if (user.teammates && user.teammates.length > 0) {
      user.teammates.forEach(x => {
        if (x.length > 0) currNodeChildren.push(x.toLowerCase());
      });
    }
    vertices[user.account.email.toLowerCase()] = currNodeChildren;

    if (i === users.length - 1) {
      return bfs(vertices);
    }
  });
};

let main = () => {
  const User = mongoose.model('User');

  User.find({event: SDHACKS_OBJECT_ID, deleted: false, sanitized: true})
    .populate('account')
    .then(buildVertices)
};

mongoose.connect(`mongodb://${process.env.MLAB_READONLY_USER}` +
  `:${process.env.MLAB_READONLY_PASS}@ds233218.mlab.com:33218/heroku_7qhq69wb`)
  .then(() => {
    console.log('\x1b[32m', '✓ Connected to Production Database' ,'\x1b[0m');
    require('./src/server/models/user');
    require('./src/server/models/account');
    main();
  })
