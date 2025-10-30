import { users, workspaces, connections, workspaceMembers, nomenclatureProperties, savedReports, folders, recentReports, type User, type InsertUser, type Workspace, type InsertWorkspace, type Connection, type InsertConnection, type WorkspaceMember, type InsertWorkspaceMember, type NomenclatureProperty, type InsertNomenclatureProperty, type SavedReport, type InsertSavedReport, type Folder, type InsertFolder, type RecentReport, type InsertRecentReport } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  getWorkspaces(userId: string): Promise<Workspace[]>;
  getWorkspace(id: string): Promise<Workspace | undefined>;
  createWorkspace(workspace: InsertWorkspace): Promise<Workspace>;
  updateWorkspace(id: string, updates: Partial<InsertWorkspace>): Promise<Workspace | undefined>;
  deleteWorkspace(id: string): Promise<boolean>;
  
  getConnections(workspaceId: string): Promise<Connection[]>;
  getConnection(id: string): Promise<Connection | undefined>;
  createConnection(connection: InsertConnection): Promise<Connection>;
  updateConnection(id: string, updates: Partial<InsertConnection>): Promise<Connection | undefined>;
  deleteConnection(id: string): Promise<boolean>;
  
  getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]>;
  getWorkspaceMember(id: string): Promise<WorkspaceMember | undefined>;
  addWorkspaceMember(member: InsertWorkspaceMember): Promise<WorkspaceMember>;
  updateWorkspaceMember(id: string, updates: Partial<InsertWorkspaceMember>): Promise<WorkspaceMember | undefined>;
  removeWorkspaceMember(id: string): Promise<boolean>;
  
  getNomenclatureProperties(workspaceId: string, platform?: string): Promise<NomenclatureProperty[]>;
  getNomenclatureProperty(id: string): Promise<NomenclatureProperty | undefined>;
  createNomenclatureProperty(property: InsertNomenclatureProperty): Promise<NomenclatureProperty>;
  updateNomenclatureProperty(id: string, updates: Partial<InsertNomenclatureProperty>): Promise<NomenclatureProperty | undefined>;
  deleteNomenclatureProperty(id: string): Promise<boolean>;
  
  getSavedReports(workspaceId?: string): Promise<SavedReport[]>;
  getSavedReport(id: string): Promise<SavedReport | undefined>;
  createSavedReport(report: InsertSavedReport): Promise<SavedReport>;
  updateSavedReport(id: string, updates: Partial<InsertSavedReport>): Promise<SavedReport | undefined>;
  deleteSavedReport(id: string): Promise<boolean>;

  getFolders(workspaceId?: string): Promise<Folder[]>;
  getFolder(id: string): Promise<Folder | undefined>;
  createFolder(folder: InsertFolder): Promise<Folder>;
  deleteFolder(id: string): Promise<boolean>;
  
  getRecentReports(workspaceId?: string): Promise<RecentReport[]>;
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

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updated || undefined;
  }

  async getWorkspaces(userId: string): Promise<Workspace[]> {
    const memberships = await db
      .select()
      .from(workspaceMembers)
      .where(eq(workspaceMembers.userId, userId));
    
    const workspaceIds = memberships.map(m => m.workspaceId);
    if (workspaceIds.length === 0) return [];
    
    return await db.select().from(workspaces).where(sql`${workspaces.id} = ANY(${workspaceIds})`);
  }

  async getWorkspace(id: string): Promise<Workspace | undefined> {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, id));
    return workspace || undefined;
  }

  async createWorkspace(insertWorkspace: InsertWorkspace): Promise<Workspace> {
    const [workspace] = await db
      .insert(workspaces)
      .values(insertWorkspace)
      .returning();
    return workspace;
  }

  async updateWorkspace(id: string, updates: Partial<InsertWorkspace>): Promise<Workspace | undefined> {
    const [updated] = await db
      .update(workspaces)
      .set(updates)
      .where(eq(workspaces.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteWorkspace(id: string): Promise<boolean> {
    const result = await db.delete(workspaces).where(eq(workspaces.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getConnections(workspaceId: string): Promise<Connection[]> {
    return await db.select().from(connections).where(eq(connections.workspaceId, workspaceId));
  }

  async getConnection(id: string): Promise<Connection | undefined> {
    const [connection] = await db.select().from(connections).where(eq(connections.id, id));
    return connection || undefined;
  }

  async createConnection(insertConnection: InsertConnection): Promise<Connection> {
    const [connection] = await db
      .insert(connections)
      .values(insertConnection)
      .returning();
    return connection;
  }

  async updateConnection(id: string, updates: Partial<InsertConnection>): Promise<Connection | undefined> {
    const [updated] = await db
      .update(connections)
      .set(updates)
      .where(eq(connections.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteConnection(id: string): Promise<boolean> {
    const result = await db.delete(connections).where(eq(connections.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    return await db.select().from(workspaceMembers).where(eq(workspaceMembers.workspaceId, workspaceId));
  }

  async getWorkspaceMember(id: string): Promise<WorkspaceMember | undefined> {
    const [member] = await db.select().from(workspaceMembers).where(eq(workspaceMembers.id, id));
    return member || undefined;
  }

  async addWorkspaceMember(insertMember: InsertWorkspaceMember): Promise<WorkspaceMember> {
    const [member] = await db
      .insert(workspaceMembers)
      .values(insertMember)
      .returning();
    return member;
  }

  async updateWorkspaceMember(id: string, updates: Partial<InsertWorkspaceMember>): Promise<WorkspaceMember | undefined> {
    const [updated] = await db
      .update(workspaceMembers)
      .set(updates)
      .where(eq(workspaceMembers.id, id))
      .returning();
    return updated || undefined;
  }

  async removeWorkspaceMember(id: string): Promise<boolean> {
    const result = await db.delete(workspaceMembers).where(eq(workspaceMembers.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getNomenclatureProperties(workspaceId: string, platform?: string): Promise<NomenclatureProperty[]> {
    if (platform) {
      return await db
        .select()
        .from(nomenclatureProperties)
        .where(sql`${nomenclatureProperties.workspaceId} = ${workspaceId} AND ${nomenclatureProperties.platform} = ${platform}`)
        .orderBy(nomenclatureProperties.order);
    }
    return await db
      .select()
      .from(nomenclatureProperties)
      .where(eq(nomenclatureProperties.workspaceId, workspaceId))
      .orderBy(nomenclatureProperties.order);
  }

  async getNomenclatureProperty(id: string): Promise<NomenclatureProperty | undefined> {
    const [property] = await db.select().from(nomenclatureProperties).where(eq(nomenclatureProperties.id, id));
    return property || undefined;
  }

  async createNomenclatureProperty(insertProperty: InsertNomenclatureProperty): Promise<NomenclatureProperty> {
    const [property] = await db
      .insert(nomenclatureProperties)
      .values(insertProperty)
      .returning();
    return property;
  }

  async updateNomenclatureProperty(id: string, updates: Partial<InsertNomenclatureProperty>): Promise<NomenclatureProperty | undefined> {
    const [updated] = await db
      .update(nomenclatureProperties)
      .set(updates)
      .where(eq(nomenclatureProperties.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteNomenclatureProperty(id: string): Promise<boolean> {
    const result = await db.delete(nomenclatureProperties).where(eq(nomenclatureProperties.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getSavedReports(workspaceId?: string): Promise<SavedReport[]> {
    if (workspaceId) {
      return await db
        .select()
        .from(savedReports)
        .where(eq(savedReports.workspaceId, workspaceId))
        .orderBy(desc(savedReports.createdAt));
    }
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

  async getFolders(workspaceId?: string): Promise<Folder[]> {
    if (workspaceId) {
      return await db.select().from(folders).where(eq(folders.workspaceId, workspaceId));
    }
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

  async getRecentReports(workspaceId?: string): Promise<RecentReport[]> {
    if (workspaceId) {
      const reports = await db
        .select()
        .from(recentReports)
        .where(eq(recentReports.workspaceId, workspaceId))
        .orderBy(desc(recentReports.lastOpenedAt))
        .limit(10);
      return reports;
    }
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
