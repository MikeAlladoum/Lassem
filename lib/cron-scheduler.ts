/**
 * CRON Scheduler
 * Initialise et gère les tâches planifiées de l'application
 */

import cron from "node-cron";
import { processAutomaticRefunds } from "./refund-cron";

let scheduledJobs: cron.ScheduledTask[] = [];

/**
 * Initialise tous les CRON jobs
 * À appeler au démarrage du serveur
 */
export function initializeCronJobs() {
  try {
    console.log("⏰ Initializing CRON jobs...");

    // CRON: Remboursements automatiques (toutes les heures)
    const refundJob = cron.schedule("0 * * * *", async () => {
      console.log("🕐 Running automatic refund CRON job...");
      await processAutomaticRefunds();
    });

    scheduledJobs.push(refundJob);

    console.log("✅ CRON jobs initialized successfully");
    console.log("  📌 Automatic refunds: every hour at :00");
  } catch (error) {
    console.error("❌ Error initializing CRON jobs:", error);
  }
}

/**
 * Arrête tous les CRON jobs
 * À appeler à l'arrêt du serveur
 */
export function stopCronJobs() {
  try {
    console.log("⏹ Stopping CRON jobs...");

    for (const job of scheduledJobs) {
      job.stop();
    }

    scheduledJobs = [];

    console.log("✅ All CRON jobs stopped");
  } catch (error) {
    console.error("❌ Error stopping CRON jobs:", error);
  }
}

export default {
  initializeCronJobs,
  stopCronJobs,
};
