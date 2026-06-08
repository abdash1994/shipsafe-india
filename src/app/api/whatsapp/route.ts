import { NextRequest, NextResponse } from "next/server";
import { scanUrl } from "@/lib/scanner";
import { parseGithubUrl, scanGithubRepo } from "@/lib/github-scanner";
import { ScanResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

// Twilio credentials from environment
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || ""; // e.g. whatsapp:+14155238886

function extractUrl(text: string): string | null {
  // Match URLs in the message text
  const urlPattern =
    /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi;
  const matches = text.match(urlPattern);
  if (!matches) return null;
  // Prefer github.com or https:// URLs
  const github = matches.find(m => m.includes("github.com"));
  if (github) return github;
  const https = matches.find(m => m.startsWith("https://") || m.startsWith("http://"));
  return https || matches[0];
}

function formatWhatsAppReport(result: ScanResult): string {
  const gradeEmoji =
    result.grade === "A" ? "🟢" :
    result.grade === "B" ? "🟡" :
    result.grade === "C" ? "🟠" :
    result.grade === "D" ? "🔴" : "⛔";

  const url = result.url.replace("https://", "").replace("http://", "");

  let msg = `*ShipSafe India* 🛡️\n`;
  msg += `━━━━━━━━━━━━━━━━━━\n`;
  msg += `📍 *${url}*\n\n`;
  msg += `${gradeEmoji} *Grade: ${result.grade}* | Score: ${result.score}/100\n`;
  msg += `⏱ Scanned in ${(result.scanDurationMs / 1000).toFixed(1)}s\n\n`;

  // Summary
  const s = result.summary;
  if (s.critical > 0) msg += `🔴 ${s.critical} Critical\n`;
  if (s.high > 0) msg += `🟠 ${s.high} High\n`;
  if (s.medium > 0) msg += `🟡 ${s.medium} Medium\n`;
  msg += `✅ ${s.passed} Passed\n\n`;

  // Top fails (max 5 to keep message short)
  const fails = result.categories
    .flatMap(c => c.checks)
    .filter(c => c.status === "fail")
    .slice(0, 5);

  if (fails.length > 0) {
    msg += `*Top Issues:*\n`;
    fails.forEach(f => {
      const icon = f.isIndiaSpecific ? "🇮🇳 " : "";
      msg += `✗ ${icon}${f.title}\n`;
    });
    msg += "\n";
  }

  // India-specific wins
  const indiaPass = result.categories
    .flatMap(c => c.checks)
    .filter(c => c.isIndiaSpecific && c.status === "pass");
  if (indiaPass.length > 0) {
    msg += `*India Compliance Passed:*\n`;
    indiaPass.slice(0, 3).forEach(c => {
      msg += `✓ 🇮🇳 ${c.title}\n`;
    });
    msg += "\n";
  }

  msg += `🔗 Full report: https://shipsafe-india.vercel.app`;

  return msg;
}

async function sendWhatsAppReply(to: string, body: string): Promise<void> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    console.warn("Twilio credentials not configured");
    return;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const params = new URLSearchParams({
    From: TWILIO_WHATSAPP_FROM,
    To: to,
    Body: body,
  });

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")}`,
    },
    body: params.toString(),
  });
}

// Twilio sends a POST with form-encoded body
export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const body = params.get("Body")?.trim() || "";
    const from = params.get("From") || "";

    if (!from) {
      return new NextResponse("OK", { status: 200 });
    }

    const rawUrl = extractUrl(body);

    if (!rawUrl) {
      await sendWhatsAppReply(
        from,
        `*ShipSafe India* 🛡️\n\nSend me a URL to scan, like:\n\n• https://yourapp.in\n• github.com/user/repo\n\nI'll check DPDP compliance, security, SEO, and more.`
      );
      return new NextResponse("OK", { status: 200 });
    }

    // Run scan
    const normalizedUrl = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

    let result: ScanResult;
    const github = parseGithubUrl(normalizedUrl);
    if (github) {
      result = await scanGithubRepo(github.owner, github.repo);
    } else {
      result = await scanUrl(normalizedUrl);
    }

    const message = formatWhatsAppReport(result);
    await sendWhatsAppReply(from, message);

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return new NextResponse("OK", { status: 200 }); // Always 200 to Twilio
  }
}

// Health check for webhook verification
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "ShipSafe India WhatsApp Bot",
    webhook: "/api/whatsapp",
    setup: "https://github.com/abdash1994/shipsafe-india#whatsapp-bot-setup",
  });
}
