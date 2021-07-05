## src/client - Frontend 

This directory is the home for the frontend for tesc.events. 

tesc.events' frontend is written entirely in [React.js](https://reactjs.org/). It was initially written in JavaScript, but [was ported over to TypeScript in April 2019](https://github.com/UCSDTESC/Check-in/pull/131)

The entry point to the code is in [main.tsx](https://github.com/UCSDTESC/Check-in/blob/master/src/client/main.tsx)


### Directory Tree
```
├── PrivateRoute.tsx
    * Wrapper Component around react-router-dom's Route to handle rendering only if the user requesting the page is authenticated. Used on admin-side routes.
├── PrivateUserRoute.tsx
    * Wrapper Component around react-router-dom's Route to handle rendering only if the user requesting the page is authenticated. Used on user-side routes.
├── README.md
    * 😊
├── actions
    * This directory holds application-level Redux Actions.
├── auth
    * This directory holds the components, Redux Actions and Redux Reducers related to the login/logout functionality of both users and admins.
├── components
    * Components that are required "globally" or in multiple places in the application are put here. Things like the Navbar, Footer, iOS Switch, Loading spinners etc. go here.
├── data
    * The `data/` directory holds `Api.ts` and `User.ts`, which provide the application with methods to make API calls to our backend.
├── layouts
    * A Layout defines the way our application looks. The application has different layouts depending on what kind of page you are looking at - admins and sponsors have sidebars, and users dont. Layouts are linked to a specific route in the `routes.tsx` file.
├── main.tsx
    * This is the entrypoint to our application. It sets up our app to be used with Redux, react-router and Cookies and makes the intial React.Component.render() call. 
├── pages
    * Each `XYZPage` in the `pages` directory is linked to a specific page of the app. Each page is it’s own directory with an `index.tsx` file in it that defines that page. Each page can also define Redux Actions, Reducers and Components that it will use in `XYZPage/actions`, `XYZPage/reducers` and `XYZPage/components
├── reducers
    * This directory holds application-level Redux Reducers.
├── routes.tsx
    * This directory defines react-router-dom's routes for the application. 
├── static
    * This directory holds "constant" data that the application needs - a list of universities, majors and so on.
└── typings
    * TypeScript type definitions for JavaScript packages used in this application that are directly supplied by us - not by node_modules
```