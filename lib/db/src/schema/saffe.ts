import { sql } from "drizzle-orm";
import { pgTable, text, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const domainVerificationsTable = pgTable("domain_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  domain: text("domain").notNull(),
  token: varchar("token").notNull(),
  verified: boolean("verified").notNull().default(false),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const scansTable = pgTable("scans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  url: text("url").notNull(),
  domain: text("domain").notNull(),
  status: varchar("status", { enum: ["pending", "running", "completed", "failed"] }).notNull().default("pending"),
  riskLevel: varchar("risk_level", { enum: ["low", "medium", "high", "critical"] }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const scanResultsTable = pgTable("scan_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scanId: varchar("scan_id").notNull(),
  checkType: varchar("check_type").notNull(),
  severity: varchar("severity", { enum: ["info", "low", "medium", "high", "critical"] }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  details: text("details"),
  fixSuggestion: text("fix_suggestion"),
  vibePrompt: text("vibe_prompt"),
  passed: boolean("passed").notNull().default(false),
});

export const insertDomainVerificationSchema = createInsertSchema(domainVerificationsTable).omit({ id: true });
export const insertScanSchema = createInsertSchema(scansTable).omit({ id: true });
export const insertScanResultSchema = createInsertSchema(scanResultsTable).omit({ id: true });

export type DomainVerification = typeof domainVerificationsTable.$inferSelect;
export type InsertDomainVerification = z.infer<typeof insertDomainVerificationSchema>;
export type Scan = typeof scansTable.$inferSelect;
export type InsertScan = z.infer<typeof insertScanSchema>;
export type ScanResult = typeof scanResultsTable.$inferSelect;
export type InsertScanResult = z.infer<typeof insertScanResultSchema>;
