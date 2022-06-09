import mysql from 'mysql'
import express from 'express'
import http from 'http'
import path from 'path'
import cors from 'cors'

const app = express()
const server = http.Server(app);


import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const port = 6053

app.use('/', express.static(path.join(__dirname, '../public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'))
})

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'))
})


app.get('/page', (req, res) => {
    var page = req.query.page;
    res.sendFile(path.join(__dirname, '/pages/'+page))
})


server.listen(port, function () {
    console.log(`Servidor Carregado http://localhost:${server.address().port}`);
});