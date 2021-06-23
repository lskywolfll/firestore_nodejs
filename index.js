const admin = require("firebase-admin");

const serviceAccount = require("./anykey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Use this ref to create new document in collection
const colUsers = db.collection('users');
const docUsers = db.collection('users').doc();

const get_users = async (limit) => {
    let lista = [];
    const snapshot = await colUsers
        .limit(limit)
        .get();
    snapshot.forEach((doc) => {
        lista.push({
            id: doc.id,
            ...doc.data()
        })
    });

    return lista
}

const create_user = async (name) => {

    const state = await get_user_by_name(name);
    if (state) {
        throw new Error(`Name "${name}" already exists`);
    } else {
        await docUsers.set({
            name
        });
    }
}

const get_user_by_name = async (name) => {
    let lista = [];
    const snapshot = await colUsers
        .limit(1)
        .where('name', "==", name)
        .get();

    if (snapshot.empty) {
        console.log("No matching documents.")
        return false;
    }

    snapshot.forEach(doc => {
        lista.push({
            id: doc.id,
            ...doc.data()
        })
    })

    return lista[0];
}

async function update_user_by_id(id, update) {
    const refUser = db.collection('users').doc(id);
    const res = await refUser.update(update);
    return res;
}

async function delete_user_by_id(id) {
    const refUser = db.collection('users').doc(id);
    await refUser.delete()
    return "Eliminado"
}

// delete_user_by_id('mngYauMQChemuIpUHMCp')
//     .then(console.log)
//     .catch(console.error)

// update_user_by_id('mngYauMQChemuIpUHMCp', { nombre: "robert" })
//     .then(console.log)
//     .catch(console.error)

// get_user_by_name("Rene")
//     .then(console.log)
//     .catch(console.error)

// get_users(10)
//     .then(console.log)
//     .catch(console.error)

async function run() {
    try {
        await create_user("Rene")
        console.log("Se ha creado")
    } catch (error) {
        console.log(error);
    }
}

run()