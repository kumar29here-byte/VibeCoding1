import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const moodSubmissions = pgTable("mood_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mood: text("mood").notNull(), // 'super-happy', 'happy', 'neutral', 'anxious', 'sad'
  name: text("name"),
  email: text("email"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  consent: boolean("consent").default(true).notNull(),
});

export const insertMoodSubmissionSchema = createInsertSchema(moodSubmissions).omit({
  id: true,
  timestamp: true,
});

export type InsertMoodSubmission = z.infer<typeof insertMoodSubmissionSchema>;
export type MoodSubmission = typeof moodSubmissions.$inferSelect;

// Legacy user schema for compatibility
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
