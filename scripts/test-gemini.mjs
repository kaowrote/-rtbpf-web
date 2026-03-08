import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = "AIzaSyBjJIWflHf0I2sZUYjv62-dkzT1dOxm1cQ";
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    console.log("Testing Gemini API...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Translate 'สวัสดีครับ' to English.");
        console.log("Response:", result.response.text());
        console.log("Gemini API is WORKING!");
    } catch (error) {
        console.error("Gemini API Error:", error);
    }
}

test();
