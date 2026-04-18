import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function getAIHSKWords() {
  const prompt = `HSK 3급에서 4급 수준의 필수 단어 3개를 무작위로 선정해서
  반드시 아래의 JSON 형식으로만 응답해줘. 예문(example_cn)에는 반드시 괄호 안에 병음을 함께 적어줘.

  응답 형식:
  [
    {
      "word": "단어",
      "pinyin": "단어 병음",
      "definition": "뜻",
      "example_cn": "중국어 예문 (예문의 병음)",
      "example_kr": "한국어 해석"
    }
  ]

  주의: JSON 외에 설명이나 인사말 등 다른 말은 절대로 하지 마.`;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "");
    return JSON.parse(text);
  } catch (error) {
    console.error("제미나이 에러:", error);
    return [];
  }
}
