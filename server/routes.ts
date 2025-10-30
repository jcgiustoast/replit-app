import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSavedReportSchema, insertFolderSchema, insertRecentReportSchema, insertWorkspaceSchema, insertConnectionSchema, insertWorkspaceMemberSchema, insertNomenclaturePropertySchema } from "@shared/schema";

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

  // Delete a folder
  app.delete("/api/folders/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFolder(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Folder not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete folder" });
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

  // Workspace routes
  app.get("/api/workspaces", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      const workspaces = await storage.getWorkspaces(userId);
      res.json(workspaces);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workspaces" });
    }
  });

  app.get("/api/workspaces/:id", async (req, res) => {
    try {
      const workspace = await storage.getWorkspace(req.params.id);
      if (!workspace) {
        return res.status(404).json({ error: "Workspace not found" });
      }
      res.json(workspace);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workspace" });
    }
  });

  app.post("/api/workspaces", async (req, res) => {
    try {
      const validatedData = insertWorkspaceSchema.parse(req.body);
      const workspace = await storage.createWorkspace(validatedData);
      res.status(201).json(workspace);
    } catch (error) {
      res.status(400).json({ error: "Invalid workspace data" });
    }
  });

  app.patch("/api/workspaces/:id", async (req, res) => {
    try {
      const updates = insertWorkspaceSchema.partial().parse(req.body);
      const workspace = await storage.updateWorkspace(req.params.id, updates);
      if (!workspace) {
        return res.status(404).json({ error: "Workspace not found" });
      }
      res.json(workspace);
    } catch (error) {
      res.status(400).json({ error: "Invalid workspace data" });
    }
  });

  app.delete("/api/workspaces/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteWorkspace(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Workspace not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete workspace" });
    }
  });

  // Connection routes
  app.get("/api/connections", async (req, res) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) {
        return res.status(400).json({ error: "workspaceId is required" });
      }
      const connections = await storage.getConnections(workspaceId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch connections" });
    }
  });

  app.post("/api/connections", async (req, res) => {
    try {
      const validatedData = insertConnectionSchema.parse(req.body);
      const connection = await storage.createConnection(validatedData);
      res.status(201).json(connection);
    } catch (error) {
      res.status(400).json({ error: "Invalid connection data" });
    }
  });

  app.patch("/api/connections/:id", async (req, res) => {
    try {
      const updates = insertConnectionSchema.partial().parse(req.body);
      const connection = await storage.updateConnection(req.params.id, updates);
      if (!connection) {
        return res.status(404).json({ error: "Connection not found" });
      }
      res.json(connection);
    } catch (error) {
      res.status(400).json({ error: "Invalid connection data" });
    }
  });

  app.delete("/api/connections/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteConnection(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Connection not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete connection" });
    }
  });

  // Workspace members routes
  app.get("/api/workspace-members", async (req, res) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) {
        return res.status(400).json({ error: "workspaceId is required" });
      }
      const members = await storage.getWorkspaceMembers(workspaceId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workspace members" });
    }
  });

  app.post("/api/workspace-members", async (req, res) => {
    try {
      const validatedData = insertWorkspaceMemberSchema.parse(req.body);
      const member = await storage.addWorkspaceMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ error: "Invalid workspace member data" });
    }
  });

  app.patch("/api/workspace-members/:id", async (req, res) => {
    try {
      const updates = insertWorkspaceMemberSchema.partial().parse(req.body);
      const member = await storage.updateWorkspaceMember(req.params.id, updates);
      if (!member) {
        return res.status(404).json({ error: "Workspace member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(400).json({ error: "Invalid workspace member data" });
    }
  });

  app.delete("/api/workspace-members/:id", async (req, res) => {
    try {
      const deleted = await storage.removeWorkspaceMember(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Workspace member not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete workspace member" });
    }
  });

  // Nomenclature properties routes
  app.get("/api/nomenclature-properties", async (req, res) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      const platform = req.query.platform as string | undefined;
      if (!workspaceId) {
        return res.status(400).json({ error: "workspaceId is required" });
      }
      const properties = await storage.getNomenclatureProperties(workspaceId, platform);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch nomenclature properties" });
    }
  });

  app.post("/api/nomenclature-properties", async (req, res) => {
    try {
      const validatedData = insertNomenclaturePropertySchema.parse(req.body);
      const property = await storage.createNomenclatureProperty(validatedData);
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ error: "Invalid nomenclature property data" });
    }
  });

  app.patch("/api/nomenclature-properties/:id", async (req, res) => {
    try {
      const updates = insertNomenclaturePropertySchema.partial().parse(req.body);
      const property = await storage.updateNomenclatureProperty(req.params.id, updates);
      if (!property) {
        return res.status(404).json({ error: "Nomenclature property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(400).json({ error: "Invalid nomenclature property data" });
    }
  });

  app.delete("/api/nomenclature-properties/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteNomenclatureProperty(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Nomenclature property not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete nomenclature property" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
