import { auth } from "@/auth";
import {
  askHealthCoach,
  HealthAssistantConfigError,
  HealthAssistantRequestError,
  validateHealthQuestion,
} from "@/lib/health/assistant";

export const runtime = "nodejs";

type HealthChatRequestBody = {
  question?: string;
};

function getQuestionFromBody(body: unknown): string {
  if (!body || typeof body !== "object") {
    return "";
  }

  const { question } = body as HealthChatRequestBody;

  return typeof question === "string" ? question : "";
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "건강 코치 질문 기능은 로그인 후 이용할 수 있습니다." }, { status: 401 });
  }

  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return Response.json({ error: "요청 형식을 읽지 못했습니다." }, { status: 400 });
  }

  try {
    const question = validateHealthQuestion(getQuestionFromBody(requestBody));
    const result = await askHealthCoach(question);

    return Response.json(result);
  } catch (error) {
    if (error instanceof HealthAssistantConfigError) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (error instanceof HealthAssistantRequestError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json({ error: "건강 코치 응답을 가져오지 못했습니다." }, { status: 500 });
  }
}
