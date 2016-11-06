const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server();
const port = process.env.PORT || 3000;

server.connection({ 
  host: 'localhost', 
  port, 
});

server.route({
  method: 'GET',
  path:'/{path*}', 
  handler: (request, reply) => reply('hello world')
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});