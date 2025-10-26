import { users, savedReports, folders, recentReports, type User, type InsertUser, type SavedReport, type InsertSavedReport, type Folder, type InsertFolder, type RecentReport, type InsertRecentReport } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

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

// Database storage implementation using Drizzle ORM
// References: blueprint:javascript_database
export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getSavedReports(): Promise<SavedReport[]> {
    return await db.select().from(savedReports).orderBy(desc(savedReports.createdAt));
  }

  async getSavedReport(id: string): Promise<SavedReport | undefined> {
    const [report] = await db.select().from(savedReports).where(eq(savedReports.id, id));
    return report || undefined;
  }

  async createSavedReport(insertReport: InsertSavedReport): Promise<SavedReport> {
    const [report] = await db
      .insert(savedReports)
      .values(insertReport)
      .returning();
    return report;
  }

  async updateSavedReport(id: string, updates: Partial<InsertSavedReport>): Promise<SavedReport | undefined> {
    const [updated] = await db
      .update(savedReports)
      .set(updates)
      .where(eq(savedReports.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteSavedReport(id: string): Promise<boolean> {
    const result = await db.delete(savedReports).where(eq(savedReports.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getFolders(): Promise<Folder[]> {
    return await db.select().from(folders);
  }

  async getFolder(id: string): Promise<Folder | undefined> {
    const [folder] = await db.select().from(folders).where(eq(folders.id, id));
    return folder || undefined;
  }

  async createFolder(insertFolder: InsertFolder): Promise<Folder> {
    const [folder] = await db
      .insert(folders)
      .values(insertFolder)
      .returning();
    return folder;
  }

  async deleteFolder(id: string): Promise<boolean> {
    // First, unassign any reports from this folder
    await db
      .update(savedReports)
      .set({ folderId: null })
      .where(eq(savedReports.folderId, id));
    
    // Then delete the folder
    const result = await db.delete(folders).where(eq(folders.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getRecentReports(): Promise<RecentReport[]> {
    const reports = await db
      .select()
      .from(recentReports)
      .orderBy(desc(recentReports.lastOpenedAt))
      .limit(10);
    return reports;
  }

  async addRecentReport(insertRecentReport: InsertRecentReport): Promise<RecentReport> {
    // Use onConflictDoUpdate to handle upsert atomically
    // Use SQL expressions to ensure database updates and returns fresh values
    const [recentReport] = await db
      .insert(recentReports)
      .values(insertRecentReport)
      .onConflictDoUpdate({
        target: recentReports.reportId,
        set: {
          reportName: sql`excluded.report_name`,
          lastOpenedAt: sql`now()`,
        },
      })
      .returning();
    return recentReport;
  }
}

export const storage = new DatabaseStorage();

// Seed initial data
export async function seedDatabase() {
  // Check if we already have folders (avoid duplicate seeding)
  const existingFolders = await storage.getFolders();
  if (existingFolders.length > 0) {
    return; // Already seeded
  }

  // Seed folders
  const folder1 = await storage.createFolder({
    name: "What's Working",
    icon: "trend-up",
  });

  const folder2 = await storage.createFolder({
    name: "What's Not Working",
    icon: "trend-down",
  });

  const folder3 = await storage.createFolder({
    name: "Launch Analysis",
    icon: "bar-chart",
  });

  // Seed reports for "What's Working"
  await storage.createSavedReport({
    name: "Top Creativos",
    description: "Los creativos con mejor rendimiento general",
    metrics: ["roas", "ctr", "spend"],
    folderId: folder1.id,
  });

  await storage.createSavedReport({
    name: "Top Ángulos",
    description: "Ángulos de mensaje más efectivos",
    metrics: ["ctr", "roas", "cpa"],
    folderId: folder1.id,
  });

  await storage.createSavedReport({
    name: "Top Click to Purchase Creatives",
    description: "Creativos con mayor tasa de conversión a compra",
    metrics: ["cpa", "roas", "spend"],
    folderId: folder1.id,
  });

  // Seed report for "What's Not Working"
  await storage.createSavedReport({
    name: "Creativos Saturados",
    description: "Creativos con fatiga de audiencia",
    metrics: ["ctr", "frequency", "cpa"],
    folderId: folder2.id,
  });

  // Seed reports for "Launch Analysis"
  await storage.createSavedReport({
    name: "Video Hold Iterations",
    description: "Análisis de retención de video",
    metrics: ["ctr", "spend", "frequency"],
    folderId: folder3.id,
  });

  await storage.createSavedReport({
    name: "Video Hooks Iterations",
    description: "Iteraciones de hooks de video",
    metrics: ["ctr", "convertScore", "roas"],
    folderId: folder3.id,
  });

  await storage.createSavedReport({
    name: "Low Hook and High Click to Purchase",
    description: "Creativos con bajo engagement pero alta conversión",
    metrics: ["roas", "cpa", "ctr"],
    folderId: folder3.id,
  });
}
