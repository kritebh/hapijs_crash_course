const Hapi = require("@hapi/hapi")

const server = Hapi.server({
    port: 8000,
    host: 'localhost'
});

//Init Server
const init = async () => {
    await server.start();
    await server.register([{
        plugin: require("hapi-geo-locate"),
        options: {
            enableByDefault: true
        }
    },
    {
        plugin: require("@hapi/inert")
    }
    ])
    console.log('Server running on %s', server.info.uri);
};

process.on("unhandledRejection", (err) => {
    console.log(err)
    process.exit(1)
})

init();

server.route({
    method: "GET",
    path: "/",
    handler: (req, h) => {
        return h.file("./public/index.html")
    }
})

server.route({
    method: "GET",
    path: "/about",
    handler: (req, h) => {
        return ("<h1>About Us</h1>")
    }
})
server.route({
    method: "GET",
    path: "/locate",
    handler: (req, h) => {
        return req.location
    }
})




