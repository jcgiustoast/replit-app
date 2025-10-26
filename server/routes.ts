import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSavedReportSchema, insertFolderSchema, insertRecentReportSchema } from "@shared/schema";

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

  // Update a saved report
  app.patch("/api/saved-reports/:id", async (req, res) => {
    try {
      const updates = insertSavedReportSchema.partial().parse(req.body);
      const report = await storage.updateSavedReport(req.params.id, updates);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(report);
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

  // Get all folders
  app.get("/api/folders", async (req, res) => {
    try {
      const folders = await storage.getFolders();
      res.json(folders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch folders" });
    }
  });

  // Get a single folder
  app.get("/api/folders/:id", async (req, res) => {
    try {
      const folder = await storage.getFolder(req.params.id);
      if (!folder) {
        return res.status(404).json({ error: "Folder not found" });
      }
      res.json(folder);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch folder" });
    }
  });

  // Create a new folder
  app.post("/api/folders", async (req, res) => {
    try {
      const validatedData = insertFolderSchema.parse(req.body);
      const folder = await storage.createFolder(validatedData);
      res.status(201).json(folder);
    } catch (error) {
      res.status(400).json({ error: "Invalid folder data" });
    }
  });

  // Get recent reports
  app.get("/api/recent-reports", async (req, res) => {
    try {
      const recentReports = await storage.getRecentReports();
      res.json(recentReports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent reports" });
    }
  });

  // Add to recent reports
  app.post("/api/recent-reports", async (req, res) => {
    try {
      const validatedData = insertRecentReportSchema.parse(req.body);
      const recentReport = await storage.addRecentReport(validatedData);
      res.status(201).json(recentReport);
    } catch (error) {
      res.status(400).json({ error: "Invalid recent report data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
