#!/usr/bin/env node

// NODE_ENV=development LOGSTASH=localhost:7777 node web-api/consumer-http-logs.js

//console.log('Loading Modules...')

const server = require('fastify')();
const fetch = require('node-fetch');
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || 'localhost:4000';
const log = require('./logstash.js');

//console.log('Loaded Modules...')


(async () => {

    await server.register(require('middie'))

    // request logger
    server.use((req, res, next) => {
        log('info', 'request-incoming', {
            path: req.url, method: req.method, ip: req.ip, ua: req.headers['user-agent'] || null
        })
        next()
    })

    // generic error handler
    server.setErrorHandler(async (error, req) => {
        log('error', 'request-failure', {
            stack: error.stack,
            path: req.url,
            method: req.method
        })
        return { error: error.message }
    })

    // request handler
    server.get('/', async () => {
        const url = `http://${TARGET}/recipes/42`
        log('info', 'request-outgoing', {
            url,
            svc: 'recipe-api'
        })
        const req = await fetch(url)
        const producer_data = await req.json()
        return {
            consumer_pid: process.pid,
            producer_data
        }
    })

    server.get('/error', async () => {
        throw new Error('oh no')
    })

    server.listen(PORT, HOST, () => {
        log('verbose', 'listen', {
            host: HOST,
            port: PORT
        })
    })

})()





