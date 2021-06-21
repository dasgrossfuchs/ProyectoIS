module.exports={
    port: process.env.PORT || 8080,
    db: process.env.MONGODB || 'mongodb://localhost:27017/FuryDB',
    urlParser : { 
        useNewUrlParser: true,
        useUnifiedTopology: true, 
        useFindAndModify:false,
        useCreateIndex:true 
    } 
}