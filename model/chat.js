const mongoose = require("mongoose")

const chatSchema = mongoose.Schema({
         roomid:{
             type:String
         },
         username:{
              type:String
         },
         content:{
              type:String
         }
})

const Chat = mongoose.model("Chat",chatSchema)

module.exports = Chat