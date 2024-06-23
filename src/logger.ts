import winston from "winston";
const { timestamp, json, combine } = winston.format;

const logger = winston.createLogger({
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/errors/error.log",
      level: "error",
    }),
  ],
});
export default logger;
