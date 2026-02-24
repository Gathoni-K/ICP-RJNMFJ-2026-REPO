# Frontend Interface of our Student Grade Processor API.

## Setup

-Create the project using:

    npm create vite@latest appName -- --template react-ts

-Install Tailwind CSS as per the instructions in the official docs.

-Project structure:

    assets - stores static files like images, fonts
    components - reusable UI components used across the entire application and does not contain business logic.
    features - core of application, containing folders for each specific feature
    hooks - contains global reusable custom hooks.
    pages - pages of application
    lib - connect external APIs and managaing data fetching logic.
    utils - stores simple pure utility functions performing general logic.
    types - stores our TS types.
    _tests_ - stores our test code
    