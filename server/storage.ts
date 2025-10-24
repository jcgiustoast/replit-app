import { type User, type InsertUser, type SavedReport, type InsertSavedReport } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private savedReports: Map<string, SavedReport>;

  constructor() {
    this.users = new Map();
    this.savedReports = new Map();
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
      createdAt: new Date(),
    };
    this.savedReports.set(id, report);
    return report;
  }

  async deleteSavedReport(id: string): Promise<boolean> {
    return this.savedReports.delete(id);
  }
}

export const storage = new MemStorage();
