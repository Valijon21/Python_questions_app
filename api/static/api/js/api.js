/**
 * PyMock Interviewer - API & Data Handling
 */
import { state, setState } from './state.js';

export async function handleStart(category = null) {
    setState({ isLoading: true, selectedCategory: category });
    try {
        const url = category ? `/api/questions?count=25&category=${encodeURIComponent(category)}` : '/api/questions?count=25';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const questions = await response.json();
        setState({
            questions,
            step: 'interview',
            currentQuestionIndex: 0,
            answers: {},
            currentAnswer: '',
            evaluationResult: null,
            isLoading: false
        });
    } catch (error) {
        console.error('Failed to load questions:', error);
        alert('Failed to load questions. Please try again.');
        setState({ isLoading: false });
    }
}

export async function fetchCategories() {
    setState({ isLoading: true });
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        setState({ categories, step: 'topics', isLoading: false });
    } catch (error) {
        console.error('Failed to load categories:', error);
        setState({ isLoading: false });
    }
}

export async function handleFinish(finalAnswers, questionsOverride) {
    const questionsToEval = questionsOverride || state.questions;
    setState({ answers: finalAnswers, step: 'results', isEvaluating: true });
    try {
        const response = await fetch('/api/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language: state.language,
                answers: finalAnswers,
                questions: questionsToEval.map(q => {
                    let textForLang = "Question text missing";
                    if (typeof q.text === 'object') {
                        textForLang = q.text[state.language] || q.text['en'] || q.text['uz'] || Object.values(q.text)[0] || "Question text missing";
                    } else if (typeof q.text === 'string') {
                        textForLang = q.text;
                    }
                    return { id: q.id, text: textForLang };
                })
            })
        });
        if (!response.ok) throw new Error('Evaluation failed');
        const result = await response.json();
        setState({ evaluationResult: result, isEvaluating: false });
    } catch (error) {
        console.error(error);
        setState({
            evaluationResult: { level: 'Error', summary: 'Failed to evaluate. Please try again later.', feedback: [] },
            isEvaluating: false
        });
    }
}
