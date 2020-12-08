// docker exec -it c71b069f07d3 mongo -u erickwendel -p minhasenhasecreta --authenticationDatabase herois


//databases
// show dbs

// use herois
// show collections

db.herois.insert({
    nome: 'flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})
db.herois.find()
db.herois.find().pretty()


//create
for (let index = 0; index < 500; index++) {
    db.herois.insert({
        nome: `clone-${index}`,
        poder: 'Velocidade',
        dataNascimento: '1998-01-01'
    })
} 

//Read
db.herois.find().limit(5000).sort({nome: 1}).pretty()

//Update1
db.herois.find({nome: 'clone-414'})
db.herois.update({_id: ObjectId("5fbbf255c72a9fb0615eb09a")}, {nome: 'Mulher Maravilha'})
db.herois.update({_id: ObjectId("5fbbf255c72a9fb0615eb09a")}, {nome: 'Lanterna Verde'})
db.herois.findOne({_id: ObjectId('5fbbf255c72a9fb0615eb09a')})

//Update2
db.herois.update({poder: 'Velocidade'},{$set : {poder: 'Super Força'}})


//deletar
db.herois.remove({})