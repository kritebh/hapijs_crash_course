const Hapi = require("@hapi/hapi")
const path = require('path')
const Boom = require('@hapi/boom')

const server = Hapi.server({
    port: 8000,
    host: 'localhost'
});


const validate = async (req, username, password, h) => {
    if (username === "admin" && password === "admin") {
        return {
            isValid: true,
            credentials: {
                id: 1,
                name: "admin"
            }
        }
    }
    else {
        return { isValid: false, credentials: null }
    }
}

//Init Server
const init = async () => {

    await server.register([{
        plugin: require("hapi-geo-locate"),
        options: {
            enableByDefault: true
        }
    },
    {
        plugin: require("@hapi/inert")
    },
    {
        plugin: require("@hapi/vision")
    },
    {
        plugin: require("@hapi/basic")
    }
    ]);

    server.views({
        engines: {
            hbs: require('handlebars')
        },
        path: path.join(__dirname, 'views')
    })

    server.auth.strategy('simple', "basic", { validate })

    server.route([{
        method: "GET",
        path: "/loginbasic",
        options: {
            auth: 'simple'
        },
        handler: (req, h) => {
            return "Welcome to Dashboard"
        }
    },
    {
        method: "GET",
        path: "/",
        handler: (req, h) => {
            const data = {
                name: "kritebh"
            }
            return h.view("index", data)
        }
    },
    {
        method: "GET",
        path: "/about",
        handler: (req, h) => {
            return ("<h1>About Us</h1>")
        }
    },
    {
        method: "POST",
        path: "/login",
        handler: (req, h) => {
            console.log(req.payload.username)
            console.log(req.payload.password)
            return "Login Successful"
        }
    },
    {
            method: "GET",
            path: "/logoutbasic",
            handler: (req, h) => {
                return Boom.unauthorized("Logout Successfull")
            }
        }
    ])

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on("unhandledRejection", (err) => {
    console.log(err)
    process.exit(1)
})

init();

// server.route(
//     {
//         method: "GET",
//         path: "/",
//         handler: (req, h) => {
//             return h.file("./public/index.html")
//         }
//     },
// )

server.route({
    method: "GET",
    path: "/locate",
    handler: (req, h) => {
        return req.location
    }
})




