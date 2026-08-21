import 'dotenv/config'
import app from './app.js' 
import { log } from 'console'

const PORT  = process.env.PORT || 3000

app.listen(PORT,()=>{
    log(`Server running on port http://localhost:${PORT}`)
})