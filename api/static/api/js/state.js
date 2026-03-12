/**
 * PyMock Interviewer - State Management
 */
import { render } from './ui.js';

export let state = {
    step: 'landing',
    language: 'uz',
    questions: [],
    categories: [],
    selectedCategory: null,
    currentQuestionIndex: 0,
    answers: {},
    currentAnswer: '',
    isEvaluating: false,
    isLoading: false,
    evaluationResult: null,
    isCancelledProgress: false
};

export function setState(newState) {
    state = { ...state, ...newState };
    render();
}
