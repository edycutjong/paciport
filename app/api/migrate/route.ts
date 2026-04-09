import { executeMigration } from "@/lib/migration-engine";
import { DEMO_POSITIONS } from "@/lib/demo-data";
import { MigrationRequest } from "@/lib/types";

export async function POST(request: Request) {
  const body: MigrationRequest = await request.json();
  const { positionIds, sourceExchange = "binance", destinationExchange = "pacifica", maxSlippage = 0.1, dryRun = false } = body;

  const positions = DEMO_POSITIONS.filter((p) => positionIds.includes(p.id));

  if (positions.length === 0) {
    return Response.json({ error: "No matching positions found" }, { status: 400 });
  }

  // Hackathon demo explicit mock user
  const userId = "demo-user";

  const results = await Promise.all(
    positions.map((p) => executeMigration(p, sourceExchange, destinationExchange, userId, maxSlippage, dryRun))
  );

  const totalTimeMs = Math.max(...results.map((r) => r.executionTimeMs ?? 0));
  const allSuccess = results.every((r) => r.status === "success");

  return Response.json({
    results,
    summary: {
      total: results.length,
      successful: results.filter((r) => r.status === "success").length,
      failed: results.filter((r) => r.status !== "success").length,
      totalExecutionTimeMs: totalTimeMs,
      allSuccess,
    },
  });
}
