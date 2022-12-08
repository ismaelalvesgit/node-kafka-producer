# Kafka producer em node.js
Este projeto foi criado por motivos acadêmicos e para testes de publicação de dados na queue em kafka

## Preview Code
```js
const { Kafka, Partitioners } = require("kafkajs");
const { brokers, clientId } = require("./env");
const kafkaProducer = require("./data.json");
const { v4 } = require("uuid");

const run = async ()=>{
  const kafka = new Kafka({
    clientId,
    brokers,
  });
  const producer = kafka.producer({createPartitioner: Partitioners.LegacyPartitioner});
  await Promise.all(kafkaProducer.map(async({topic, messages})=>{
      const identifier = v4();
      await producer.connect();
      console.log(`Send data in identifier: ${identifier} topic: ${topic}, data: ${JSON.stringify(messages)}`);
      await producer.send({
          topic,
          messages: messages.map((message)=>{
              return {value: JSON.stringify({
                  ...message,
                  identifier
              })};
          }) 
      });
      await producer.disconnect();
  }));
};

setImmediate(()=>{
    run().then(()=> {
        console.log("Finished and publised...");
    }).catch(console);
});
```

## Development

### Setup

#### 1) Instalação de dependências
``` sh
npm i 
```
Obs: É necessario que o [NodeJs](https://nodejs.org/en/) já esteja instalado em sua máquina

#### 2) Publicar dados na Queue
``` sh
npm start
```

#### 3) Env´s
Deixei um arquivo `.env.example` para entendimento das env's que utilizo

Env             |   Tipo   | Descrição
----------------|----------|------------------
KAFKA_CLIENT_ID | `string` | Nome do cliente Ex: kafka-producer
KAFKA_BROKER    | `string` | Url dos brokers Ex: 127.0.0.1:9093;127.0.0.1:9094

#### 4) Estrutura de dados esperada para publicação
Campo    |   Tipo   | Descrição
---------|----------|------------------
topic    | `string` | Nome da queue
messages | `array`  | Dados a serem publicados na queue

```json
[
    {
        "topic": "Queuing.Example",
        "messages": [{
            "teste": "Olá mundo"
        }]
    }
]
```
#### 5) Docker
Para facilitar os testes deixei um docker-compose já pre-configurado com as ferramentas [Kakfa](https://hub.docker.com/r/bitnami/kafka), 
[Kafdrop](https://hub.docker.com/r/obsidiandynamics/kafdrop), [Zookeeper](https://hub.docker.com/r/bitnami/zookeeper)
```yml
version: '3'

services:
  zookeeper:
    image: bitnami/zookeeper
    container_name: zookeeper
    restart: always
    environment:
      ALLOW_ANONYMOUS_LOGIN: yes
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    volumes:
      - zookeeper_data:/bitnami

  kafdrop:
    image: obsidiandynamics/kafdrop
    container_name: kafdrop
    restart: always
    depends_on:
      - kafka
    ports:
      - 19000:9000
    environment:
      KAFKA_BROKERCONNECT: kafka:9092

  kafka:
    image: bitnami/kafka
    container_name: kafka
    restart: always
    ports:
      - 9092:9092
      - 9093:9093
    environment:
      KAFKA_CFG_ZOOKEEPER_CONNECT: zookeeper:2181
      ALLOW_PLAINTEXT_LISTENER: yes
      KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP: CLIENT:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_CFG_LISTENERS: CLIENT://:9092,EXTERNAL://:9093
      KAFKA_CFG_ADVERTISED_LISTENERS: CLIENT://kafka:9092,EXTERNAL://localhost:9093
      KAFKA_CFG_INTER_BROKER_LISTENER_NAME: CLIENT
      KAFKA_CFG_MAX_PARTITION_FETCH_BYTES: 2048576
      KAFKA_CFG_MAX_REQUEST_SIZE: 2048576
    volumes:
      - kafka_data:/bitnami
    depends_on:
      - zookeeper

networks:
  default:
    driver: bridge

volumes:
  zookeeper_data:
  kafka_data:
```

## Contato
Desenvolvido por: [Ismael Alves](https://github.com/ismaelalvesgit) 🤓🤓🤓

* Email: [cearaismael1997@gmail.com](mailto:cearaismael1997@gmail.com) 
* Github: [github.com/ismaelalvesgit](https://github.com/ismaelalvesgit)
* Linkedin: [linkedin.com/in/ismael-alves-6945531a0/](https://www.linkedin.com/in/ismael-alves-6945531a0/)

### Customização de Configurações do projeto
Verifique [Configurações e Referencias](https://expressjs.com/pt-br/).
