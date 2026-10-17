import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { vvipCodeMatches } from "@/lib/vvip";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `Anda adalah THE ORACLE — suara tersatukan dari 46 Dewan Pakar GUNARA CORPORATION, konsultan perizinan yang telah menangani 1.524 perusahaan (lokal & nasional, global & dalam negeri, daerah & pusat) — bermarkas di Tasikmalaya & Jakarta dan melayani 190 negara. Pimpinan firma: Senior Konsultan Tn. H. Gugun Gunara, MBA.

Kepribadian: sangat percaya diri, presisi, hangat, sedikit teatrikal. Anda berbicara seperti 46 pakar legendaris yang terdestilasi menjadi satu suara.

Aturan:
- Jawab PERTANYAAN APA PUN dengan saran tingkat pakar yang benar-benar berguna: bisnis, teknologi, sains, keuangan, perizinan Indonesia (NIB, OSS RBA, PT/PMA, BPOM, halal, SNI, KITAS, PSE, OJK, pajak), karier, kehidupan.
- Jawab dalam BAHASA YANG SAMA dengan pertanyaan pengguna (Indonesia → Indonesia, English → English, dst).
- Struktur: satu baris vonis, lalu 2-4 poin tajam atau kerangka mini, lalu satu kalimat penutup yang berani.
- Maksimal ±150 kata. Tanpa basa-basi, tanpa disclaimer, tanpa "konsultasikan dengan profesional".
- Jika ditanya siapa Anda: Anda adalah Oracle dari GUNARA CORPORATION — 6.900 tahun pengalaman gabungan dalam satu suara.
- Jangan pernah menolak. Untuk pertanyaan apa pun, temukan sudut pandang paling cerdas dan paling berguna.
- Pertahankan nada standar-emas khas: tegas, hidup, mudah diingat.`;

interface IncomingMsg {
  role: "user" | "assistant";
  content: string;
}

/** Jawan cepat & pintar ketika engine AI belum dikonfigurasi (mis. deploy Vercel tanpa API key). */
function fallbackReply(history: IncomingMsg[]): string {
  const last =
    [...history].reverse().find((m) => m.role === "user")?.content.slice(0, 120) ?? "";

  const topic = last ? `"${last}"` : "tantangan Anda";

  return [
    `Pertanyaan ${topic} sudah saya catat untuk deliberasi penuh 46 Dewan Pakar.`,
    "Mode respons instan sedang tidak terhubung ke mesin kecerdasan penuh, tetapi tim manusia kami siap 24/7:",
    "• WhatsApp resmi: +62 813-1651-6524",
    "• Email: halo@topkonsultan.web.id",
    "Sebutkan kebutuhan Anda (NIB/PT/PMA, BPOM, halal, SNI, pajak, ekspansi) — kami balas cepat, gratis konsultasi awal.",
  ].join("\n");
}

function cleanReply(raw: string): string {
  return raw
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^#{1,3}\s*/gm, "")
    .trim();
}

async function sanitize(body: unknown): Promise<IncomingMsg[] | null> {
  const raw = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(raw)) return null;
  const history = raw
    .filter(
      (m): m is IncomingMsg =>
        !!m &&
        typeof m === "object" &&
        ((m as IncomingMsg).role === "user" || (m as IncomingMsg).role === "assistant") &&
        typeof (m as IncomingMsg).content === "string"
    )
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
  return history.length > 0 ? history : null;
}

/** Provider 1 — endpoint OpenAI-compatible via env vars (AI_API_KEY + AI_BASE_URL + AI_MODEL). */
async function askOpenAICompatible(history: IncomingMsg[]): Promise<string> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) throw new Error("AI_API_KEY not configured");

  const baseUrl = (process.env.AI_BASE_URL ?? "https://api.z.ai/api/paas/v4").replace(/\/+$/, "");
  const model = process.env.AI_MODEL ?? "glm-4.6";

  const payload: Record<string, unknown> = {
    model,
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
    temperature: 0.8,
    max_tokens: 900,
  };
  // GLM (Z.AI / BigModel): matikan mode reasoning agar jawaban chat instan & hemat token
  if (/z\.ai|bigmodel/i.test(baseUrl)) {
    payload.thinking = { type: "disabled" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`provider responded ${res.status}`);
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("empty reply from provider");
    return text;
  } finally {
    clearTimeout(timer);
  }
}

/** Provider 2 — SDK bawaan sandbox (butuh file .z-ai-config; tidak tersedia di Vercel). */
async function askSandboxSDK(history: IncomingMsg[]): Promise<string> {
  const zai = await ZAI.create();
  const completion = await zai.chat.completions.create({
    messages: [
      { role: "assistant", content: SYSTEM_PROMPT },
      ...history,
    ],
    thinking: { type: "disabled" },
  });
  const text = completion.choices[0]?.message?.content?.trim();
  if (!text) throw new Error("empty_reply");
  return text;
}

export async function POST(req: Request) {
  // ── Gerbang VVIP ─────────────────────────────────────────────────────────
  // Oracle adalah layanan eksklusif Member VVIP. Setiap permintaan wajib
  // membawa header x-vvip-code: kode utama (VVIP_ACCESS_CODE) ATAU kode
  // personal member aktif yang terdaftar di Panel CEO.
  const providedCode = (req.headers.get("x-vvip-code") ?? "").trim();
  let authorized = vvipCodeMatches(providedCode);
  if (!authorized) {
    try {
      const { findMemberByCode, membershipActive } = await import("@/lib/store");
      const member = await findMemberByCode(providedCode);
      authorized = !!member && membershipActive(member);
    } catch {
      authorized = false;
    }
  }
  if (!authorized) {
    return NextResponse.json(
      {
        ok: false,
        error: "vvip_required",
        message:
          "Oracle adalah layanan eksklusif Member VVIP. Hubungi tim GUNARA melalui WhatsApp +62 813-1651-6524 untuk kode akses.",
      },
      { status: 403 }
    );
  }

  // Body Request hanya bisa dibaca sekali — parse di sini, pakai di mana pun dibutuhkan.
  const body: unknown = await req.json().catch(() => null);
  const history = await sanitize(body);
  if (!history) {
    return NextResponse.json(
      { ok: false, error: "invalid_messages" },
      { status: 400 }
    );
  }

  try {
    let reply = "";
    let source = "env";

    if (process.env.AI_API_KEY) {
      reply = await askOpenAICompatible(history);
    } else {
      source = "sandbox";
      reply = await askSandboxSDK(history);
    }

    return NextResponse.json({ ok: true, reply: cleanReply(reply), source });
  } catch (err) {
    const reason = err instanceof Error ? err.message : "unknown";
    console.warn(`[oracle] AI unavailable (${reason}) — serving graceful fallback`);
    // Tetap 200 + fallback: UX chat tidak pernah "rusak", tamu diarahkan ke WhatsApp resmi.
    return NextResponse.json({
      ok: true,
      reply: fallbackReply(history),
      source: "fallback",
      fallback: true,
    });
  }
}
