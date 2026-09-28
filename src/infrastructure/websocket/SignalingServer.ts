
import { Server } from 'socket.io'
import type { Server as HttpServer } from 'http'
 

export function setUpSocket(server:HttpServer){
    const io = new Server(server,{
        cors:{origin:"*"}
    })

    io.on('connection',(socket)=>{
        console.log('Client connected:',socket.id)

        socket.on("join-room",(roomKey)=>{
            socket.join(roomKey)
            console.log(`User ${socket.id} joined room: ${roomKey}`)

            socket.to(roomKey).emit('peer-joined',socket.id)
        })

        socket.on('offer',({roomKey,offer})=>{
            socket.to(roomKey).emit('offer',offer)
        })


        socket.on('answer',({roomKey,answer})=>{
            socket.to(roomKey).emit('answer',answer)
        })

        socket.on('ice-candidate',({roomKey,candidate})=>{
            socket.to(roomKey).emit('ice-candidate',candidate)
        })

        socket.on('disconnect',()=>{
            console.log('Client diconnected:', socket.id)
        })
    })

    return io

}