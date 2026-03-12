/**
 * PyMock Interviewer - UI & Rendering Logic
 */
import { state, setState } from './state.js';
import { TRANSLATIONS } from './translations.js';
import { handleStart, fetchCategories, handleFinish } from './api.js';

const t = () => TRANSLATIONS[state.language];

// Modal Handlers
export function showCancelModal() {
    const modal = document.getElementById('cancel-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('cancel-modal-content').classList.remove('scale-95', 'opacity-0');
        document.getElementById('cancel-modal-content').classList.add('scale-100', 'opacity-100');
    }, 10);
    document.getElementById('lang-cancelConfirm').innerText = t().cancelConfirm;
    document.getElementById('lang-noKeep').innerText = t().noKeep;
    document.getElementById('lang-yesCancel').innerText = t().yesCancel;
}

export function hideCancelModal() {
    document.getElementById('cancel-modal-content').classList.remove('scale-100', 'opacity-100');
    document.getElementById('cancel-modal-content').classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        document.getElementById('cancel-modal').classList.add('hidden');
    }, 200);
}

export function handleCancel() {
    hideCancelModal();
    const textarea = document.getElementById('answer-textarea');
    const currentVal = textarea ? textarea.value : state.currentAnswer;

    let currentAnswersContext = { ...state.answers };
    if (currentVal && currentVal.trim() !== '') {
        const currentQuestionId = state.questions[state.currentQuestionIndex].id;
        currentAnswersContext[currentQuestionId] = currentVal;
    }

    if (Object.keys(currentAnswersContext).length === 0) {
        setState({
            step: 'landing',
            currentQuestionIndex: 0,
            answers: {},
            currentAnswer: '',
            evaluationResult: null,
            isCancelledProgress: false
        });
        return;
    }

    const answeredQuestions = state.questions.slice(0, Math.max(Object.keys(currentAnswersContext).length, state.currentQuestionIndex + 1));
    setState({
        questions: answeredQuestions,
        answers: currentAnswersContext,
        step: 'results',
        isEvaluating: true,
        isCancelledProgress: true
    });
    handleFinish(currentAnswersContext, answeredQuestions);
}

// Global functions for events
window.handleStart = handleStart;
window.fetchCategories = fetchCategories;
window.showCancelModal = showCancelModal;
window.hideCancelModal = hideCancelModal;
window.handleCancel = handleCancel;
window.setState = setState;

// Rendering Components
function renderHeaderRight() {
    const headerRight = document.getElementById('header-right');
    if (state.step === 'landing') {
        headerRight.innerHTML = `
            <div class="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1 glass">
                <i data-lucide="globe" class="w-4 h-4 text-slate-400 ml-2"></i>
                <select id="lang-select" onchange="setState({language: this.value})" class="bg-transparent text-sm font-medium text-slate-300 focus:outline-none py-1 pr-2 cursor-pointer">
                    <option value="uz" ${state.language === 'uz' ? 'selected' : ''}>O'zbekcha</option>
                    <option value="en" ${state.language === 'en' ? 'selected' : ''}>English</option>
                    <option value="ru" ${state.language === 'ru' ? 'selected' : ''}>Русский</option>
                </select>
            </div>
        `;
    } else if (state.step === 'interview' && state.questions.length > 0) {
        headerRight.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="text-sm font-medium text-slate-400">
                    ${t().question} ${state.currentQuestionIndex + 1} ${t().of} ${state.questions.length}
                </div>
                <button onclick="showCancelModal()" class="text-sm font-medium text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition-colors">
                    ${t().cancel}
                </button>
            </div>
        `;
    } else {
        headerRight.innerHTML = '';
    }
}

function renderLanding() {
    return `
        <div class="max-w-2xl mx-auto text-center mt-12 fade-in">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
                <i data-lucide="brain-circuit" class="w-4 h-4"></i>
                <span>Professional AI Mock Interview</span>
            </div>
            <h1 class="text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                ${t().title} <br />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  ${t().highlight}
                </span> ${t().subtitle}
            </h1>
            <p class="text-lg text-slate-400 mb-10 leading-relaxed">${t().desc}</p>
            
            <div class="grid sm:grid-cols-3 gap-4 mb-12 text-left">
                <div class="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 hover-card">
                    <i data-lucide="code-2" class="w-6 h-6 text-emerald-400 mb-3"></i>
                    <h3 class="font-medium text-slate-200 mb-1">${t().realQuestions}</h3>
                    <p class="text-sm text-slate-500">${t().realQuestionsDesc}</p>
                </div>
                <div class="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 hover-card">
                    <i data-lucide="terminal" class="w-6 h-6 text-cyan-400 mb-3"></i>
                    <h3 class="font-medium text-slate-200 mb-1">${t().textBased}</h3>
                    <p class="text-sm text-slate-500">${t().textBasedDesc}</p>
                </div>
                <div class="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 hover-card">
                    <i data-lucide="award" class="w-6 h-6 text-indigo-400 mb-3"></i>
                    <h3 class="font-medium text-slate-200 mb-1">${t().levelAssessment}</h3>
                    <p class="text-sm text-slate-500">${t().levelAssessmentDesc}</p>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button onclick="handleStart()" ${state.isLoading ? 'disabled' : ''} class="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-10 py-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20 disabled:opacity-70">
                    ${state.isLoading ? '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i>' : '<i data-lucide="shuffle" class="w-5 h-5"></i>'}
                    ${t().startRandom}
                </button>
                <button onclick="fetchCategories()" ${state.isLoading ? 'disabled' : ''} class="inline-flex items-center gap-3 bg-slate-800 hover:bg-slate-700 text-white px-10 py-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] border border-slate-700 disabled:opacity-70">
                    <i data-lucide="layout-grid" class="w-5 h-5 text-emerald-400"></i>
                    ${t().startTopics}
                </button>
            </div>
        </div>
    `;
}

function renderTopics() {
    const icons = {
        'python_core': 'terminal', 'python_advanced': 'python', 'async': 'zap',
        'database': 'database', 'django': 'globe', 'others': 'box'
    };
    const colors = {
        'python_core': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        'python_advanced': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        'async': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        'database': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        'django': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        'others': 'text-slate-400 bg-slate-500/10 border-slate-500/20'
    };

    return `
        <div class="max-w-4xl mx-auto fade-in">
            <div class="flex items-center justify-between mb-12">
                <div>
                    <h2 class="text-3xl font-bold text-white mb-2">${t().topicsTitle}</h2>
                    <p class="text-slate-400">${t().topicsDesc}</p>
                </div>
                <button onclick="setState({step: 'landing'})" class="p-3 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors border border-transparent hover:border-slate-700">
                    <i data-lucide="arrow-left" class="w-6 h-6"></i>
                </button>
            </div>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${state.categories.map(c => `
                    <button onclick="handleStart('${c.category}')" class="group relative flex flex-col p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all hover:shadow-2xl hover:shadow-emerald-500/5 text-left hover-card">
                        <div class="w-12 h-12 rounded-xl mb-4 flex items-center justify-center border ${colors[c.category] || colors['others']}">
                            <i data-lucide="${icons[c.category] || 'box'}" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                            ${t()['cat_' + c.category] || c.category}
                        </h3>
                        <div class="flex items-center gap-2 text-sm text-slate-500">
                            <i data-lucide="layers" class="w-4 h-4"></i>
                            <span>${c.count} ${t().savol}</span>
                        </div>
                        <div class="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <i data-lucide="arrow-right" class="w-5 h-5 text-emerald-500"></i>
                        </div>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function renderInterview() {
    const q = state.questions[state.currentQuestionIndex];
    if (!q) return '';
    const progress = (state.currentQuestionIndex / state.questions.length) * 100;

    let questionText = "Question text missing";
    if (typeof q.text === 'object') {
        questionText = q.text[state.language] || q.text['en'] || q.text['uz'] || Object.values(q.text)[0];
    } else {
        questionText = q.text;
    }

    return `
        <div class="max-w-3xl mx-auto fade-in">
            <div class="w-full h-1 bg-slate-800 rounded-full mb-12 overflow-hidden">
                <div class="h-full bg-emerald-500 transition-all duration-500" style="width: ${progress}%"></div>
            </div>
            <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl mb-6 glass">
                <div class="flex items-start gap-4 mb-6">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <i data-lucide="brain-circuit" class="w-5 h-5 text-emerald-400"></i>
                    </div>
                    <div><h2 class="text-xl font-medium text-slate-100 leading-relaxed">${questionText}</h2></div>
                </div>
                <div class="relative">
                    <textarea id="answer-textarea" oninput="updateCharCount(this.value)" class="w-full h-64 bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 resize-none font-mono text-sm leading-relaxed transition-all" placeholder="${t().typeAnswer}">${state.currentAnswer}</textarea>
                    <div id="char-counter" class="absolute bottom-6 right-6 text-xs text-slate-500 font-mono bg-slate-950/80 px-2 py-1 rounded-md">${state.currentAnswer.length} ${t().chars}</div>
                </div>
            </div>
            <div class="flex justify-between items-center px-2">
                <button onclick="handlePrevQuestion()" class="inline-flex items-center gap-2 text-slate-400 hover:text-white px-5 py-3 rounded-xl font-medium transition-colors hover:bg-slate-800"><i data-lucide="arrow-left" class="w-4 h-4"></i> ${t().back}</button>
                <button id="next-btn" onclick="handleNextQuestion()" ${state.currentAnswer.trim().length === 0 ? 'disabled' : ''} class="inline-flex items-center gap-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/10">${state.currentQuestionIndex === state.questions.length - 1 ? t().submit : t().next} <i data-lucide="arrow-right" class="w-4 h-4"></i></button>
            </div>
        </div>
    `;
}

function renderResults() {
    if (state.isEvaluating) {
        return `<div class="max-w-3xl mx-auto flex flex-col items-center justify-center py-24 text-center fade-in"><div class="loader mb-8"></div><h2 class="text-2xl font-semibold text-white mb-2">${t().analyzing}</h2><p class="text-slate-400">${t().analyzingDesc}</p></div>`;
    }
    const { level, summary, feedback } = state.evaluationResult || {};
    const isCancelled = state.isCancelledProgress;
    const correctCount = (feedback || []).filter(f => f.isCorrect === true).length;
    const wrongCount = (feedback || []).filter(f => f.isCorrect === false).length;
    const correctPercent = state.questions.length > 0 ? Math.round((correctCount / state.questions.length) * 100) : 0;

    return `
        <div class="max-w-3xl mx-auto space-y-10 fade-in">
            <div class="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-12 text-center relative overflow-hidden glass">
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none"></div>
                <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6 relative z-10"><i data-lucide="award" class="w-10 h-10 text-emerald-400"></i></div>
                <h2 class="text-slate-400 font-medium mb-1 relative z-10 text-sm uppercase tracking-widest">${isCancelled ? t().assessedLevelCancel : t().assessedLevel}</h2>
                <div class="text-7xl font-bold text-white mb-6 relative z-10 tracking-tighter">${level || 'N/A'}</div>
                <p class="text-slate-300 text-lg max-w-xl mx-auto leading-relaxed relative z-10">${summary || ''}</p>
            </div>
            <div class="grid grid-cols-3 gap-4">
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center glass"><div class="text-3xl font-bold text-white mb-1">${state.questions.length}</div><div class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">${t().statsTotal}</div></div>
                <div class="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center"><div class="text-3xl font-bold text-emerald-400 mb-1">${correctCount}</div><div class="text-[10px] text-emerald-500/60 uppercase tracking-widest font-bold">${t().statsCorrect}</div></div>
                <div class="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 text-center"><div class="text-3xl font-bold text-red-400 mb-1">${wrongCount}</div><div class="text-[10px] text-red-500/60 uppercase tracking-widest font-bold">${t().statsWrong}</div></div>
            </div>
            <div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800"><div class="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000 rounded-full" style="width: ${correctPercent}%"></div></div>
            <div class="space-y-6">
                <h3 class="text-2xl font-bold text-white tracking-tight">${t().detailedFeedback}</h3>
                ${state.questions.map((q, i) => {
        const item = (feedback || []).find(f => f.questionId == q.id);
        const isCorrect = item ? (item.isCorrect === true || item.isCorrect === 'true') : null;
        let qText = typeof q.text === 'object' ? (q.text[state.language] || Object.values(q.text)[0]) : q.text;
        return `
                        <div class="bg-slate-900 border ${isCorrect === true ? 'border-emerald-800/40' : 'border-slate-800'} rounded-3xl p-8">
                            <div class="flex items-center justify-between mb-6">
                                <div class="inline-flex items-center gap-2 bg-slate-800/50 text-slate-400 rounded-xl px-4 py-1.5 text-xs font-bold border border-slate-700/50 uppercase tracking-widest"><span>${t().savol} ${i + 1}</span></div>
                                ${isCorrect === true ? '<span class="text-emerald-400 font-bold text-xs"><i data-lucide="check-circle" class="mr-1"></i> OK</span>' : ''}
                            </div>
                            <h4 class="text-slate-100 text-lg mb-6">${qText}</h4>
                            <div class="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/50 mb-4"><div class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">${t().yourAnswer}</div><p class="text-slate-400 text-sm">${state.answers[q.id] || t().noAnswer}</p></div>
                            ${item ? `<div class="grid sm:grid-cols-2 gap-4"><div class="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10"><div class="text-[10px] text-emerald-400 uppercase tracking-widest font-bold mb-2">${t().aiFeedback}</div><p class="text-slate-300 text-sm">${item.aiFeedback}</p></div><div class="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10"><div class="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-2">${t().correctAnswer}</div><p class="text-slate-300 text-sm">${item.correctAnswer || '---'}</p></div></div>` : ''}
                        </div>`;
    }).join('')}
            </div>
            <div class="flex justify-center"><button onclick="setState({step: 'landing', isCancelledProgress: false, questions: [], answers: {}, evaluationResult: null})" class="group inline-flex items-center gap-3 bg-white text-slate-950 px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-xl"><i data-lucide="rotate-ccw" class="w-5 h-5"></i> ${t().tryAnother}</button></div>
        </div>
    `;
}

export function render() {
    renderHeaderRight();
    const content = document.getElementById('app-content');
    if (state.step === 'landing') content.innerHTML = renderLanding();
    else if (state.step === 'topics') content.innerHTML = renderTopics();
    else if (state.step === 'interview') content.innerHTML = renderInterview();
    else if (state.step === 'results') content.innerHTML = renderResults();
    lucide.createIcons();
    window.scrollTo(0, 0);
}

// Global UI helpers
window.updateCharCount = (val) => {
    state.currentAnswer = val;
    const counter = document.getElementById('char-counter');
    const nextBtn = document.getElementById('next-btn');
    if (counter) counter.innerText = val.length + ' ' + t().chars;
    if (nextBtn) nextBtn.disabled = val.trim().length === 0;
};

window.handleNextQuestion = () => {
    const textarea = document.getElementById('answer-textarea');
    const currentVal = textarea ? textarea.value : state.currentAnswer;
    const newAnswers = { ...state.answers, [state.questions[state.currentQuestionIndex].id]: currentVal };
    if (state.currentQuestionIndex < state.questions.length - 1) {
        setState({
            answers: newAnswers,
            currentQuestionIndex: state.currentQuestionIndex + 1,
            currentAnswer: newAnswers[state.questions[state.currentQuestionIndex + 1].id] || ''
        });
    } else {
        handleFinish(newAnswers);
    }
};

window.handlePrevQuestion = () => {
    if (state.currentQuestionIndex > 0) {
        const textarea = document.getElementById('answer-textarea');
        const currentVal = textarea ? textarea.value : state.currentAnswer;
        const newAnswers = { ...state.answers, [state.questions[state.currentQuestionIndex].id]: currentVal };
        setState({
            answers: newAnswers,
            currentQuestionIndex: state.currentQuestionIndex - 1,
            currentAnswer: newAnswers[state.questions[state.currentQuestionIndex - 1].id] || ''
        });
    } else {
        setState({ step: state.selectedCategory ? 'topics' : 'landing' });
    }
};
