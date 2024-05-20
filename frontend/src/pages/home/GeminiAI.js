import React, { useState, useEffect, useRef } from "react";
import './home.css';
import { GeminiAPI } from "./geminiApi";

const GeminiAI = ({ transactions }) => {
    const [recommendation, setRecommendation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const textareaRef = useRef(null);
    const geminiAPI = GeminiAPI
    
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    };
    
    useEffect(() => {
        adjustTextareaHeight();
    }, [recommendation]);
    
    const getFinancialRecommendation = async () => {
        setIsLoading(true);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Act as a financial advisor and provide recommendation and suggestion based on the following data: ${JSON.stringify(transactions)},
                        response only in ENGLISH,
                        analyze the data focusing on the amount, category, createdAt, title, and transactionType fields in each transaction.
                        Summarize the data in 2-3 sentences (don't provide total income or total expenses), also don't use numerals in the response except while relating monthly incomes and expenses.
                        Provide concise recommendations and suggestions based on this data, limited to 50 words or 2-3 sentences.
                        Include a tip for increasing income and a tip for reducing expenses (excluding tips related to tracking expenses or using applications to track expenses or incomes).
                        The response should be in key points.`
                    }]
                }]
            })
        };
        
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiAPI}`, options);
            const data = await response.json();
            // console.log(GeminiAPI);
            setRecommendation(data.candidates[0].content.parts[0].text);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button onClick={getFinancialRecommendation} className="containerBtn">
                {isLoading ? 'Recommending advice from the data...' : 'Get Financial Recommendation'}
            </button>
            <div>
                <textarea
                    ref={textareaRef}
                    value={recommendation}
                    readOnly
                    placeholder="Financial Recommendation"
                    className="containerBtn"
                />
            </div>
        </div>
    );
};

export default GeminiAI;
