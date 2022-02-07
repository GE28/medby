
# Medby
Medby é uma aplicação server-side de uma clínica fictícia, construída com Node.js. 
[Acesse o repositório da parte gráfica (front-end).](https://github.com/GE28/medby-web)

## Principais tecnologias utilizadas 
* **[Node.js](https://nodejs.org/pt-br/)**: Um runtime de desenvolvimento JavaScript que permite que a linguagem seja utilizada em nível back-end e sem a necessidade de um navegador.
* **[Express.js](https://expressjs.com/pt-br/)**: Um framework web rápido e minimalista, que fornece uma estrutura mas sem dizer o que fazer com ela.
* **[Sequelize](https://sequelize.org/):** Um ORM baseado em promises com suporte à vários bancos de dados SQL.
* **[Redis](https://redis.io/)**: Um banco de dados NoSQL que funciona diretamente na memória RAM, portanto extremamente rápido, próprio para o cacheamento de dados.
* **[Bull](https://github.com/OptimalBits/bull)**: Um pacote de filas para lidar com tarefas em Node.js
* **[PostgreSQL](https://www.postgresql.org/)**: Um banco de dados objeto-relacional de código aberto muito conhecido e utilizado.
* **[MongoDB](https://www.mongodb.com/)**: Um banco de dados NoSQL escalável, baseado em documentos modelados em JSON.
* **[MongoDB Atlas](https://www.mongodb.com/atlas/database)**: Um serviço da equipe oficial do MongoDB para acessá-lo em nuvem através da AWS.

## Como instalar

Para executar o programa é necessário ter o Node.js (versão 11 ou superior) disponível na máquina

* É recomendado que faça a instalação através de um gerenciador de pacotes (https://nodejs.org/en/download/package-manager/)
* Ou baixe o instalador para a sua plataforma através do site oficial (https://nodejs.org/en/download/)

**Primeiro, clone este repositório através do comando abaixo:**
```bash
git clone https://www.github.com/GE28/medby
```

**Após isso, navegue até o diretório do projeto e instale os arquivos necessários para a execução do código:**
```bash
cd ./medby
npm install
```
Após isso, todos os arquivos necessários para a execução estarão na máquina

## Como configurar
Para que a aplicação funcione é necessário que PostgreSQL, MongoDB e Redis estejam em execução. É recomendado utilizar uma solução de contêineres, como o [Docker](https://www.docker.com/) que foi o escolhido durante o desenvolvimento deste projeto. Após isso, um arquivo `.env` deve ser criado e preenchido [conforme o exemplo](./.env.example). Para utilizar o MongoDB, é necessário um banco de dados em nuvem executando no [Atlas](https://www.mongodb.com/atlas/database), que pode ser criado gratuitamente.

**(Opcional)** Garantidas essas exigências, execute o seguinte comando no diretório onde estão os arquivos deste projeto para preencher o banco de dados PostgreSQL com dados de exemplo:
```bash
npm sequelize db:migrate
```

**Para finalmente executar o projeto, utilize:**
```bash
npm dev
```

**Ou para realizar depurações no código:**
```bash
npm debug
```

## Licença

Medby esta sob licença [MIT](./LICENSE).

