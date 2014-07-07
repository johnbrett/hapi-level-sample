hapi-level-sample
=================

I created this project to demonstrate the ease and rapid prototyping abilities of HapiJS and LevelDB, and also to offer a boilerplate app for anyone looking to build an application with this technology stack.

All suggestions, recommendations are welcome. I'm still in the early stages of what I will cover this project, any questions on design choices, or preferences on what areas you would like the app to cover are welcomed, just open an issue.

To build and run:
- Clone project
- Run npm install
- Run node index.js
- visit http://localhost:8080/docs/swaggerui/index.html and you should see the list of routes in the swagger ui which you can begin testing with.
- *Note* - You will have to create some users using the post route if you want to test the GET and DELETE routes

It's that easy due to LevelDB. No need to install a seperate data store.
