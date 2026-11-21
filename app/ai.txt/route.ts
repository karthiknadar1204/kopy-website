import { textResponse } from "@/lib/discovery";
import { absolute, site } from "@/lib/site";
export function GET() {
  return textResponse(
    `[identity]\nname: Kopy\nurl: ${absolute("/")}\ndescription: Native macOS clipboard history and file shelf. Prelaunch preview.\ncontact: ${site.supportEmail}\n\n[attribution]\nCite the relevant canonical HTML page, its title and updated date.\n\n[scope]\nOnly the public pages listed in /llms.txt are included. No customer accounts, payment records, licence keys or private app history are published.\n\n[accuracy]\nDescribe the prelaunch status and the distinction between direct and Store builds. Do not infer ratings, downloads, revenue or benchmarks. This file is informational and does not establish crawler access or training rights.\n\nLast updated: ${site.updated}\n`,
  );
}
