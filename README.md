# Projeto

O projeto foi desenvolvido seguindo o curso do professor Erick Wendel, disponível no site [erickwendel.teachable.com](https://erickwendel.teachable.com/) e concluído no dia 08/12/2020.

## Instalação

Para rodar o projeto, você deve primeiro baixar os arquivos para sua máquina. Após este passo, deve entrar no projeto pelo seu editor de código (recomendado: [VS Code](https://code.visualstudio.com/)) e abrir o editor

```bash
cd <diretótio>
code .
```

Após entrar no código, executar o código abaixo para instalar as dependências corretamente

```bash
npm install
```

feito isso, habilitar o uso do terminal para execução de um teste na versão local (conforme scripts do package.json)

```bash
npm run test:dev
```

Ao finalizaro processo, executar os códigos no terminal ```git bash``` para executar as devidas bibliotecas no docker (final do documento)

## Dependências
- @hapi/hapi > ^19.2.0
- @hapi/inert > ^6.0.3
- @hapi/joi > ^17.1.1
- @hapi/jwt > ^2.0.1
- @hapi/vision > ^6.0.1
- bcrypt > ^5.0.0
- boom > ^7.3.0
- cross-env > ^7.0.3
- dotenv > ^8.2.0
- hapi-auth-jwt2 > ^10.2.0
- hapi-swagger > ^13.0.2
- inert > ^5.1.3
- joi > ^17.3.0
- jsonwebtoken > ^8.5.1
- mongoose > ^5.11.1
- pg > ^8.5.1
- pg-hstore > ^2.3.3
- sequelize > ^6.3.5
- vision > ^5.4.4
 
## Autor
- [Caio Rafael](https://github.com/kaioso20).

- Agradecimento especial ao professor [Erick Wendel](https://github.com/erickwendel).

### Site publicado (Heroku)
- [https://sheltered-journey-34364.herokuapp.com/](https://sheltered-journey-34364.herokuapp.com/)

# Libs do docker
### Postgres
docker run \
    --name postgres \
    -e POSTGRES_USER=erickwendel \
    -e POSTGRES_PASSWORD=minhasenhasecreta \
    -e POSTGRES_DB=heroes \
    -p 5432:5432 \
    -d \
    postgres

docker run \
    --name adminer \
    -p 8080:8080 \
    --link postgres:postgres \
    -d \
    adminer

### MongoDb
docker run \
    --name mongodb \     
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin \
    -d \
    mongo:4

docker run \
    --name mongoclient \
    -p 3000:3000 \
    --link mongodb:mongodb \
    -d \
    mongoclient/mongoclient

docker exec -it mongodb \
    mongo --host localhost -u admin -p senhaadmin --authenticationDatabase admin \
    --eval "db.getSiblingDB('herois').createUser({user: 'erickwendel', pwd: 'minhasenhasecreta', roles: [{role: 'readWrite', db: 'herois'}]})"
 