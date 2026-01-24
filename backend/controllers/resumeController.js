const pdfParse = require('pdf-parse');
const aiService = require('../services/aiService');
const fs = require('fs');

exports.enhanceContent = async (req, res) => {
    try {
        const { text, type } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const enhancedText = await aiService.enhanceText(text, type);
        res.json({ enhancedText });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.parseResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const dataBuffer = fs.readFileSync(req.file.path);

        let text = '';
        if (req.file.mimetype === 'application/pdf') {
            const data = await pdfParse(dataBuffer);
            text = data.text;
        } else {
            // For now only PDF, or add docx support later
            return res.status(400).json({ error: 'Only PDF supported for now' });
        }

        // Cleanup uploaded file
        fs.unlinkSync(req.file.path);

        res.json({ text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to parse file' });
    }
};
