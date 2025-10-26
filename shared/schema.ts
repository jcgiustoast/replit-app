import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const creatives = pgTable("creatives", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
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
  name: text("name").notNull(),
  description: text("description"),
  metrics: text("metrics").notNull().array(),
  folderId: varchar("folder_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const folders = pgTable("folders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  icon: text("icon"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const recentReports = pgTable("recent_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reportId: varchar("report_id").notNull().unique(),
  reportName: text("report_name").notNull(),
  lastOpenedAt: timestamp("last_opened_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
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
export type Creative = typeof creatives.$inferSelect;
export type InsertCreative = z.infer<typeof insertCreativeSchema>;
export type SavedReport = typeof savedReports.$inferSelect;
export type InsertSavedReport = z.infer<typeof insertSavedReportSchema>;
export type Folder = typeof folders.$inferSelect;
export type InsertFolder = z.infer<typeof insertFolderSchema>;
export type RecentReport = typeof recentReports.$inferSelect;
export type InsertRecentReport = z.infer<typeof insertRecentReportSchema>;
