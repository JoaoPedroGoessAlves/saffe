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

export const githubVerificationsTable = pgTable("github_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  repoUrl: text("repo_url").notNull(),
  repoSlug: text("repo_slug").notNull(),
  token: varchar("token").notNull(),
  verified: boolean("verified").notNull().default(false),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const costAnalysesTable = pgTable("cost_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  githubVerificationId: varchar("github_verification_id").notNull(),
  repoUrl: text("repo_url").notNull(),
  repoSlug: text("repo_slug").notNull(),
  totalCost: text("total_cost").notNull(),
  totalHours: text("total_hours").notNull(),
  totalLines: text("total_lines").notNull(),
  languageBreakdown: jsonb("language_breakdown").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const julesAnalysesTable = pgTable("jules_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  repoUrl: text("repo_url").notNull(),
  repoOwner: text("repo_owner").notNull(),
  repoName: text("repo_name").notNull(),
  status: varchar("status", { enum: ["pending", "running", "completed", "failed"] }).notNull().default("pending"),
  julesSessionId: text("jules_session_id"),
  result: jsonb("result"),
  progressMessage: text("progress_message"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const insertDomainVerificationSchema = createInsertSchema(domainVerificationsTable).omit({ id: true });
export const insertScanSchema = createInsertSchema(scansTable).omit({ id: true });
export const insertScanResultSchema = createInsertSchema(scanResultsTable).omit({ id: true });
export const insertGithubVerificationSchema = createInsertSchema(githubVerificationsTable).omit({ id: true });
export const insertCostAnalysisSchema = createInsertSchema(costAnalysesTable).omit({ id: true });

export type DomainVerification = typeof domainVerificationsTable.$inferSelect;
export type InsertDomainVerification = z.infer<typeof insertDomainVerificationSchema>;
export type Scan = typeof scansTable.$inferSelect;
export type InsertScan = z.infer<typeof insertScanSchema>;
export type ScanResult = typeof scanResultsTable.$inferSelect;
export type InsertScanResult = z.infer<typeof insertScanResultSchema>;
export type GithubVerification = typeof githubVerificationsTable.$inferSelect;
export type InsertGithubVerification = z.infer<typeof insertGithubVerificationSchema>;
export type CostAnalysis = typeof costAnalysesTable.$inferSelect;
export type InsertCostAnalysis = z.infer<typeof insertCostAnalysisSchema>;
export type JulesAnalysis = typeof julesAnalysesTable.$inferSelect;
