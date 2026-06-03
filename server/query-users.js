const { db } = require('./config/firebase');

async function getUsers() {
    const snapshot = await db.collection('users').get();
    snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
    });
}
getUsers();
