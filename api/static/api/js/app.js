/**
 * PyMock Interviewer - Main Application Logic
 */

// Global State
let state = {
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

// Translations
const TRANSLATIONS = {
    en: {
        title: "Master Your Next",
        highlight: "Python Backend",
        subtitle: "Interview",
        desc: "Experience a realistic technical interview. Answer challenging questions, get evaluated by our AI, and discover your true seniority level (Junior, Middle, or Senior).",
        realQuestions: "Real Questions",
        realQuestionsDesc: "Curated from actual tech company interviews.",
        textBased: "Text-Based",
        textBasedDesc: "Write your answers just like a take-home test.",
        levelAssessment: "Level Assessment",
        levelAssessmentDesc: "Get graded as Junior, Middle, or Senior.",
        start: "Start Interview",
        question: "Question",
        of: "of",
        typeAnswer: "Type your answer here... Be as detailed as possible.",
        chars: "chars",
        next: "Next Question",
        back: "Back",
        submit: "Submit Interview",
        analyzing: "Analyzing Your Responses",
        analyzingDesc: "Our AI is evaluating your technical depth, clarity, and accuracy...",
        assessedLevel: "Assessed Level",
        detailedFeedback: "Detailed Feedback",
        yourAnswer: "Your Answer",
        aiFeedback: "AI Feedback",
        noAnswer: "No answer provided.",
        tryAnother: "Try Another",
        loading: "Loading questions...",
        cancel: "Cancel Interview",
        cancelConfirm: "Are you sure you want to cancel?",
        yesCancel: "Yes, cancel",
        noKeep: "No, continue",
        cancelTitle: "Interview Cancelled",
        cancelDesc: "You stopped early, but every step is progress! Here is the feedback for the questions you did answer.",
        motivationalMessage: "Don't give up! Real interviews are tough, and practice is exactly what gets you there. Keep learning, keep coding, and try again when you're ready. You've got this! 🚀",
        assessedLevelCancel: "Current Progress Level",
        statsTotal: "Total Questions",
        statsCorrect: "Correct",
        statsWrong: "Incorrect",
        correctAnswer: "Model Answer",
        savol: "SAVOL",
        startRandom: "Random Interview",
        startTopics: "Topics",
        topicsTitle: "Technical Domains",
        topicsDesc: "Focus your interview on a specific area of expertise.",
        allCategories: "General Python",
        cat_python_core: "Python Core",
        cat_python_advanced: "Advanced Python",
        cat_async: "Async & Tasks",
        cat_database: "Databases",
        cat_django: "Django Questions",
        cat_others: "Others"
    },
    ru: {
        title: "Пройдите ваше следующее",
        highlight: "Python Backend",
        subtitle: "интервью",
        desc: "Пройдите реалистичное техническое собеседование. Отвечайте на сложные вопросы, получайте оценку от нашего ИИ и узнайте свой истинный уровень (Junior, Middle или Senior).",
        realQuestions: "Реальные вопросы",
        realQuestionsDesc: "Собраны из реальных собеседований в IT-компаниях.",
        textBased: "Текстовый формат",
        textBasedDesc: "Пишите ответы так же, как в тестовом задании.",
        levelAssessment: "Оценка уровня",
        levelAssessmentDesc: "Получите оценку Junior, Middle или Senior.",
        start: "Начать интервью",
        question: "Вопрос",
        of: "из",
        typeAnswer: "Введите ваш ответ здесь... Будьте максимально подробны.",
        chars: "симв.",
        next: "Следующий вопрос",
        back: "Назад",
        submit: "Завершить интервью",
        analyzing: "Анализ ваших ответов",
        analyzingDesc: "Наш ИИ оценивает вашу техническую глубину, ясность и точность...",
        assessedLevel: "Оцененный уровень",
        detailedFeedback: "Подробный отзыв",
        yourAnswer: "Ваш ответ",
        aiFeedback: "Отзыв ИИ",
        noAnswer: "Ответ не предоставлен.",
        tryAnother: "Попробовать еще",
        loading: "Загрузка вопросов...",
        cancel: "Отменить интервью",
        cancelConfirm: "Вы уверены, что хотите отменить?",
        yesCancel: "Да, отменить",
        noKeep: "Нет, продолжить",
        cancelTitle: "Интервью отменено",
        cancelDesc: "Вы остановились раньше времени, но любой шаг — это прогресс! Вот отзыв на ваши отвеченные вопросы.",
        motivationalMessage: "Не сдавайтесь! Настоящие собеседования сложны, и именно практика поможет вам их пройти. Продолжайте учиться, писать код и попробуйте снова, когда будете готовы. У вас все получится! 🚀",
        assessedLevelCancel: "Текущий уровень прогресса",
        statsTotal: "Всего вопросов",
        statsCorrect: "Правильно",
        statsWrong: "Неправильно",
        correctAnswer: "Правильный ответ",
        savol: "SAVOL",
        startRandom: "Случайное интервью",
        startTopics: "Темы",
        topicsTitle: "Технические области",
        topicsDesc: "Сфокусируйте ваше интервью на конкретной области знаний.",
        allCategories: "Общий Python",
        cat_python_core: "Основы Python",
        cat_python_advanced: "Продвинутый Python",
        cat_async: "Async & Задачи",
        cat_database: "Базы данных",
        cat_django: "Django вопросы",
        cat_others: "Прочее"
    },
    uz: {
        title: "Keyingi",
        highlight: "Python Backend",
        subtitle: "intervyungizdan muvaffaqiyatli o'ting",
        desc: "Haqiqiy texnik intervyuni his qiling. Qiyin savollarga javob bering, sun'iy intellekt tomonidan baholaning va haqiqiy darajangizni (Junior, Middle yoki Senior) bilib oling.",
        realQuestions: "Haqiqiy savollar",
        realQuestionsDesc: "Haqiqiy IT kompaniyalari intervyularidan olingan.",
        textBased: "Matnli format",
        textBasedDesc: "Javoblaringizni xuddi uy vazifasi kabi yozing.",
        levelAssessment: "Darajani baholash",
        levelAssessmentDesc: "Junior, Middle yoki Senior sifatida baholaning.",
        start: "Intervyuni boshlash",
        question: "Savol",
        of: "dan",
        typeAnswer: "Javobingizni shu yerga yozing... Iloji boricha batafsil bo'ling.",
        chars: "belgi",
        next: "Keyingi savol",
        back: "Ortga",
        submit: "Intervyuni yakunlash",
        analyzing: "Javoblaringiz tahlil qilinmoqda",
        analyzingDesc: "Bizning AI sizning texnik chuqurligingizni, aniqligingizni va to'g'riligingizni baholamoqda...",
        assessedLevel: "Baholangan daraja",
        detailedFeedback: "Batafsil fikr-mulohaza",
        yourAnswer: "Sizning javobingiz",
        aiFeedback: "INTERVYUER TAHLILI",
        noAnswer: "Javob berilmagan.",
        tryAnother: "Yana bir bor",
        loading: "Savollar yuklanmoqda...",
        cancel: "Intervyuni bekor qilish",
        cancelConfirm: "Intervyuni bekor qilishga ishonchingiz komilmi?",
        yesCancel: "Ha, bekor qilish",
        noKeep: "Yo'q, davom etish",
        cancelTitle: "Intervyu bekor qildi",
        cancelDesc: "Siz jarayonni erta to'xtatdingiz, ammo har bir qadam bu katta tajriba! Mana siz javob berishga ulgurgan savollar xulosasi.",
        motivationalMessage: "Taslim bo'lmang! Haqiqiy intervyular juda qiyin bo'ladi va bunday mashqlar aynan o'sha qiyinchiliklarga tayyorlaydi. O'rganishda davom eting, kod yozishdan to'xtamang. Tayyor bo'lganingizda yana urinib ko'ring. Siz buni uddalaysiz! 🚀",
        assessedLevelCancel: "Joriy natija darajasi",
        statsTotal: "Jami",
        statsCorrect: "To'g'ri",
        statsWrong: "Xato",
        correctAnswer: "IDEAL JAVOB (NAMUNA)",
        savol: "SAVOL",
        startRandom: "Tasodifiy",
        startTopics: "Mavzular",
        topicsTitle: "Texnik yo'nalishlar",
        topicsDesc: "Intervyuni aniq bir texnik yo'nalishga qarating.",
        allCategories: "Umumiy Python",
        cat_python_core: "Python asoslari",
        cat_python_advanced: "Python murakkab",
        cat_async: "Async & Masalalar",
        cat_database: "Ma'lumotlar bazasi",
        cat_django: "Django savollari",
        cat_others: "Boshqalar"
    }
};

// Utilities
const t = () => TRANSLATIONS[state.language];

function setState(newState) {
    state = { ...state, ...newState };
    render();
}

// Navigation Functions
async function handleStart(category = null) {
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

async function fetchCategories() {
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

function handleNextQuestion() {
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
}

function handlePrevQuestion() {
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
        // If at the first question, allow going back to landing or topics
        if (state.selectedCategory) {
            setState({ step: 'topics' });
        } else {
            setState({ step: 'landing' });
        }
    }
}

async function handleFinish(finalAnswers, questionsOverride) {
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

// Modal Handlers
function showCancelModal() {
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

function hideCancelModal() {
    document.getElementById('cancel-modal-content').classList.remove('scale-100', 'opacity-100');
    document.getElementById('cancel-modal-content').classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        document.getElementById('cancel-modal').classList.add('hidden');
    }, 200);
}

function handleCancel() {
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

// Rendering Logic
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
    lucide.createIcons();
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
        'python_core': 'terminal',
        'python_advanced': 'python',
        'async': 'zap',
        'database': 'database',
        'django': 'globe',
        'others': 'box'
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

function getQuestionText(q, lang) {
    let text = "Question text missing";
    if (typeof q.text === 'object') {
        text = q.text[lang] || q.text['en'] || q.text['uz'] || Object.values(q.text)[0] || "Question text missing";
    } else if (typeof q.text === 'string') {
        text = q.text;
    }
    return text;
}

function updateCharCount(val) {
    const counter = document.getElementById('char-counter');
    const nextBtn = document.getElementById('next-btn');
    if (counter) counter.innerText = val.length + ' ' + t().chars;
    if (nextBtn) nextBtn.disabled = val.trim().length === 0;
    state.currentAnswer = val; // Store silently
}

function renderInterview() {
    const q = state.questions[state.currentQuestionIndex];
    if (!q) return '';
    const progress = state.questions.length > 0 ? (state.currentQuestionIndex / state.questions.length) * 100 : 0;
    const questionText = getQuestionText(q, state.language);

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
                    <div>
                        <h2 class="text-xl font-medium text-slate-100 leading-relaxed">
                            ${questionText}
                        </h2>
                    </div>
                </div>

                <div class="relative">
                    <textarea
                        id="answer-textarea"
                        oninput="updateCharCount(this.value)"
                        class="w-full h-64 bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 resize-none font-mono text-sm leading-relaxed transition-all"
                        placeholder="${t().typeAnswer}"
                    >${state.currentAnswer}</textarea>
                    <div id="char-counter" class="absolute bottom-6 right-6 text-xs text-slate-500 font-mono bg-slate-950/80 px-2 py-1 rounded-md">
                        ${state.currentAnswer.length} ${t().chars}
                    </div>
                </div>
            </div>

            <div class="flex justify-between items-center px-2">
                <button onclick="handlePrevQuestion()" class="inline-flex items-center gap-2 text-slate-400 hover:text-white px-5 py-3 rounded-xl font-medium transition-colors hover:bg-slate-800">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i> ${t().back}
                </button>

                <button id="next-btn" onclick="handleNextQuestion()" ${state.currentAnswer.trim().length === 0 ? 'disabled' : ''} class="inline-flex items-center gap-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/10">
                    ${state.currentQuestionIndex === state.questions.length - 1 ? t().submit : t().next} <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
            </div>
        </div>
    `;
}

function renderResults() {
    if (state.isEvaluating) {
        return `
            <div class="max-w-3xl mx-auto flex flex-col items-center justify-center py-24 text-center fade-in">
                <div class="loader mb-8"></div>
                <h2 class="text-2xl font-semibold text-white mb-2">${t().analyzing}</h2>
                <p class="text-slate-400">${t().analyzingDesc}</p>
            </div>
        `;
    }

    const { level, summary, feedback } = state.evaluationResult || {};
    const isCancelled = state.isCancelledProgress;

    const feedbackHtml = state.questions.map((q, i) => {
        const item = (feedback || []).find(f => f.questionId == q.id);
        const questionText = getQuestionText(q, state.language);
        const hasAnswer = state.answers[q.id] && state.answers[q.id].trim().length > 0;
        const isCorrect = item ? (item.isCorrect === true || item.isCorrect === 'true') : null;

        return `
            <div class="bg-slate-900 border ${isCorrect === true ? 'border-emerald-800/40' : isCorrect === false ? 'border-red-900/40' : 'border-slate-800'} rounded-3xl p-8 transition-all hover:bg-slate-900/80">
                <div class="flex items-center justify-between mb-6">
                    <div class="inline-flex items-center gap-2 bg-slate-800/50 text-slate-400 rounded-xl px-4 py-1.5 text-xs font-bold border border-slate-700/50 uppercase tracking-widest">
                        <span>${t().savol} ${i + 1}</span>
                    </div>
                    ${isCorrect === true ? '<span class="shrink-0 inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5"><i data-lucide="check-circle" class="w-4 h-4"></i> OK</span>' : isCorrect === false ? '<span class="shrink-0 inline-flex items-center gap-2 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5"><i data-lucide="alert-circle" class="w-4 h-4"></i> Xato</span>' : ''}
                </div>

                <div class="space-y-6">
                    <h4 class="text-slate-100 text-lg font-medium leading-relaxed">${questionText}</h4>
                    
                    <div class="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/50">
                        <div class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">${t().yourAnswer}</div>
                        <p class="text-slate-400 text-sm font-mono leading-relaxed whitespace-pre-wrap">
                            ${state.answers[q.id] || t().noAnswer}
                        </p>
                    </div>
                    
                    ${item && hasAnswer ? `
                    <div class="grid sm:grid-cols-2 gap-5">
                        <div class="bg-emerald-500/5 rounded-2xl p-5 border border-emerald-500/10">
                            <div class="flex items-center gap-2 text-[10px] text-emerald-400 uppercase tracking-widest font-bold mb-3">
                                <i data-lucide="message-square" class="w-3.5 h-3.5"></i> ${t().aiFeedback}
                            </div>
                            <p class="text-slate-300 text-sm leading-relaxed">${item.aiFeedback}</p>
                        </div>
                        
                        <div class="bg-blue-500/5 rounded-2xl p-5 border border-blue-500/10">
                            <div class="flex items-center gap-2 text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-3">
                                <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i> ${t().correctAnswer}
                            </div>
                            <p class="text-slate-300 text-sm leading-relaxed">${item.correctAnswer || '---'}</p>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    const totalCount = state.questions.length;
    const correctCount = (feedback || []).filter(f => f.isCorrect === true).length;
    const wrongCount = (feedback || []).filter(f => f.isCorrect === false).length;
    const correctPercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    const statsCard = `
        <div class="grid grid-cols-3 gap-4">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center glass">
                <div class="text-3xl font-bold text-white mb-1">${totalCount}</div>
                <div class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">${t().statsTotal}</div>
            </div>
            <div class="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center">
                <div class="text-3xl font-bold text-emerald-400 mb-1">${correctCount}</div>
                <div class="text-[10px] text-emerald-500/60 uppercase tracking-widest font-bold">${t().statsCorrect}</div>
            </div>
            <div class="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 text-center">
                <div class="text-3xl font-bold text-red-400 mb-1">${wrongCount}</div>
                <div class="text-[10px] text-red-500/60 uppercase tracking-widest font-bold">${t().statsWrong}</div>
            </div>
        </div>
        <div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div class="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000 rounded-full" style="width: ${correctPercent}%"></div>
        </div>
    `;

    const levelHeader = isCancelled ? `
        <div class="bg-gradient-to-br from-amber-950/30 to-slate-950 border border-amber-500/20 rounded-3xl p-10 text-center relative overflow-hidden glass">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-amber-500/5 blur-[80px] rounded-full pointer-events-none"></div>
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6 relative z-10">
                <i data-lucide="alert-triangle" class="w-8 h-8 text-amber-500"></i>
            </div>
            <h2 class="text-slate-400 font-medium mb-1 relative z-10 text-sm uppercase tracking-widest">${t().assessedLevelCancel}</h2>
            <div class="text-6xl font-bold text-white mb-6 relative z-10 tracking-tighter">${level || '—'}</div>
            <p class="text-slate-300 max-w-xl mx-auto leading-relaxed relative z-10 mb-6">${summary || ''}</p>
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold relative z-10">
                <i data-lucide="info" class="w-3.5 h-3.5"></i> ${t().cancelTitle}
            </div>
        </div>
    ` : `
        <div class="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-12 text-center relative overflow-hidden glass">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none"></div>
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6 relative z-10">
                <i data-lucide="award" class="w-10 h-10 text-emerald-400"></i>
            </div>
            <h2 class="text-slate-400 font-medium mb-1 relative z-10 text-sm uppercase tracking-widest">${t().assessedLevel}</h2>
            <div class="text-7xl font-bold text-white mb-6 relative z-10 tracking-tighter">${level || 'N/A'}</div>
            <p class="text-slate-300 text-lg max-w-xl mx-auto leading-relaxed relative z-10">${summary || ''}</p>
        </div>
    `;

    return `
        <div class="max-w-3xl mx-auto space-y-10 fade-in">
            ${levelHeader}
            ${statsCard}
            ${isCancelled ? `
                <div class="bg-slate-900/50 border border-amber-500/10 rounded-2xl p-6 flex items-start gap-4">
                    <i data-lucide="sparkles" class="w-5 h-5 text-amber-500 shrink-0 mt-1"></i>
                    <p class="text-slate-400 leading-relaxed text-sm italic">${t().motivationalMessage}</p>
                </div>
            ` : ''}
            <div class="space-y-6">
                <h3 class="text-2xl font-bold text-white tracking-tight">${t().detailedFeedback}</h3>
                <div class="space-y-6">
                    ${feedbackHtml}
                </div>
            </div>
            <div class="flex justify-center pt-8">
                <button onclick="setState({step: 'landing', isCancelledProgress: false, questions: [], answers: {}, evaluationResult: null})" class="group inline-flex items-center gap-3 bg-white text-slate-950 px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl">
                    <i data-lucide="rotate-ccw" class="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"></i> ${t().tryAnother}
                </button>
            </div>
        </div>
    `;
}

function render() {
    renderHeaderRight();
    const content = document.getElementById('app-content');
    if (state.step === 'landing') content.innerHTML = renderLanding();
    else if (state.step === 'topics') content.innerHTML = renderTopics();
    else if (state.step === 'interview') content.innerHTML = renderInterview();
    else if (state.step === 'results') content.innerHTML = renderResults();

    lucide.createIcons();
    window.scrollTo(0, 0);
}

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    render();
});
