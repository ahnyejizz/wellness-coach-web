import { healthAssistantDisclaimer } from "@/lib/health/content";

const openAIEndpoint = "https://api.openai.com/v1/responses";
const fallbackModel = "gpt-4.1-mini";
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

type OpenAIContentItem = {
  type?: string;
  text?: string;
};

type OpenAIOutputItem = {
  type?: string;
  content?: OpenAIContentItem[];
};

type OpenAIResponsePayload = {
  output_text?: string;
  output?: OpenAIOutputItem[];
  error?: {
    message?: string;
  };
};

function resolveModel() {
  return process.env.OPENAI_MODEL?.trim() || fallbackModel;
}

function extractResponseText(payload: OpenAIResponsePayload) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const messageParts =
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => (typeof content.text === "string" ? content.text.trim() : ""))
      .filter(Boolean) ?? [];

  return messageParts.join("\n\n").trim();
}

async function readOpenAIError(response: Response) {
  try {
    const payload = (await response.json()) as OpenAIResponsePayload;
    return payload.error?.message?.trim() || "OpenAI API 호출 중 오류가 발생했습니다.";
  } catch {
    return "OpenAI API 호출 중 오류가 발생했습니다.";
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
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new HealthAssistantConfigError("OPENAI_API_KEY가 설정되지 않았습니다.");
  }

  const validatedQuestion = validateHealthQuestion(question);
  const model = resolveModel();

  const response = await fetch(openAIEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      instructions: systemPrompt,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `질문: ${validatedQuestion}`,
            },
          ],
        },
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await readOpenAIError(response);
    throw new HealthAssistantRequestError(message, response.status);
  }

  const payload = (await response.json()) as OpenAIResponsePayload;
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
