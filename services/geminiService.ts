import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: process.env.API_KEY is injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Sen "AxionBot"sun, Axion Craft Minecraft Skyblock sunucusunun resmi yapay zeka asistanısın.
Amacın, oyunculara sunucuya özgü sorular, üretim tarifleri ve Skyblock stratejileri konusunda yardımcı olmaktır.

Sunucu Bilgileri & Hikayesi:
- Sunucu Adı: Axion Craft
- IP Adresi: play.axioncraft.net
- Ekonomi: Ana para birimi "Void Coin"dir.
- Eşsiz Özellikler: 
  - Çevrimdışıyken bile maden kazan "Void Minyonları".
  - End dünyasında bulunan özel "Yıldız Işığı Büyüleri".
  - /is menüsü üzerinden satın alınan "Ada Yükseltmeleri".
- Kurallar: Grief yasak, hile/macro yasak, saygılı olun.

Ton: Yardımsever, heyecanlı, oyuncu dostu. Türkçe konuş. Cevapları kısa tut (liste gerekmedikçe 3 cümleyi geçme).
Eğer IP sorulursa, her zaman 'play.axioncraft.net' adresini vurgula.
Minecraft veya sunucu ile ilgisiz bir şey sorulursa, konuyu kibarca Axion Craft'a getir.
`;

export const sendWikiMessage = async (
  message: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessage({
      message: message,
    });

    return result.text || "Boşluktan bu bilgiyi çekemedim. Tekrar dene!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Axion ana bilgisayarına bağlantı kararsız. Lütfen daha sonra tekrar dene.";
  }
};