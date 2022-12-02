const client = require('dgram').createSocket('udp4')
const host = require('os').hostname()
const [LS_HOST, LS_PORT] = process.env.LOGSTASH.split(':')
const NODE_ENV = process.env.NODE_ENV

console.log(`LS_HOST = ${LS_HOST}`)
console.log(`LS_PORT = ${LS_PORT}`)

module.exports = function(severity, type, fields) {
    const payload = JSON.stringify({
        '@timestamp': (new Date()).toISOString(),
        '@version': 1,
        app: 'web-api',
        environment: NODE_ENV,
        severity,
        type,
        fields,
        host
    })
    
    console.log('\n Sending Payload to ELK...')
    console.log(payload)
    client.send(payload, LS_PORT, LS_HOST)
}