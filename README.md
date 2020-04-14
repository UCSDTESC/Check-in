<img src="https://github.com/UCSDTESC/Check-in/blob/master/src/assets/public/img/vectors/tesc-blue.svg" height="40px" />

# TESC Events
[![CircleCI](https://circleci.com/gh/UCSDTESC/Check-in.svg?style=svg)](https://circleci.com/gh/UCSDTESC/Check-in)
### TESC Events is a purpose-built registration and event management system for hackathons, recruiting events or any number of other student-centred initiatives. 
The system allows organisers of events to create, update and manage their events registration system. Students are able to register for the events, manage their registration information and check in to the events all through the platform.

## Requirements
0. Node.js Version >= 8.2.1
1. MongoDB

## Installation
0. Clone Repository
1. Navigate to directory in bash
2. Run ```npm install```
3. Copy ```.env.example``` to a new file ```.env```
4. Enter all of the information into the ```.env``` file
5. Run Mongo in a Docker container - ```docker run --rm -it --name tesc-checkin -p 32678:27017 mongo:latest```
6. Run ```npm run migrate``` to migrate and seed the database
7. If you ever need to "restart" with new data, run ```npm run rollback``` to remove data and migrate again

## Testing (WIP)
0. Run server-side tests with `npx run test-server:unit`
1. See code coverage with `npx run test-server:unit -- --coverage`

## Development
#### All pushes should be made to a feature branch
0. Run ```npm start```
1. Navigate to ```http://localhost:3000/```

## Acknowledgements
* [UCSD Triton Engineering Student Council](http://tesc.ucsd.edu)
* [SD Hacks](https://github.com/SDHacks)
