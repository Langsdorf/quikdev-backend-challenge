# RESTful API

## Indíces:
- [Requisitos](#requisitos)
- [Rodando a aplicação](#rodando-a-aplicação)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Testes](#testes)
- [Documentação](#documentação)
- [Roteamento](#roteamento)
- [Sistema de friends](#sistema-de-friends)

## Requisitos:
- Git
- Docker
- Docker Compose

## Rodando a aplicação
Faça o clone do repositório
```bash
git clone https://github.com/Langsdorf/quikdev-backend-challenge
```

Entre no diretório da aplicação e execute
```bash
docker-compose up
```

Após a execução dos containers, a porta 3001 estará aberta localmente para utilização da API
```
http://localhost:3001/
```

Além disso, será executado um container com o Mongo Express que você poderá acessar na porta 8081 para visualizar os dados do Mongo:
```
http://localhost:8081/
```

## Variáveis de ambiente

### Em testes
Nos testes, elas são especificadas em cada arquivo de teste. Apenas duas são utilizadas no momento.
```js
process.env.JWT_SECRET = "secret";
process.env.MONGODB_URL = "mongodb://root:root@127.0.0.1:27017/";
```

### Em execução
Todas as variáveis de ambiente da API estão configuradas no arquivo docker-compose, no servico `api`
```yml
NODE_ENV: development
PORT: 3001
MONGODB_URL: mongodb://root:root@mongo:27017/
JWT_SECRET: "phLO3y1qA0_EwfTfMiaZBo0x4119b9kP7LnagQwo"
```

## Testes
Para executar os testes unitários
```bash
npm run test
```

Serão executados dois testes:
`src/modules/auth/auth.service.spec.ts`
`src/modules/user/user.service.spec.ts`

Ambos testaram todos os métodos de seus respectivos serviços.
Foi utilizado o Jest para criação dos testes.



## Documentação

_Os arquivos gerados pelo Insomnia estão na raiz do projeto._

### modules/user
`http://localhost:3001/users`

#### Criar um usuário

`POST http://localhost:3001/users`

```bash
curl -X POST "http://localhost:3001/users" -H "Content-Type: application/json" --data-raw '{"name":"name","username":"username","password":"password","birthdate":"birthdate","address":"address","addressNumber":7,"primaryPhone":"primaryPhone","description":"description"}'
```

- Será criado um usuário conforme as informações passadas.
- Não é necessário autenticação para essa rota

#### Listar usuários

`GET http://localhost:3001/users`

```bash
curl -X GET "http://localhost:3001/users" -H "Authorization: Bearer TOKEN"
```

- É retornado uma lista com todos os usuários
- É necessário o token nessa rota

#### Retornar um usuário

`GET http://localhost:3001/users/:id`

```bash
curl -X GET "http://localhost:3001/users/1" -H "Authorization: Bearer TOKEN"
```

- É retornado um único usuário de acordo com o ID especificado
- É necessário o token nessa rota


#### Atualizar um usuário

`PATCH http://localhost:3001/users/:id`

```bash
curl -X PATCH "http://localhost:3001/users/1" -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" --data-raw '{"name":"new name"}'
```

- É retornado o usuário atualizado
- É necessário o token nessa rota


#### Deletar um usuário

`DELETE http://localhost:3001/users/:id`

```bash
curl -X DELETE "http://localhost:3001/users/1" -H "Authorization: Bearer TOKEN"
```


- É retornado o usuário excluido
- É necessário o token nessa rota

### modules/auth
`http://localhost:3001/auth`

#### Login

`POST http://localhost:3001/auth/login`

```bash
curl -X POST "http://localhost:3001/auth/login" -H "Content-Type: application/json" --data-raw '{"username":"username","password":"password"}'
```

- É retornado o token com validade de 7 dias

## Roteamento
Eu criei um sistema de roteamento via [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) e [reflect](https://www.typescriptlang.org/docs/handbook/decorators.html#metadata). Basicamente, eu analiso todas as anotações usadas e registro elas no express no run-time.
Para mais informações, o projeto inicial está [aqui](https://github.com/Langsdorf/express-boilerplate)

## Sistema de friends
Minha seguinte solução foi esta:

Eu criaria uma tabela auxiliar de relações onde cada registro teria 2 id de usuários, já que um amigo é mutual, ou seja, o registro seria basicamente assim:

`tables/relationships`
```json
{
  "user": "ID usuário 1"
  "relationship": "ID usuário 2"
}
{
  "user": "ID usuário 2"
  "relationship": "ID usuário 1"
}
```

Então, para cada amizade, será criado 2 novos registro com 2 elementos (user & relationship) contendo o id dos dois usuários.

Assim, para consultar se alguém é amigo de outro, basta verificar se o id está em algum registro e pegar o ID associado (relationship).

Então, para deletar, basta apagar os registros em que ambos os ID estão associados.


Usando esse modelo, reduziríamos o uso de memória, visto que, em grande quantidades, uma array, por exemplo, iria consumir muita memória. Ademais, com pagination e filtering, com o aumento de dados, quando formos puxar os dados, podemos limitá-los.

### Amizades próximas com base no username

Para esse problema, basta consultarmos no modelo supracitado as amizades do usuário e para cada uma, realizar um calculo de distância das coordenadas do usuário para seus amigos. Exemplo:

_Considerando uma distância máxima de 10km_

`Pegar os dados do usuário com username "langsdorf"`
```json
{
  "username": "langsdorf",
  "id": "123",
  ...
  "latitude": "-15.792265",
  "longitude": "-47.8852644"
}
```

`Pegar todas as relações do ID "123"`
```json
{
  "user": "123"
  "relationship": "456"
}
{
  "user": "123"
  "relationship": "789"
}
```

`Pegar os dados dos usuários "456" e "789"`

```json
{
  "id": "456",
  ...
  "latitude": "6.15235",
  "longitude": "-70.85305"
}
```

```json
{
  "id": "789",
  ...
  "latitude": "-15.7966188",
  "longitude": "-47.872685"
}
```

Com os dados obtidos, já podemos filtrar com um conceito básico:

- O usuário de id "456" já estaria descartado, visto que a diferença entre a latitude do usuário "123" é muito grande, passando a distância máxima definida de 10km.


Após filtrar os resultados usando esse conceito, utilizaríamos a matemática para determinar os amigos que estão dentro de um raio de 10km:

_Nesses dados de exemplo, só sobraria o usuário 789 para realizarmos as contas_

```
Cálculos retirados daqui:
https://www.pilotopolicial.com.br/como-calcular-a-precisao-de-uma-coordenada-geografica/
```

Fazendo as contas (usuário 123 e usuário 789):

Latitude:
`(-15.792265) - (-15.7966188) = 0.0043538 * 60 = 0.261228 NM * 1852 = 483.794256 metros`

Longitude:
`(-47.8852644) - (-47.872685) = -0.0125794 * 60 = -0.754764 NM * 1852 = -1397.822928 metros`

Teorema de Pitágoras:
`d = sqrt((483.794256)² + (-1397.822928)²) = 1479.17741336 metros`

Ou seja, o usuário 789 está aproximadamente 1,48km de distância do usuário 123, estando, assim, dentro da distância máxima determinada.

Isso se repetirá para o restante da lista, retornando uma array contendo os amigos próximos.