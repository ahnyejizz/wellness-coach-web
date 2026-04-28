import { healthAssistantDisclaimer } from "@/lib/health/content";

const geminiApiBaseUrl = "https://generativelanguage.googleapis.com/v1beta/models";
const fallbackModel = "gemini-2.5-flash-lite";
const maxQuestionLength = 500;

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

export class HealthAssistantConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HealthAssistantConfigError";
  }
}

export class HealthAssistantRequestError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "HealthAssistantRequestError";
    this.status = status;
  }
}

type HealthAssistantResult = {
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

function extractResponseText(payload: GeminiResponsePayload) {
  const messageParts =
    payload.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => (typeof part.text === "string" ? part.text.trim() : ""))
      .filter(Boolean) ?? [];

  return messageParts.join("\n\n").trim();
}

function normalizeProviderError(message: string, status: number) {
  if (status === 401 || status === 403) {
    return "Gemini API 키를 확인해 주세요. 키가 잘못되었거나 현재 프로젝트에서 사용할 수 없는 상태일 수 있습니다.";
  }

  if (status === 429) {
    return "Gemini 무료 사용 한도에 도달했습니다. 잠시 후 다시 시도하거나 Google AI Studio에서 사용량을 확인해 주세요.";
  }

  return message;
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

export function validateHealthQuestion(question: string) {
  const normalizedQuestion = question.trim();

  if (!normalizedQuestion) {
    throw new HealthAssistantRequestError("질문을 입력해 주세요.", 400);
  }

  if (normalizedQuestion.length > maxQuestionLength) {
    throw new HealthAssistantRequestError(`질문은 ${maxQuestionLength}자 이하로 입력해 주세요.`, 400);
  }

  return normalizedQuestion;
}

export async function askHealthCoach(question: string): Promise<HealthAssistantResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim();

  if (!apiKey) {
    throw new HealthAssistantConfigError("GEMINI_API_KEY 또는 GOOGLE_API_KEY가 설정되지 않았습니다.");
  }

  const validatedQuestion = validateHealthQuestion(question);
  const model = resolveModel();

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
    throw new HealthAssistantRequestError(message, response.status);
  }

  const payload = (await response.json()) as GeminiResponsePayload;
  const answer = extractResponseText(payload);

  if (!answer) {
    throw new HealthAssistantRequestError("응답을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.", 502);
  }

  return {
    answer,
    disclaimer: healthAssistantDisclaimer,
    model,
  };
}
