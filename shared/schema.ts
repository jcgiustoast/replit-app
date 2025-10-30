import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, unique, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const workspaces = pgTable("workspaces", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  ownerId: varchar("owner_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const connections = pgTable("connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull(),
  platform: text("platform").notNull(), // 'meta', 'tiktok', 'shopify', 'tienda_nube'
  accountName: text("account_name"),
  accountId: text("account_id"),
  status: text("status").notNull().default('connected'), // 'connected', 'disconnected', 'error'
  connectedAt: timestamp("connected_at").notNull().defaultNow(),
  lastSyncAt: timestamp("last_sync_at"),
});

export const workspaceMembers = pgTable("workspace_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull(),
  userId: varchar("user_id").notNull(),
  role: text("role").notNull().default('member'), // 'owner', 'admin', 'member', 'viewer'
  addedAt: timestamp("added_at").notNull().defaultNow(),
});

export const nomenclatureProperties = pgTable("nomenclature_properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull(),
  platform: text("platform").notNull(), // 'meta', 'tiktok'
  propertyName: text("property_name").notNull(),
  allowedValues: text("allowed_values").notNull().array(),
  separator: text("separator").default('_'),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const creatives = pgTable("creatives", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id"),
  adName: text("ad_name").notNull(),
  adSetName: text("ad_set_name").notNull(),
  campaignName: text("campaign_name").notNull(),
  thumbnail: text("thumbnail").notNull(),
  spend: real("spend").notNull(),
  roas: real("roas").notNull(),
  cpa: real("cpa").notNull(),
  ctr: real("ctr").notNull(),
  frequency: real("frequency").notNull(),
  convertScore: integer("convert_score").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const savedReports = pgTable("saved_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id"),
  name: text("name").notNull(),
  description: text("description"),
  metrics: text("metrics").notNull().array(),
  filters: jsonb("filters"),
  folderId: varchar("folder_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const folders = pgTable("folders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id"),
  name: text("name").notNull(),
  icon: text("icon"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const recentReports = pgTable("recent_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id"),
  reportId: varchar("report_id").notNull().unique(),
  reportName: text("report_name").notNull(),
  lastOpenedAt: timestamp("last_opened_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWorkspaceSchema = createInsertSchema(workspaces).omit({
  id: true,
  createdAt: true,
});

export const insertConnectionSchema = createInsertSchema(connections).omit({
  id: true,
  connectedAt: true,
});

export const insertWorkspaceMemberSchema = createInsertSchema(workspaceMembers).omit({
  id: true,
  addedAt: true,
});

export const insertNomenclaturePropertySchema = createInsertSchema(nomenclatureProperties).omit({
  id: true,
  createdAt: true,
});

export const insertCreativeSchema = createInsertSchema(creatives).omit({
  id: true,
  date: true,
});

export const insertSavedReportSchema = createInsertSchema(savedReports).omit({
  id: true,
  createdAt: true,
});

export const insertFolderSchema = createInsertSchema(folders).omit({
  id: true,
  createdAt: true,
});

export const insertRecentReportSchema = createInsertSchema(recentReports).omit({
  id: true,
  lastOpenedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Workspace = typeof workspaces.$inferSelect;
export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type Connection = typeof connections.$inferSelect;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type InsertWorkspaceMember = z.infer<typeof insertWorkspaceMemberSchema>;
export type NomenclatureProperty = typeof nomenclatureProperties.$inferSelect;
export type InsertNomenclatureProperty = z.infer<typeof insertNomenclaturePropertySchema>;
export type Creative = typeof creatives.$inferSelect;
export type InsertCreative = z.infer<typeof insertCreativeSchema>;
export type SavedReport = typeof savedReports.$inferSelect;
export type InsertSavedReport = z.infer<typeof insertSavedReportSchema>;
export type Folder = typeof folders.$inferSelect;
export type InsertFolder = z.infer<typeof insertFolderSchema>;
export type RecentReport = typeof recentReports.$inferSelect;
export type InsertRecentReport = z.infer<typeof insertRecentReportSchema>;
