const axios = require('axios');

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const MODEL = 'mistral';

const enhanceText = async (text, type = 'general') => {
    let prompt = '';

    if (type === 'summary') {
        prompt = `You are a professional resume writer. Rewrite the following professional summary to be more impactful, concise, and result-oriented. Do NOT change the factual meaning. Do not invent new skills or experiences. Keep it professional and polished.\n\nOriginal Text:\n"${text}"\n\nEnhanced Version:`;
    } else if (type === 'experience') {
        prompt = `You are a professional resume writer. Rewrite the following work experience description to use strong action verbs, quantify results where possible, and improve clarity. Do NOT add false information. Keep the original meaning.\n\nOriginal Text:\n"${text}"\n\nEnhanced Version:`;
    } else {
        prompt = `Improve the grammar and professional tone of the following text for a resume. Do not change the meaning.\n\nOriginal Text:\n"${text}"\n\nResult:`;
    }

    try {
        const response = await axios.post(OLLAMA_API_URL, {
            model: MODEL,
            prompt: prompt,
            stream: false
        });

        if (response.data && response.data.response) {
            return response.data.response.trim();
        } else {
            throw new Error('Invalid response from Ollama');
        }
    } catch (error) {
        console.error('Error calling Ollama:', error.message);
        throw new Error('AI Service Unavailable');
    }
};

module.exports = { enhanceText };
