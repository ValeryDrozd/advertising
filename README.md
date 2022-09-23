# Advertising Info Script

The main idea of this project is to create a script that can be injected into the website with online advertising and show all the data connected to it.


## Parts of the project
- Main script (`script.js`),
- Front-end part that will be shown on the `<iframe>` tag,
- Back-end part that server front-end, main script and has an endpoint that receives URLs from front-end part.

## Installation
To install all dependencies, just this command should be used:
```bash
yarn install # or just yarn
```
As the project is constructed on `yarn workspaces`, this command installs all dependencies both for front-end and back-end. Also this command builds React front-end to deploy.

## Project start
To start the project, this command should be used:
```bash
yarn start
```

## Usage
This script can be found on:
```url
http://<your_domain>/script
```
The script can be injected into website using such tools like `Requestly` or `Charles`.

The example of using `Requestly`:
![](/screenshots/Demo%20Injection.png)

## Hosting
The project is currently hosted on Heroku, the main script of it can be found here:
```
https://advertising-drozd.herokuapp.com/script
```

