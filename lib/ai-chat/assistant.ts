import { aiChatDisclaimer } from "@/lib/ai-chat/content";

const geminiApiBaseUrl = "https://generativelanguage.googleapis.com/v1beta/models";
const fallbackModel = "gemini-2.5-flash-lite";
const maxQuestionLength = 500;
const retryableProviderStatuses = new Set([429, 500, 502, 503, 504]);
const retryDelayMs = 700;

const systemPrompt = `
You are the health Q&A assistant for a Korean wellness coaching service.

Follow these rules:
- Respond in Korean.
- Give general wellness education only, not diagnosis.
- Never claim certainty from limited information.
- If symptoms sound urgent, severe, rapidly worsening, or potentially dangerous, clearly advise immediate in-person medical care.
- Keep the answer practical, calm, and easy to scan.
- Do not mention internal policies.

Format the answer exactly with these section titles:
핵심 답변
바로 해볼 것
병원 상담이 필요한 경우
주의
`.trim();

export class AiChatConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiChatConfigError";
  }
}

export class AiChatRequestError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "AiChatRequestError";
    this.status = status;
  }
}

type AiChatResult = {
  answer: string;
  disclaimer: string;
  model: string;
};

type GeminiTextPart = {
  text?: string;
};

type GeminiContent = {
  parts?: GeminiTextPart[];
};

type GeminiCandidate = {
  content?: GeminiContent;
};

type GeminiResponsePayload = {
  candidates?: GeminiCandidate[];
  error?: {
    message?: string;
  };
};

function resolveModel() {
  return process.env.GEMINI_MODEL?.trim() || fallbackModel;
}

function resolveFallbackModel() {
  return process.env.GEMINI_FALLBACK_MODEL?.trim() || "";
}

function extractResponseText(payload: GeminiResponsePayload) {
  const messageParts =
    payload.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => (typeof part.text === "string" ? part.text.trim() : ""))
      .filter(Boolean) ?? [];

  return messageParts.join("\n\n").trim();
}

function isQuotaErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes("quota") ||
    normalizedMessage.includes("resource has been exhausted") ||
    normalizedMessage.includes("rate limit")
  );
}

function isTemporaryOverloadMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes("high demand") ||
    normalizedMessage.includes("temporarily unavailable") ||
    normalizedMessage.includes("service unavailable") ||
    normalizedMessage.includes("try again later") ||
    normalizedMessage.includes("overloaded") ||
    normalizedMessage.includes("unavailable")
  );
}

function normalizeProviderError(message: string, status: number) {
  if (status === 401 || status === 403) {
    return "Gemini API 키를 확인해 주세요. 키가 잘못되었거나 현재 프로젝트에서 사용할 수 없는 상태일 수 있습니다.";
  }

  if (status === 429 && isQuotaErrorMessage(message)) {
    return "Gemini 무료 사용 한도에 도달했습니다. 잠시 후 다시 시도하거나 Google AI Studio에서 사용량을 확인해 주세요.";
  }

  if (retryableProviderStatuses.has(status) && isTemporaryOverloadMessage(message)) {
    return "AI 답변 요청이 잠시 몰리고 있어요. 잠시 후 다시 질문해 주세요.";
  }

  return message;
}

function shouldRetryProviderRequest(message: string, status: number) {
  if (!retryableProviderStatuses.has(status)) {
    return false;
  }

  if (status !== 429) {
    return true;
  }

  return !isQuotaErrorMessage(message);
}

async function readGeminiError(response: Response) {
  try {
    const payload = (await response.json()) as GeminiResponsePayload;
    const message = payload.error?.message?.trim() || "Gemini API 호출 중 오류가 발생했습니다.";

    return normalizeProviderError(message, response.status);
  } catch {
    return normalizeProviderError("Gemini API 호출 중 오류가 발생했습니다.", response.status);
  }
}

function waitForRetry() {
  return new Promise((resolve) => {
    setTimeout(resolve, retryDelayMs);
  });
}

async function requestGeminiAnswer(model: string, apiKey: string, validatedQuestion: string) {
  const response = await fetch(`${geminiApiBaseUrl}/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [
          {
            text: systemPrompt,
          },
        ],
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `질문: ${validatedQuestion}`,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.8,
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await readGeminiError(response);

    return {
      ok: false as const,
      message,
      status: response.status,
    };
  }

  const payload = (await response.json()) as GeminiResponsePayload;
  const answer = extractResponseText(payload);

  if (!answer) {
    return {
      ok: false as const,
      message: "응답을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      status: 502,
    };
  }

  return {
    ok: true as const,
    answer,
  };
}

export function validateAiChatQuestion(question: string) {
  const normalizedQuestion = question.trim();

  if (!normalizedQuestion) {
    throw new AiChatRequestError("질문을 입력해 주세요.", 400);
  }

  if (normalizedQuestion.length > maxQuestionLength) {
    throw new AiChatRequestError(`질문은 ${maxQuestionLength}자 이하로 입력해 주세요.`, 400);
  }

  return normalizedQuestion;
}

export async function askAiChat(question: string): Promise<AiChatResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim();

  if (!apiKey) {
    throw new AiChatConfigError("GEMINI_API_KEY 또는 GOOGLE_API_KEY가 설정되지 않았습니다.");
  }

  const validatedQuestion = validateAiChatQuestion(question);
  const modelCandidates = Array.from(new Set([resolveModel(), resolveFallbackModel()].filter(Boolean)));
  let lastError: AiChatRequestError | null = null;

  for (const model of modelCandidates) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const result = await requestGeminiAnswer(model, apiKey, validatedQuestion);

      if (result.ok) {
        return {
          answer: result.answer,
          disclaimer: aiChatDisclaimer,
          model,
        };
      }

      lastError = new AiChatRequestError(result.message, result.status);

      if (attempt === 0 && shouldRetryProviderRequest(result.message, result.status)) {
        await waitForRetry();
        continue;
      }

      break;
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new AiChatRequestError("응답을 가져오지 못했습니다.", 500);
}
