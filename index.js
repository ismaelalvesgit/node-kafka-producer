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
    await Promise.all(kafkaProducer.map(async(produce)=>{
        const { topic, messages } = produce;
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