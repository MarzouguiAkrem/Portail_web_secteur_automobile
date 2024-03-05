require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const path = require('path')

const Comments = require('./models/commentModel')


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}))

const http = require('http').createServer(app)
const io = require('socket.io')(3001)


// Soketio
let users = []
io.on('connection', socket => {
    // console.log(socket.id + ' connected.')

    socket.on('joinRoom', id => {
        const user = { userId: socket.id, room: id }

        const check = users.every(user => user.userId !== socket.id)

        if (check) {
            users.push(user)
            socket.join(user.room)
        } else {
            users.map(user => {
                if (user.userId === socket.id) {
                    if (user.room !== id) {
                        socket.leave(user.room)
                        socket.join(id)
                        user.room = id
                    }
                }
            })
        }

        // console.log(users)
        // console.log(socket.adapter.rooms)

    })

    socket.on('createComment', async msg => {
        const { username, content, topic_id, createdAt, rating, send } = msg


        const newComment = new Comments({
            username, content, topic_id, createdAt, rating
        })

        if (send === 'replyComment') {
            const { _id, username, content, topic_id, createdAt, rating } = newComment

            const comment = await Comments.findById(topic_id)

            if (comment) {
                comment.reply.push({ _id, username, content, createdAt, rating })

                await comment.save()
                io.to(comment.topic_id).emit('sendReplyCommentToClient', comment)
            }
        } else {
            await newComment.save()
            io.to(newComment.topic_id).emit('sendCommentToClient', newComment)
        }


    })

    socket.on('disconnect', () => {
        // console.log(socket.id + ' disconnected.')
        users = users.filter(user => user.userId !== socket.id)
    })
})

// Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/topicRouter'))
app.use('/api', require('./routes/paymentRouter'))
app.use('/api', require('./routes/commentRouter'))
app.use('/stats', require("./routes/stats"));



// Connect to mongodb
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) throw err;
    console.log('Connected to MongoDB')
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}



const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})