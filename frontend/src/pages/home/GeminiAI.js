import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';
import './home.css';

const GeminiAI = ({ transactions, budgets }) => {
    const [recommendation, setRecommendation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const geminiAPI = process.env.REACT_APP_GEMINI_API_KEY;  // Ensure your .env variable starts with REACT_APP_

    const getFinancialRecommendation = async () => {
        const categoryAmounts = transactions.reduce((acc, transaction) => {
            const { category, amount, date } = transaction;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push({ date, amount });
            return acc;
        }, {});
        const transArr = JSON.stringify(categoryAmounts);

        const budgetDetails = budgets.flatMap(item =>
            item.categories.map(cat => ({
                category: cat.category,
                amount: cat.amount,
                startDate: item.startDate,
                endDate: item.endDate
            }))
        );
        const budgetArr = JSON.stringify(budgetDetails);

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
            setRecommendation(data.candidates[0].content.parts[0].text);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="gemini-container">
            <button onClick={getFinancialRecommendation} className="containerBtn">
                {isLoading ? 'Recommending advice from the data...' : 'Get Financial Recommendation'}
            </button>
            <div className="markdown-container">
                <ReactMarkdown>{recommendation}</ReactMarkdown>
            </div>
        </section>
    );
};

export default GeminiAI;
