const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

connMongo = () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error(err));
}



module.exports = connMongo;