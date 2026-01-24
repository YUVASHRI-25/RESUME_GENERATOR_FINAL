import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Wand2, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

const UploadResumePage = () => {
    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('resume', file);

        try {
            const res = await axios.post('http://localhost:5000/api/parse', formData);
            setExtractedText(res.data.text);
        } catch (err) {
            console.error(err);
            alert('Failed to parse resume');
        }
    };

    const enhanceText = async () => {
        if (!extractedText) return;
        setIsEnhancing(true);
        try {
            const res = await axios.post('http://localhost:5000/api/enhance', { text: extractedText, type: 'general' });
            setExtractedText(res.data.enhancedText);
        } catch (err) {
            console.error(err);
            alert('Failed to enhance');
        } finally {
            setIsEnhancing(false);
        }
    };

    const downloadEnhanced = () => {
        const doc = new jsPDF();
        const splitText = doc.splitTextToSize(extractedText, 180);
        doc.text(splitText, 10, 10);
        doc.save('enhanced_resume.pdf');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Enhance Your Resume</h1>

            <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
                {!extractedText ? (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
                        <Upload size={48} className="text-gray-400 mb-4" />
                        <input type="file" onChange={handleFileChange} accept=".pdf" className="mb-4" />
                        <button onClick={handleUpload} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                            Upload & Analyze
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Resume Content</h2>
                            <div className="flex gap-4">
                                <button onClick={enhanceText} disabled={isEnhancing} className="flex items-center gap-2 text-indigo-600 border border-indigo-600 px-4 py-2 rounded hover:bg-indigo-50">
                                    <Wand2 size={18} /> {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
                                </button>
                                <button onClick={downloadEnhanced} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                                    <Download size={18} /> Download
                                </button>
                            </div>
                        </div>
                        <textarea
                            className="w-full h-96 border p-4 rounded bg-gray-50 whitespace-pre-wrap"
                            value={extractedText}
                            onChange={(e) => setExtractedText(e.target.value)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadResumePage;
