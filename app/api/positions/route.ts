import { DEMO_POSITIONS, simulatePriceUpdate } from "@/lib/demo-data";

export async function GET() {
  const positions = simulatePriceUpdate(DEMO_POSITIONS);
  return Response.json({ positions });
}
