process.env.USER = 'proyectmanager';
process.env.PWD = '4TrcYYTtXjFKuyOd';
const uri = `mongodb+srv://${process.env.USER}:${process.env.PWD}@appis.65uar.mongodb.net/FuryDB?retryWrites=true&w=majority`;
module.exports={
    port: process.env.PORT || 8080,
    db: process.env.MONGODB || uri,
    urlParser : { 
        useNewUrlParser: true,
        useUnifiedTopology: true, 
        useFindAndModify:false,
        useCreateIndex:true 
    } 
};
// db: process.env.MONGODB || 'mongodb://localhost:27017/FuryDB',
//proyectmanager
//4TrcYYTtXjFKuyOd
//const uri = "mongodb+srv://proyectmanager:4TrcYYTtXjFKuyOd@appis.65uar.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";