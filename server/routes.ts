import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSavedReportSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Get all saved reports
  app.get("/api/saved-reports", async (req, res) => {
    try {
      const reports = await storage.getSavedReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch saved reports" });
    }
  });

  // Get a single saved report
  app.get("/api/saved-reports/:id", async (req, res) => {
    try {
      const report = await storage.getSavedReport(req.params.id);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch report" });
    }
  });

  // Create a new saved report
  app.post("/api/saved-reports", async (req, res) => {
    try {
      const validatedData = insertSavedReportSchema.parse(req.body);
      const report = await storage.createSavedReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      res.status(400).json({ error: "Invalid report data" });
    }
  });

  // Delete a saved report
  app.delete("/api/saved-reports/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSavedReport(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete report" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
