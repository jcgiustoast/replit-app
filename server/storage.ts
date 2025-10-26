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
  deleteSavedReport(id: string): Promise<boolean>;

  getFolders(): Promise<Folder[]>;
  getFolder(id: string): Promise<Folder | undefined>;
  createFolder(folder: InsertFolder): Promise<Folder>;
  
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
