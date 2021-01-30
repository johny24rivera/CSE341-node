const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

// const cors = require('cors') // Place this with other requires (like 'path' and 'express')
// const corsOptions = {
//   origin: "https://<your_app_name>.herokuapp.com/",
//   optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));

// const options = {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
//   family: 4
// };

// const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://GoldCode:<username>@cse341cluster-3dwlw.mongodb.net/test?retryWrites=true&w=majority";

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(
            'mongodb+srv://GoldCode:aTZGS2Gu0VQJU27G@cluster0.qz6md.mongodb.net/shop?retryWrites=true&w=majority'
        )
        .then((client) => {
            console.log('Connected');
            _db = client.db();
            callback();
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    };

    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;