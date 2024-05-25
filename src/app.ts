import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";

import { logger } from "./logger";
import contactRoutes from "./routes/contactRoutes";

const app = express();

app.use(express.json());

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// heartbeat route
app.get(`/`, (_req, res) => {
  function getUptime() {
    const uptimeSeconds = process.uptime();
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  const serverStats = {
    serviceName: "Bitespeed Backend Service: Identity Reconciliation",
    description: "To use the service send HTTP POST to /identify",
    author: "Shashank",
    uptime: getUptime(),
    currentTime: new Date().toISOString(),
    status: "Ok",
  };

  res.status(200).json(serverStats);
});

// identity route
app.use("/identify", contactRoutes);

// 404 route
app.all("*", (_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

export default app;
