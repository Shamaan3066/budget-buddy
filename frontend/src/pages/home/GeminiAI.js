import React, { useState, useEffect, useRef } from "react";
import './home.css';
import { GeminiAPI } from "./geminiApi";

const GeminiAI = ({ transactions, budgets }) => {
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
        // console.log(transactions);
        const categoryAmounts = transactions.reduce((acc, transaction) => {
            const { category, amount, date } = transaction;
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push({ date, amount });
            return acc;
          }, {});
          const transArr = JSON.stringify(categoryAmounts);
          console.log(transArr);
        // console.log(budgets);
        const budgetDetails = budgets.flatMap(item => 
            item.categories.map(cat => ({
              category: cat.category,
              amount: cat.amount,
              startDate: item.startDate,
              endDate: item.endDate
            }))
          );
          const budgetArr = JSON.stringify(budgetDetails);
          console.log(budgetArr);
        setIsLoading(true);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `
                        Data currency is Rupees. 
                        Data: budget array[${budgetArr}], expense array[${transArr}]; provide insights and recommendations for this data.
                        Make sure to not include any tables and do not suggest tools(apps) for budgeting.
                        `
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
