import { moodSubmissions, type MoodSubmission, type InsertMoodSubmission, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Legacy user methods for compatibility
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Mood submission methods
  createMoodSubmission(submission: InsertMoodSubmission): Promise<MoodSubmission>;
  getMoodSubmissions(): Promise<MoodSubmission[]>;
  getMoodStats(): Promise<{
    superHappy: number;
    happy: number;
    neutral: number;
    anxious: number;
    sad: number;
    total: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Legacy user methods for compatibility
  async getUser(id: string): Promise<User | undefined> {
    // Stub implementation for compatibility
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Stub implementation for compatibility
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Stub implementation for compatibility
    const id = randomUUID();
    return { ...insertUser, id };
  }

  async createMoodSubmission(submission: InsertMoodSubmission): Promise<MoodSubmission> {
    const [moodSubmission] = await db
      .insert(moodSubmissions)
      .values(submission)
      .returning();
    return moodSubmission;
  }

  async getMoodSubmissions(): Promise<MoodSubmission[]> {
    return await db
      .select()
      .from(moodSubmissions)
      .orderBy(desc(moodSubmissions.timestamp))
      .limit(100);
  }

  async getMoodStats(): Promise<{
    superHappy: number;
    happy: number;
    neutral: number;
    anxious: number;
    sad: number;
    total: number;
  }> {
    const submissions = await db.select().from(moodSubmissions);
    const stats = {
      superHappy: 0,
      happy: 0,
      neutral: 0,
      anxious: 0,
      sad: 0,
      total: submissions.length,
    };

    submissions.forEach(submission => {
      switch (submission.mood) {
        case 'super-happy':
          stats.superHappy++;
          break;
        case 'happy':
          stats.happy++;
          break;
        case 'neutral':
          stats.neutral++;
          break;
        case 'anxious':
          stats.anxious++;
          break;
        case 'sad':
          stats.sad++;
          break;
      }
    });

    return stats;
  }
}

export const storage = new DatabaseStorage();
