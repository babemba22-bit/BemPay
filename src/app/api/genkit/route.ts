export const dynamic = "force-dynamic";

import createApp from "@genkit-ai/next";
import type { NextRequest } from "next/server";
import "@/ai/dev";
import "@/ai/genkit";

const { GET: getHandler, POST: postHandler } = createApp();

export async function GET(request: NextRequest): Promise<Response> {
  return getHandler(request);
}

export async function POST(request: NextRequest): Promise<Response> {
  return postHandler(request);
}
