import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// model 설정에 temperature를 추가해서 더 다양한 답변이 나오게 함
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: { temperature: 1.0 },
});

const topics = [
  "일상생활",
  "여행과 교통",
  "음식과 요리",
  "취미와 운동",
  "직업과 회사",
  "날씨와 계절",
  "학교와 공부",
  "쇼핑과 경제",
  "감정과 성격",
  "건강과 병원",
  "인터넷과 기술",
  "집안일과 가족",
];
const randomTopic = topics[Math.floor(Math.random() * topics.length)];
const randomSeed = Math.floor(Math.random() * 1000);

const prompt = `HSK 3급에서 4급 수준의 필수 단어 3개를 무작위로 선정해줘.
  이번에는 특히 '${randomTopic}' 주제와 관련된 단어가 있다면 우선적으로 고려해주되,
  전체적으로 아주 희귀하거나 중복되지 않는 단어들로 골라줘. (참조 번호: ${randomSeed})

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

for (let i = 0; i < retries; i++) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "");
    return JSON.parse(text);
  } catch (error) {
    if (i < retries - 1) {
      const delay = (i + 1) * 2000;
      console.warn(`[HSK-BOT] 재시도 중... (${delay}ms 후)`);
      await new Promise((res) => setTimeout(res, delay));
      continue;
    }
    console.error("제미나이 최종 에러:", error);
    return [];
  }
}
