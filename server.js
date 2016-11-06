const Hapi = require('hapi');
const Inert = require('inert');
const path = require('path');

// Create a server with a host and port
const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: __dirname
      }
    }
  }
});
const port = process.env.PORT || 3000;

server.connection({ 
  host: 'localhost', 
  port, 
});

server.register(Inert, () => {});

server.route({
  method: 'GET',
  path:'/{path*}',
  handler: {
    directory: {
      index: true,
      path: '.'
    }
  }
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});