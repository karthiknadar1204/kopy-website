import { fullContent, textResponse } from "@/lib/discovery";
export function GET() { return textResponse(fullContent()); }
