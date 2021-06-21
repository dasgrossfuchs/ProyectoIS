module.exports={
    port: process.env.PORT || 8080,
    // db: process.env.MONGODB || 'mongodb://localhost:27017/FuryDB',
    db: process.env.MONGODB || "mongodb+srv://proyectmanager:4TrcYYTtXjFKuyOd@appis.65uar.mongodb.net/FuryDB?retryWrites=true&w=majority",
    urlParser : { 
        useNewUrlParser: true,
        useUnifiedTopology: true, 
        useFindAndModify:false,
        useCreateIndex:true 
    } 
}
//proyectmanager
//4TrcYYTtXjFKuyOd
//const uri = "mongodb+srv://proyectmanager:4TrcYYTtXjFKuyOd@appis.65uar.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";