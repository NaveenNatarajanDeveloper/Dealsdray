let MongoClient = require('mongodb').MongoClient;
let mongoUrl = "mongodb+srv://naveen_dev1:VR9jk68mHG0qYhrB@cluster0.cewiyev.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(mongoUrl);

async function dbConnect() {
    await client.connect();
}

let db = client.db('dealsTask');

async function getData(collectionName, query) {
    let output = [];
    try {
        const cursor = db.collection(collectionName).find(query);
        await cursor.forEach(data => output.push(data));
    } catch (err) {
        output.push({ "Error": "Error in getData" });
    }
    return output;
}

async function postData(collectionName, data) {
    let output;
    try {
        output = await db.collection(collectionName).insertOne(data);
    } catch (err) {
        output = { "response": "Error in postData" };
    }
    return output;
}

async function updateEmployee(collectionName, filter, update) {
    let output;
    try {
        output = await db.collection(collectionName).updateOne(filter, { $set: update });
    } catch (err) {
        output = { "response": "Error in updateEmployee" };
    }
    return output;
}

async function deleteEmployee(collectionName, filter) {
    let output;
    try {
        output = await db.collection(collectionName).deleteOne(filter);
    } catch (err) {
        output = { "response": "Error in deleteEmployee" };
    }
    return output;
}

module.exports = {
    dbConnect,
    getData,
    postData,
    updateEmployee,
    deleteEmployee
};
