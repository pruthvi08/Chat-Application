const express = require("express")
const http = require("http")
const socketio = require("socket.io")
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = 4545
const path = require("path")
const hbs = require("hbs")
const ejs = require("ejs")
const public_path = path.join(__dirname,"/public")
require('./conn/conn.js')
app.use(express.static(public_path))
const Chat = require("./model/chat.js")
const view_path= path.join(__dirname,"/views")

 app.set('view engine',"ejs")
 app.set('views',view_path)

io.on("connection", (socket) => {
    
socket.on("join_room",(data)=>{
     socket.join(data.roomid)
})

socket.on('msg_send',async (data)=>{
        console.log(data)
   
        const chat = await Chat.create({
                
          roomid : data.roomid,
          username:data.username,
          content : data.msg

        })
        io.to(data.roomid).emit("msg_rcvd",data)
})
      socket.on("typing",(data)=>{
         socket.broadcast.to(data.roomid).emit('someone_typing')
      })
})

app.get("/chat/:roomid", async (req, res) => {
  const chats = await Chat.find({
    roomid:req.params.roomid
  }).select('content username')

    res.render('index',{
          name:'bav',
          id:req.params.roomid,
          chats:chats
    })
})

server.listen(port, () => {
    console.log(`request listening at ${port}`)
})
