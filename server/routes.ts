import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMoodSubmissionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Submit mood endpoint
  app.post("/api/moods", async (req, res) => {
    try {
      const submission = insertMoodSubmissionSchema.parse(req.body);
      const created = await storage.createMoodSubmission(submission);
      res.json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid submission data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to submit mood" });
      }
    }
  });

  // Get all mood submissions
  app.get("/api/moods", async (req, res) => {
    try {
      const submissions = await storage.getMoodSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood submissions" });
    }
  });

  // Get mood statistics
  app.get("/api/moods/stats", async (req, res) => {
    try {
      const stats = await storage.getMoodStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood statistics" });
    }
  });

  // Export mood data as CSV
  app.get("/api/moods/export", async (req, res) => {
    try {
      const submissions = await storage.getMoodSubmissions();
      
      // Create CSV content
      const csvHeaders = "ID,Mood,Name,Email,Timestamp,Consent\n";
      const csvRows = submissions.map(submission => {
        const name = submission.name || "";
        const email = submission.email || "";
        const timestamp = submission.timestamp.toISOString();
        return `${submission.id},"${submission.mood}","${name}","${email}","${timestamp}",${submission.consent}`;
      }).join("\n");
      
      const csvContent = csvHeaders + csvRows;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="mood-submissions.csv"');
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to export mood data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
