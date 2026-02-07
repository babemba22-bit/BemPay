export const dynamic = "force-dynamic";

import { createApp } from "@genkit-ai/next";
import "@/ai/dev";
import "@/ai/genkit";

const { GET, POST } = createApp();

export { GET, POST };
