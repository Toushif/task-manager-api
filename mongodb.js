//http://mongodb.github.io/node-mongodb-native/3.6/api

const mongodb = require('mongodb')
const {MongoClient, ObjectID} = mongodb //the mongoClient will initialize the connection and give us access to all the functions necessary to do more operations. Check http://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html

// const id = new ObjectID() //generate a new unique global id
// console.log('ID:', id, id.getTimestamp()) //chec docs for how the id is generated and whats the meaning of id - like the first 4 bits are the timestamp of when that id was created, the next 5 bits are randomly gerenated and so on...
// console.log('ID2:', id.id) //returns the binary form of the id. Mongodb stores id in binary because it takes half the size than it's string equivalent.
// console.log('ID2:', id.toHexString()) //returns the string form of id which is id value itself as above. 

// const connectionUrl = 'mongodb://127.0.0.1:27017' //this is the localhost url, 127.0.0.1 is the localhost ip address and 27017 is the mongodb port number.
// const databaseName = 'task-manager' //this is the nsame of our database

//MongoClient.connect this will connect to our local database server using the localhost ip address and port number
// MongoClient.connect(connectionUrl, {useUnifiedTopology: true}, (error, client) => { 
//     if(error) {
//         return console.log('Unable to connect to database!', error)
//     }

    // const db = client.db(databaseName) //here we use db method on client to get connection to a specific database. We dont need to use s=create db commands as such, clent.db will create a reference to our local database a new database instance names 'task-manager'
    // console.log(client)
    /* db.collection('users').insertOne({
        name: 'Toushif',
        age: 28
    }, (error, resullt) => {
        if(error) {
            return console.log('Unable to insert user!', error)
        }

        console.log('result', result.ops)  //ops contain all the document information needed
    }) */
    
    /* db.collection('users').insertMany([
        {
            name: 'Jen',
            age: 27
        },{
            name: 'Gunther',
            age: 29
        }
    ], (error, result) => {
        if(error) {
            return console.log('Unable to insert user!', error)
        }

        console.log('result', result.ops)  //ops contain all the document information needed
    }) */

    /* db.collection('tasks').insertMany([
        {
            description: 'Clean the house',
            completed: true
        },
        {
            description: 'Renew inspection',
            completed: false
        },
        {
            description: 'Pot plants',
            completed: false
        }
    ], (error, result) => {
        if(error) {
            return console.log('Unable to insert user!', error)
        }

        console.log('result', result.ops)  //ops contain all the document information needed
    }) */

    /* Read operation in MongoDB */
    /* db.collection('users').findOne({ name: 'Jen' }, (error, user) => {
        if(error) {
            return console.log('Unable to find user!', error)
        }

        console.log('result', user) //user is the returned result if the search is successful in that collection (users), if nothing is found then it'll return null
    }) */
    /* If you want to find a record by id then you have to pass the string in the Object method like below which will generate the binary form of that id, coz as discussed the id is stored in binary form to save pspace in database */
    /* db.collection('users').findOne({ _id: new ObjectID('60e5b90c6cc07409f866241c') }, (error, user) => {
        if(error) {
            return console.log('Unable to find user!', error)
        }

        console.log('result', user) //user is the returned result if the search is successful in that collection (users), if nothing is found then it'll return null
    }) */
    /* Here in find method in colections we dont have a callback as the third argument which we saw above. find method instead returns a cursor(read docs to read about cursors), which can be parsed into an array object using toArray method which takes a callback as an argument */
    /* db.collection('users').find({ age: 28 }).toArray((error, users) => {
        if(error) {
            return console.log('Unable to find user!', error)
        }

        console.log('result', users) //user is the returned result if the search is successful in that collection (users), if nothing is found then it'll return null
    }) */
    /* Like toArray we have tonnes of other methods. Count returns the count of total records found */
    /* db.collection('users').find({ age: 28 }).count((error, count) => {
        if(error) {
            return console.log('NO records found', error)
        }

        console.log('Counts:', count) //user is the returned result if the search is successful in that collection (users), if nothing is found then it'll return null
    }) */
    
    //Update operation in MongoDB. Here in updateone first argument is ofcourse is a filter param either _id or any other property from the record to be updated, 2nd argument is the new value of a property which you want to update, and third arg is an optional callback you pass just like all the above examples. But if you dont pass a callback arg then the return value of updateOne method is a promise which you can use to resolve or reject as below. $set operator updates the selected property value with the new value. Lie $set there are other operators as well like $inc, $min, $max, #unset, etc. Refer the reference doc for more. 
    /* db.collection('users').updateOne({ _id: new ObjectID('60e5b2fe8a33620ec809fcf8') }, {
        $set: {
            name: 'Boris'
        }
    }).then(result => {
        console.log(result)
    }).catch(error => {
        console.error(error)
    }) */

    //delete operation in mongodb. We have deleteOne and deleteMany methods available.
    /* db.collection('users').deleteMany({ age: 27 }).then(result => {
        console.log(result)
    }).catch(error => {
        console.error(error)
    }) */
// })