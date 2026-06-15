import mongoose from 'mongoose'

type ConnectionObject = {
    isConnected ?: number
}

const connection : ConnectionObject = {};

//void -> Any type of data can come in promise
async function dbConnect(): Promise<void> {
    
    //If the db is already connected
    if(connection.isConnected) {
        console.log(`Database already connected`)
    }

    //If the db is not connected
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || '');
        connection.isConnected = db.connections[0].readyState;
        console.log(`DB connected successfully`)
    } catch(err) { 
        console.log(`Database connetion failure`, err);
        //Gracefully exiting the process
        process.exit(1);
    }
}

export default dbConnect;