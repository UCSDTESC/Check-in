## src/client/pages - Pages. Pages Everywhere.

An `XYZPage` in this directory implements a page in the application. Any `XYZPage` can define redux actions in `XYZPage/actions`, reducers in `XYZPage/reducers` or components it uses in `XYZPage/components`.

```
├── AdminsPage
    * [Admin with role Developer only] It shows a list of all admins in the system.
├── AlertPage.tsx
    * This is an abstraction that allows a page to have "alerts" at the top of it. An `XYZPage` can extend this class to implement alerts.
├── ApplyPage
    * This is the hackathon registration page.
├── CheckinPage
    * [Admin only] This page is the QR Code Checkin system for checkin into an event.
├── DashboardPage
    * [Admin only] This page is the "opening" dashboard for an admin when they log into the system. 
    * It decides what to show to the admin depending on their role and the API response
├── EventPage
    * [Admin only] This is the main dashboard for an event. It has tabs (extends `TabularPage.tsx`) for Actions, Administrators, Settings and Statistics 
├── ForgotPage.tsx
    * This page implements the forgot password functionality for users.
├── HomePage
    * This is the main page that loads when a user goes to www.tesc.events
    * This page handles 2 states 
        - showing all apply-able events when the user is not logged in, and show
        - showing all existing applications when the user is logged in
├── LoginPage.tsx
    * This page shows a username and password field for a user to login.
├── NewEventPage
    * [Admin only] This page allows an admin to create a new event.
├── NotFound.tsx
    * This is the 404 page. react-router is set up to show this when none of the routes are rendered.
├── ResetPage.tsx
    * [User only] This page allows a user to reset their password (linked from a password reset email)
├── ResumesPage
    * [Admin only] This is the sponsor-tool. It provides a dashboard with sorting / filtering features that is given to sponsors who pay for access to tesc.events
├── TabularPage.tsx
    * This is an abstraction that lets a page that extends it implement tabs.
├── UserPage
    * [User only] This is the page that lets a user view / edit their hackathon application
└── UsersPage
    * [Admin only] This is the page that shows admins a list of users that have applied to an event and lets them update the application if needed.
    * This page also has extensive sorting features for admins.
```