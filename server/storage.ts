import { type User, type InsertUser, type SavedReport, type InsertSavedReport, type Folder, type InsertFolder, type RecentReport, type InsertRecentReport } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getSavedReports(): Promise<SavedReport[]>;
  getSavedReport(id: string): Promise<SavedReport | undefined>;
  createSavedReport(report: InsertSavedReport): Promise<SavedReport>;
  updateSavedReport(id: string, updates: Partial<InsertSavedReport>): Promise<SavedReport | undefined>;
  deleteSavedReport(id: string): Promise<boolean>;

  getFolders(): Promise<Folder[]>;
  getFolder(id: string): Promise<Folder | undefined>;
  createFolder(folder: InsertFolder): Promise<Folder>;
  deleteFolder(id: string): Promise<boolean>;
  
  getRecentReports(): Promise<RecentReport[]>;
  addRecentReport(report: InsertRecentReport): Promise<RecentReport>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private savedReports: Map<string, SavedReport>;
  private folders: Map<string, Folder>;
  private recentReports: Map<string, RecentReport>;

  constructor() {
    this.users = new Map();
    this.savedReports = new Map();
    this.folders = new Map();
    this.recentReports = new Map();
    
    // todo: remove mock functionality
    // Seed some example folders
    const folder1: Folder = {
      id: randomUUID(),
      name: "What's Working",
      icon: "trend-up",
      createdAt: new Date(),
    };
    const folder2: Folder = {
      id: randomUUID(),
      name: "What's Not Working",
      icon: "trend-down",
      createdAt: new Date(),
    };
    const folder3: Folder = {
      id: randomUUID(),
      name: "Launch Analysis",
      icon: "bar-chart",
      createdAt: new Date(),
    };
    
    this.folders.set(folder1.id, folder1);
    this.folders.set(folder2.id, folder2);
    this.folders.set(folder3.id, folder3);

    // Seed pre-configured reports
    // What's Working reports
    const report1: SavedReport = {
      id: randomUUID(),
      name: "Top Creativos",
      description: "Los creativos con mejor rendimiento general",
      metrics: ["roas", "ctr", "spend"],
      folderId: folder1.id,
      createdAt: new Date(),
    };
    
    const report2: SavedReport = {
      id: randomUUID(),
      name: "Top Ángulos",
      description: "Ángulos de mensaje más efectivos",
      metrics: ["ctr", "roas", "cpa"],
      folderId: folder1.id,
      createdAt: new Date(),
    };
    
    const report3: SavedReport = {
      id: randomUUID(),
      name: "Top Click to Purchase Creatives",
      description: "Creativos con mayor tasa de conversión a compra",
      metrics: ["cpa", "roas", "spend"],
      folderId: folder1.id,
      createdAt: new Date(),
    };

    // What's Not Working reports
    const report4: SavedReport = {
      id: randomUUID(),
      name: "Creativos Saturados",
      description: "Creativos con fatiga de audiencia",
      metrics: ["ctr", "frequency", "cpa"],
      folderId: folder2.id,
      createdAt: new Date(),
    };

    // Launch Analysis reports
    const report5: SavedReport = {
      id: randomUUID(),
      name: "Video Hold Iterations",
      description: "Análisis de retención de video",
      metrics: ["ctr", "spend", "frequency"],
      folderId: folder3.id,
      createdAt: new Date(),
    };
    
    const report6: SavedReport = {
      id: randomUUID(),
      name: "Video Hooks Iterations",
      description: "Iteraciones de hooks de video",
      metrics: ["ctr", "convertScore", "roas"],
      folderId: folder3.id,
      createdAt: new Date(),
    };
    
    const report7: SavedReport = {
      id: randomUUID(),
      name: "Low Hook and High Click to Purchase",
      description: "Creativos con bajo engagement pero alta conversión",
      metrics: ["roas", "cpa", "ctr"],
      folderId: folder3.id,
      createdAt: new Date(),
    };

    this.savedReports.set(report1.id, report1);
    this.savedReports.set(report2.id, report2);
    this.savedReports.set(report3.id, report3);
    this.savedReports.set(report4.id, report4);
    this.savedReports.set(report5.id, report5);
    this.savedReports.set(report6.id, report6);
    this.savedReports.set(report7.id, report7);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSavedReports(): Promise<SavedReport[]> {
    return Array.from(this.savedReports.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getSavedReport(id: string): Promise<SavedReport | undefined> {
    return this.savedReports.get(id);
  }

  async createSavedReport(insertReport: InsertSavedReport): Promise<SavedReport> {
    const id = randomUUID();
    const report: SavedReport = {
      id,
      name: insertReport.name,
      description: insertReport.description ?? null,
      metrics: insertReport.metrics ?? null,
      folderId: insertReport.folderId ?? null,
      createdAt: new Date(),
    };
    this.savedReports.set(id, report);
    return report;
  }

  async updateSavedReport(id: string, updates: Partial<InsertSavedReport>): Promise<SavedReport | undefined> {
    const existing = this.savedReports.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: SavedReport = {
      ...existing,
      name: updates.name ?? existing.name,
      description: updates.description !== undefined ? updates.description : existing.description,
      metrics: updates.metrics !== undefined ? updates.metrics : existing.metrics,
      folderId: updates.folderId !== undefined ? updates.folderId : existing.folderId,
    };

    this.savedReports.set(id, updated);
    return updated;
  }

  async deleteSavedReport(id: string): Promise<boolean> {
    return this.savedReports.delete(id);
  }

  async getFolders(): Promise<Folder[]> {
    return Array.from(this.folders.values()).sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  }

  async getFolder(id: string): Promise<Folder | undefined> {
    return this.folders.get(id);
  }

  async createFolder(insertFolder: InsertFolder): Promise<Folder> {
    const id = randomUUID();
    const folder: Folder = {
      id,
      name: insertFolder.name,
      icon: insertFolder.icon ?? null,
      createdAt: new Date(),
    };
    this.folders.set(id, folder);
    return folder;
  }

  async deleteFolder(id: string): Promise<boolean> {
    return this.folders.delete(id);
  }

  async getRecentReports(): Promise<RecentReport[]> {
    return Array.from(this.recentReports.values()).sort(
      (a, b) => b.lastOpenedAt.getTime() - a.lastOpenedAt.getTime()
    ).slice(0, 10);
  }

  async addRecentReport(insertRecentReport: InsertRecentReport): Promise<RecentReport> {
    const existing = Array.from(this.recentReports.values()).find(
      r => r.reportId === insertRecentReport.reportId
    );
    
    if (existing) {
      existing.lastOpenedAt = new Date();
      this.recentReports.set(existing.id, existing);
      return existing;
    }

    const id = randomUUID();
    const recentReport: RecentReport = {
      id,
      reportId: insertRecentReport.reportId,
      reportName: insertRecentReport.reportName,
      lastOpenedAt: new Date(),
    };
    this.recentReports.set(id, recentReport);
    return recentReport;
  }
}

export const storage = new MemStorage();
