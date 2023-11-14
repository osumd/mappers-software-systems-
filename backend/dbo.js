const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mappers123:mappers123@cluster0.kmywt7n.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
});

async function GetDatabase() {

    await client.connect();
    db = client.db;    
}

module.exports = {
    
    ConnectToDatabase: async function ConnectToDatabase()
    {
        await GetDatabase();
        return;
    },

    GetDB : function(databasename)
    {
        return client.db(databasename);
    }

}