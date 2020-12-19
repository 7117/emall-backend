const express = require('express')
const compression = require('compression')
const app = express()

//写在静态资源前面
app.use(compression())
app.use(express.static('./dist'))

app.listen(82, () => {
    console.log('success')
})