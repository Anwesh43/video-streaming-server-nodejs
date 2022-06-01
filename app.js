const express = require('express')
const app = express()
const {statSync, createReadStream, readFileSync} = require('fs')
const chunksSize = 1024 * 1024 
const path = require('path')
const fileName = 'xxxxx.mp4'
app.use(express.static(path.join(__dirname, 'public')))
app.get('/video', (req, res) => {
    const {range} = req.headers 
    console.log("RANGE", range)
    const start = Number(range.split("-")[0].replace("bytes=", ""))
    console.log(range.split("-")[0])
    const size = statSync(fileName).size 
    const end = Math.min(size - 1, start + chunksSize)
    const rs = createReadStream(fileName, {start, end})
    res.setHeader('Content-Length', end - start + 1)
    res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`)
    res.setHeader('Content-Type', 'video/mp4')
    res.setHeader('Access-Ranges', 'bytes')
    res.statusCode = 206
    rs.pipe(res)
})
app.listen(4000, () => {
    console.log("STARTED LISTEING ON PORT 3000")
})

