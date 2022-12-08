require("dotenv").config();

const env = {
    clientId: process.env.KAFKA_CLIENT_ID || "",
    brokers: (process.env.KAFKA_BROKER || "").split(";"),
};

module.exports = env;