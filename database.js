'use strict';
const { JsonDB, Config, DataError } = require('node-json-db');

const db = new JsonDB(new Config('database.json', true, true, '/'));

module.exports = {
    'db': db, 'dataError': DataError, 'initUser': async (user) => {
        await db.push('/users', { [user.id]: { reputation: { value: 0, changedAt: (new Date()).toUTCString() } } }, false); return 0;
    }
};
