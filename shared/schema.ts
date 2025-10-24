import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp } from "drizzle-orm/pg-core";
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCreativeSchema = createInsertSchema(creatives).omit({
  id: true,
  date: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Creative = typeof creatives.$inferSelect;
export type InsertCreative = z.infer<typeof insertCreativeSchema>;
