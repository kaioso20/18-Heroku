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

Feito isso, habilitar o uso do terminal para execução de um teste na versão local (conforme scripts do package.json)

```bash
npm run test:dev
```

Ao finalizaro processo, executar os códigos no terminal ```git bash``` para executar as devidas bibliotecas no docker (final do documento)
 
## Autor
- [Caio Rafael Gabardo Santar (GitHub)](https://github.com/kaioso20)
- [Caio Rafael Gabardo Santar (LinkedIn)](https://www.linkedin.com/in/caio-rafael-gabardo-6b6669163/)

- Agradecimento especial ao professor [Erick Wendel](https://github.com/erickwendel).

### Site publicado (Heroku)
- [https://sheltered-journey-34364.herokuapp.com/herois](https://sheltered-journey-34364.herokuapp.com/herois)
> Para executar este código, necessita do token de validação (Api key)
```Postman
authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im92eWxxa252eGpmbG9qIiwiaWQiOjQyLCJpYXQiOjE2MDc0NTM4OTR9.yckQSKdQ80wmtmoxGgHWl4uud1HweWGovGCwNtWSs9s'
```

# Libs do docker 
Caso haja a necessidade de rodar uma database local, inserir os seguintes códigos abaixo no ```git bash``` para vincular uma base dados a sua escolha.

### Postgres
```gitbash
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
```

### MongoDb
```gitbash
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
```