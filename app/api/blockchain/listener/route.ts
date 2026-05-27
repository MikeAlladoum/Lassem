/**
 * API Route pour gérer le listener blockchain
 * Permet de démarrer/arrêter l'écoute des événements
 */

import { NextRequest, NextResponse } from "next/server";
import { initializeBlockchainListeners, stopBlockchainListeners } from "@/lib/blockchain-listener";
import { initializeCronJobs, stopCronJobs } from "@/lib/cron-scheduler";

let listenerStarted = false;
let cronStarted = false;

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === "start") {
      if (!listenerStarted) {
        await initializeBlockchainListeners();
        listenerStarted = true;
      }

      if (!cronStarted) {
        initializeCronJobs();
        cronStarted = true;
      }

      return NextResponse.json({
        success: true,
        data: {
          message: "Blockchain listener and CRON jobs started",
          status: "running",
        },
      });
    } else if (action === "stop") {
      if (listenerStarted) {
        await stopBlockchainListeners();
        listenerStarted = false;
      }

      if (cronStarted) {
        stopCronJobs();
        cronStarted = false;
      }

      return NextResponse.json({
        success: true,
        data: {
          message: "Blockchain listener and CRON jobs stopped",
          status: "stopped",
        },
      });
    } else if (action === "status") {
      return NextResponse.json({
        success: true,
        data: {
          listenerStatus: listenerStarted ? "running" : "stopped",
          cronStatus: cronStarted ? "running" : "stopped",
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid action. Use 'start', 'stop', or 'status'",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error managing blockchain listener:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
