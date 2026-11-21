import { llmsIndex, textResponse } from "@/lib/discovery";
export function GET() {
  return textResponse(llmsIndex());
}
