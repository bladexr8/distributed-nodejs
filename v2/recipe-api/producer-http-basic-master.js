// use standard 'cluster' module for scaling

const cluster = require('cluster')

console.log(`master pid=${process.pid}`)

// set up cluster
cluster.setupMaster({
    exec: __dirname + '/producer-http-basic.js'
})

// create 2 workers
cluster.fork()
cluster.fork()

// cluster event handlers
cluster
    .on('disconnect', (worker) => {
        console.log('disconnect', worker.id)
    })
    .on('exit', (worker, code, signal) => {
        console.log('exit', worker.id, code, signal)
    })
    .on('listening', (worker, {address, port}) => {
        console.log('listening', worker.id, `${address}:${port}`)
    })

