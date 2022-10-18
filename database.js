const { JsonDB, Config, DataError } = require('node-json-db');

const db = new JsonDB(new Config('database.json', true, true, '/'));

function initUser(user) {
	db.push('/users', {
		[user.id]: {
			karma: {
				value: 0,
				changedAt: (new Date()).toUTCString(),
			},
		},
	});
}

module.exports = {
	'db': db,
	'initUser': initUser,
	'dataError': DataError,
};

/*
// Pushing the data into the database
// With the wanted DataPath
// By default the push will override the old value
await db.push("/test1","super test");

// It also create automatically the hierarchy when pushing new data for a DataPath that doesn't exists
await db.push("/test2/my/test",5);

// You can also push directly objects
await db.push("/test3", {test:"test", json: {test:["test"]}});

// If you don't want to override the data but to merge them
// The merge is recursive and work with Object and Array.
await db.push("/test3", {
    new:"cool",
    json: {
        important : 5
    }
}, false);

*//*
This give you this results :
{
   "test":"test",
   "json":{
      "test":[
         "test"
      ],
      "important":5
   },
   "new":"cool"
}
*//*

// You can't merge primitive.
// If you do this:
await db.push("/test2/my/test/",10,false);

// The data will be overriden

// Get the data from the root
var data = await db.getData("/");

// From a particular DataPath
var data = await db.getData("/test1");

// If you try to get some data from a DataPath that doesn't exists
// You'll get an Error
try {
    var data = await db.getData("/test1/test/dont/work");
} catch(error) {
    // The error will tell you where the DataPath stopped. In this case test1
    // Since /test1/test does't exist.
    console.error(error);
};

// Deleting data
await db.delete("/test1");

// Save the data (useful if you disable the saveOnPush)
await db.save();

// In case you have a exterior change to the databse file and want to reload it
// use this method
await db.reload();
*/