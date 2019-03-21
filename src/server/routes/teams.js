function convertToCSV(masterList) {
    // members 2-4 are optional
    let csv = `"member1", "member2", "member3", "member4"\n`;
  
    // for each team, append all of its members onto a single line
    let i = 0;
    masterList.forEach((group) => {
      i = 0;
      group.team.forEach((member) => {
        csv += `"${member}"`;
        if(i !== group.team.size - 1) {
          csv += ",";
        }
        i++;
      });
      csv += "\n";
    });
    return csv;
  };

function bfs(vertices) {
  
  /*vertices = {
    'David': ['Panda'],
    'Yacoub': ['Panda'],
    'Nick' : ['Yacoub', 'David'],
    'Panda' : [],
  };*/
  
  let visited = new Set(),
    indexMapper = {},
    masterList = [];

    console.log('Building Teams');

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
  });
  return convertToCSV(masterList);
};

function buildVertices(users) {
  console.log('Building Graph Vertices');
  let vertices = {};
  users.forEach((user, i) => {
    let currNodeChildren = [];
    if (user.teammates && user.teammates.length > 0) {
      user.teammates.forEach(x => {
        if (x.length > 0) currNodeChildren.push(x.toLowerCase());
      });
    }
    vertices[user.account.email.toLowerCase()] = currNodeChildren;
  });
  return bfs(vertices);
};

module.exports = {
    buildVertices
};