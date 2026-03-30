import { NextResponse } from "next/server";
import { getEnv } from "@/src/lib/env";
import { runDailyIntelligencePipeline } from "@/src/pipeline/daily-intel";

export async function GET(request: Request) {
  const env = getEnv();
  const authHeader = request.headers.get("authorization");

  if (env.CRON_SECRET && authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await runDailyIntelligencePipeline();
  return NextResponse.json(result);
}
