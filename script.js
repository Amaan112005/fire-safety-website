// Interactive Exit Planner functionality
function selectRoom(roomType) {
    const routeDisplay = document.getElementById('route-display');
    const routes = {
        office: "From Office: Exit through main door → Turn left → Main Exit (20 seconds)",
        conference: "From Conference: Exit through side door → Straight ahead → Emergency Exit (15 seconds)",
        hallway: "From Hallway: Turn right → Main Exit (10 seconds)",
        kitchen: "From Kitchen: Exit through back door → Turn left → Emergency Exit (25 seconds)",
        restroom: "From Restroom: Exit through door → Turn right → Main Exit (18 seconds)"
    };

    routeDisplay.innerHTML = `<p>${routes[roomType]}</p>`;
}

let currentSection = 'intro';
let currentQuestion = 0;
let score = 0;
let timer;
let highContrastEnabled = false;

const questions = [
    { id: 'q1', correct: 'stop' },
    { id: 'q2', correct: 'monthly' },
    { id: 'q3', correct: 'co2' },
    { id: 'q4', correct: 'false' },
    { id: 'q5', correct: 'alert' }
];

const tipDetails = {
    1: { title: "Know Your Escape Routes", content: "Plan multiple escape routes from your home. Practice them regularly with your family. Never use elevators during a fire." },
    2: { title: "Test Smoke Alarms Monthly", content: "Change batteries twice a year and test alarms monthly. Smoke alarms can alert you to a fire before you see or smell it." },
    3: { title: "Have a Fire Extinguisher Ready", content: "Keep fire extinguishers in key locations. Learn how to use them and check them regularly." },
    4: { title: "Never Leave Cooking Unattended", content: "Stay in the kitchen when cooking. Keep flammable items away from heat sources." }
};

const avatarMessages = [
    "Welcome to fire safety training! Let's learn some important tips together.",
    "Fire safety is crucial for protecting yourself and your loved ones.",
    "Remember, prevention is always better than cure when it comes to fires.",
    "Great job learning these safety tips! Now let's test your knowledge."
];

let messageIndex = 0;

function nextSection(sectionId) {
    document.getElementById(currentSection).classList.remove('active');
    document.getElementById(sectionId).classList.add('active');
    currentSection = sectionId;
    updateProgress();
    updateNavIcons();

    if (sectionId === 'quiz') {
        // Don't auto-start quiz, let user click the start button
    } else if (sectionId === 'certificate') {
        showCertificate();
        confetti();
    }
}

function jumpToSection(sectionId) {
    if (sectionId === 'certificate' && !hasPassedQuiz()) {
        alert('Complete the quiz first to access your certificate!');
        return;
    }
    nextSection(sectionId);
}

function updateProgress() {
    const sections = ['intro', 'instructions', 'quiz', 'certificate'];
    const currentIndex = sections.indexOf(currentSection);
    const progress = ((currentIndex + 1) / sections.length) * 100;
    document.getElementById('progress').style.width = progress + '%';
}

function updateNavIcons() {
    const icons = document.querySelectorAll('.nav-icons i');
    icons.forEach(icon => icon.classList.remove('active'));
    document.getElementById('nav-' + currentSection).classList.add('active');
}

function showTipDetail(tipId) {
    const modal = document.getElementById('tipModal');
    const title = document.getElementById('tipTitle');
    const content = document.getElementById('tipContent');

    title.textContent = tipDetails[tipId].title;
    content.textContent = tipDetails[tipId].content;

    modal.style.display = 'block';

    // Change avatar message when tip is clicked
    changeAvatarMessage();
}

function changeAvatarMessage() {
    messageIndex = (messageIndex + 1) % avatarMessages.length;
    const speechText = document.getElementById('speech-text');
    speechText.classList.remove('animate__fadeIn');
    setTimeout(() => {
        speechText.textContent = avatarMessages[messageIndex];
        speechText.classList.add('animate__fadeIn');
    }, 100);
}

function selectScenario(scenario) {
    const cards = document.querySelectorAll('.scenario-card');
    cards.forEach(card => card.classList.remove('selected'));
    event.target.closest('.scenario-card').classList.add('selected');

    // Change avatar message based on scenario
    const scenarioMessages = {
        home: "Great choice! Home fires are the most common. Let's focus on kitchen and living room safety.",
        office: "Office fires require quick evacuation. We'll cover emergency procedures for workplaces.",
        outdoor: "Outdoor fires can be unpredictable. Let's learn about camping and wildfire safety."
    };

    const speechText = document.getElementById('speech-text');
    speechText.classList.remove('animate__fadeIn');
    setTimeout(() => {
        speechText.textContent = scenarioMessages[scenario];
        speechText.classList.add('animate__fadeIn');
    }, 100);
}

function showStep(stepNumber) {
    // Update step active state
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => step.classList.remove('active'));
    document.getElementById('step' + stepNumber).classList.add('active');

    // Show corresponding content
    const contents = document.querySelectorAll('.content-section');
    contents.forEach(content => content.classList.remove('active'));
    document.getElementById('content' + stepNumber).classList.add('active');

    // Show video badge for current step
    const badges = document.querySelectorAll('.step-badge');
    badges.forEach(badge => badge.style.display = 'none');
    document.getElementById('badge' + stepNumber).style.display = 'block';

    // Update avatar message based on step
    const stepMessages = {
        1: "Perfect! Let's start with understanding all the safety signs you'll encounter. These signs are designed to guide you to safety. Watch the video and try the interactive quiz at the bottom!",
        2: "Now let's learn about fire extinguishers. They're your first line of defense against small fires. Remember: PASS - Pull, Aim, Squeeze, Sweep! Check out the video demonstration!",
        3: "Finding exits quickly can save lives. Let's explore how to locate and use emergency exits. Always know two ways out of any room! The video shows real examples!",
        4: "Emergency procedures are crucial. Knowing what to do when fire breaks out can make all the difference. Stay calm and act quickly! Watch the procedure video!",
        5: "Prevention is the best protection. Let's learn how to prevent fires and stay prepared. An ounce of prevention is worth a pound of cure! The video has great tips!"
    };

    const speechText = document.getElementById('speech-text');
    speechText.classList.remove('animate__fadeIn');
    setTimeout(() => {
        speechText.textContent = stepMessages[stepNumber];
        speechText.classList.add('animate__fadeIn');
    }, 100);

    // Scroll content to top
    const instructionContent = document.getElementById('instruction-content');
    instructionContent.scrollTop = 0;
}

function checkSignAnswer(scenario, answer) {
    const feedbackId = `scenario${scenario}-feedback`;
    const feedback = document.getElementById(feedbackId);
    const options = document.querySelectorAll(`#scenario${scenario} .sign-option`);

    // Reset all options
    options.forEach(option => {
        option.classList.remove('correct', 'incorrect');
    });

    // Check answer
    const correctAnswers = {
        1: 'exit',
        2: 'extinguisher'
    };

    const isCorrect = answer === correctAnswers[scenario];

    // Highlight selected option
    event.target.classList.add(isCorrect ? 'correct' : 'incorrect');

    // Show feedback
    feedback.textContent = isCorrect ?
        "Correct! Well done!" :
        `Incorrect. The correct answer is the ${correctAnswers[scenario] === 'exit' ? 'Exit sign' : 'Fire Extinguisher sign'}.`;
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
}

function checkExtinguisherMatch(fireType, extinguisherClass) {
    const feedback = document.getElementById('extinguisher-feedback');
    const options = document.querySelectorAll('.choice-option');

    // Reset all options
    options.forEach(option => {
        option.classList.remove('correct', 'incorrect');
    });

    // Check answer
    const correctMatches = {
        electrical: 'C',
        grease: 'K',
        paper: 'A'
    };

    const isCorrect = extinguisherClass === correctMatches[fireType];

    // Highlight selected option
    event.target.classList.add(isCorrect ? 'correct' : 'incorrect');

    // Show feedback
    feedback.textContent = isCorrect ?
        "Perfect match! Great job!" :
        `Not quite. ${fireType === 'electrical' ? 'Electrical fires need Class C extinguishers' :
                     fireType === 'grease' ? 'Grease fires need Class K extinguishers' :
                     'Paper fires need Class A extinguishers'}.`;
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
}

function closeModal() {
    document.getElementById('tipModal').style.display = 'none';
}

// Enhanced Quiz System
let currentQuestionIndex = 0;
let quizScore = 0;
let totalPoints = 0;
let quizTimer;
let timeLeft = 600;
let hintsUsed = 0;
let questionsAnswered = [];
let questionStartTime = 0;

const enhancedQuestions = [
    {
        id: 'q1',
        type: 'multiple-choice',
        points: 10,
        question: "What should you do if your clothes catch fire?",
        scenario: "You're in the kitchen cooking when your sleeve brushes against the stove flame.",
        options: [
            { text: "Run outside", correct: false },
            { text: "Stop, Drop, and Roll", correct: true },
            { text: "Fan the flames with your hands", correct: false }
        ],
        hint: "Remember the fire safety acronym: Stop, Drop, and Roll stops the fire from spreading.",
        explanation: "Stop, Drop, and Roll works by smothering the flames and protecting your face from heat and smoke."
    },
    {
        id: 'q2',
        type: 'scenario-image',
        points: 15,
        question: "In this office fire scenario, what should you do first?",
        scenario: "You smell smoke and see flames coming from a wastebasket in the corner.",
        image: "https://via.placeholder.com/400x200/ff6b6b/ffffff?text=Office+Fire+Scenario",
        options: [
            { text: "Try to put out the fire yourself", correct: false },
            { text: "Alert others and evacuate", correct: true },
            { text: "Gather your belongings first", correct: false }
        ],
        hint: "RACE: Rescue, Alarm, Contain, Extinguish - but only if safe!",
        explanation: "Alerting others ensures everyone gets out safely. Small fires can be contained, but never risk your life."
    },
    {
        id: 'q3',
        type: 'drag-drop',
        points: 20,
        question: "Match each fire type with the correct extinguisher class:",
        dragItems: [
            { id: 'electrical', text: '🔌 Electrical fire in an outlet' },
            { id: 'grease', text: '🍳 Grease fire in a kitchen' },
            { id: 'paper', text: '📄 Paper fire in an office' }
        ],
        dropZones: [
            { id: 'C', label: 'Class C (Electrical)', correct: 'electrical' },
            { id: 'K', label: 'Class K (Kitchen)', correct: 'grease' },
            { id: 'A', label: 'Class A (Ordinary)', correct: 'paper' }
        ],
        hint: "Remember: C for Current (electrical), K for Kitchen (cooking oils), A for All others.",
        explanation: "Using the wrong extinguisher can be dangerous - water on electrical fires causes electrocution!"
    },
    {
        id: 'q4',
        type: 'hotspot',
        points: 25,
        question: "Click on all the fire extinguishers in this building hallway:",
        image: "https://picsum.photos/500/300?random=hallway",
        hotspots: [
            { x: 15, y: 60, correct: true, label: '1' },
            { x: 85, y: 40, correct: true, label: '2' },
            { x: 50, y: 80, correct: false, label: 'X' }
        ],
        hint: "Look for red cylinders mounted on walls, usually near exits or high-risk areas.",
        explanation: "Fire extinguishers should be visible, accessible, and located throughout buildings for quick access."
    },
    {
        id: 'q5',
        type: 'multiple-choice',
        points: 10,
        question: "How often should you test smoke alarms?",
        options: [
            { text: "Weekly", correct: false },
            { text: "Monthly", correct: true },
            { text: "Yearly", correct: false }
        ],
        hint: "Test monthly, change batteries twice yearly, replace every 10 years.",
        explanation: "Monthly testing ensures the alarm works. Battery changes prevent failure during emergencies."
    }
];

function startQuiz() {
    // Hide intro and show quiz interface
    const quizIntro = document.querySelector('.quiz-intro');
    const quizContainer = document.querySelector('.quiz-container');
    const quizActions = document.querySelector('.quiz-actions');

    if (quizIntro) quizIntro.style.display = 'none';
    if (quizContainer) quizContainer.style.display = 'block';
    if (quizActions) quizActions.style.display = 'flex';

    currentQuestionIndex = 0;
    quizScore = 0;
    totalPoints = enhancedQuestions.reduce((sum, q) => sum + q.points, 0);
    timeLeft = 600;
    hintsUsed = 0;
    questionsAnswered = [];
    showEnhancedQuestion(0);
    startQuizTimer();
    updateQuizProgress();
}

function showEnhancedQuestion(index) {
    const question = enhancedQuestions[index];
    questionStartTime = Date.now();

    // Hide all questions
    const questionCards = document.querySelectorAll('.question-card');
    if (questionCards) {
        questionCards.forEach(card => {
            card.classList.remove('active', 'correct', 'incorrect');
        });
    }

    // Show current question
    let questionCard = document.getElementById(question.id);
    if (!questionCard) {
        createQuestionCard(question);
        questionCard = document.getElementById(question.id);
    }
    if (questionCard) {
        questionCard.classList.add('active');
    }

    updateQuizProgress();
}

function createQuestionCard(question) {
    const quizContainer = document.querySelector('.quiz-container') || document.getElementById('quiz').querySelector('.content');
    let cardHTML = `
        <div class="question-card" id="${question.id}">
            <div class="question-header">
                <span class="question-number">Question ${currentQuestionIndex + 1}</span>
                <span class="question-points">${question.points} points</span>
            </div>
            <div class="question-content">
                <h3>${question.question}</h3>`;

    if (question.scenario) {
        cardHTML += `<div class="question-scenario">${question.scenario}</div>`;
    }

    if (question.image) {
        cardHTML += `<div class="scenario-image"><img src="${question.image}" alt="${question.scenario || 'Fire scenario'}"></div>`;
    }

    // Question type specific content
    switch (question.type) {
        case 'multiple-choice':
            cardHTML += createMultipleChoice(question);
            break;
        case 'scenario-image':
            cardHTML += createMultipleChoice(question);
            break;
        case 'drag-drop':
            cardHTML += createDragDrop(question);
            break;
        case 'hotspot':
            cardHTML += createHotspot(question);
            break;
    }

    cardHTML += `
                <button class="hint-button" onclick="showHint('${question.id}')">
                    <i class="fas fa-lightbulb"></i> Hint
                </button>
                <div class="hint-text" id="hint-${question.id}">${question.hint}</div>
                <div class="explanation" id="explanation-${question.id}">${question.explanation}</div>
            </div>
        </div>`;

    quizContainer.insertAdjacentHTML('beforeend', cardHTML);

    // Initialize drag-drop if needed
    if (question.type === 'drag-drop') {
        initializeDragDrop(question.id);
    }
}

function createMultipleChoice(question) {
    let html = '';
    question.options.forEach((option, index) => {
        html += `<div class="option" onclick="selectEnhancedOption(this, '${question.id}', ${index})">${option.text}</div>`;
    });
    return html;
}

function createDragDrop(question) {
    let html = `
        <div class="drag-drop-container">
            <div class="drag-items">
                <h4>Drag fire types:</h4>`;
    question.dragItems.forEach(item => {
        html += `<div class="drag-item" draggable="true" data-id="${item.id}">${item.text}</div>`;
    });
    html += `
            </div>
            <div class="drop-zones">
                <h4>Drop into correct extinguishers:</h4>`;
    question.dropZones.forEach(zone => {
        html += `<div class="drop-zone" data-correct="${zone.correct}" data-zone="${zone.id}">${zone.label}</div>`;
    });
    html += `
            </div>
        </div>`;
    return html;
}

function createHotspot(question) {
    let html = `
        <div class="hotspot-container">
            <img src="${question.image}" alt="Building hallway with fire extinguishers" class="hotspot-image">`;
    question.hotspots.forEach(hotspot => {
        html += `<div class="hotspot" style="left: ${hotspot.x}%; top: ${hotspot.y}%;" onclick="clickHotspot(this, ${hotspot.correct}, '${question.id}')">${hotspot.label}</div>`;
    });
    html += `</div>`;
    return html;
}

function selectEnhancedOption(option, questionId, optionIndex) {
    const question = enhancedQuestions.find(q => q.id === questionId);
    const isCorrect = question.options[optionIndex].correct;

    // Visual feedback
    option.classList.add(isCorrect ? 'correct' : 'incorrect');

    // Show explanation
    document.getElementById(`explanation-${questionId}`).classList.add('show');

    // Calculate time bonus
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    const timeBonus = Math.max(0, Math.floor((30 - timeTaken) / 3)); // Bonus for quick answers

    // Update score
    if (isCorrect) {
        quizScore += question.points + timeBonus;
        questionsAnswered.push({ questionId, correct: true, timeBonus });
    } else {
        questionsAnswered.push({ questionId, correct: false, timeBonus: 0 });
    }

    // Auto-advance after delay
    setTimeout(() => {
        nextEnhancedQuestion();
    }, 2000);
}

function showHint(questionId) {
    const hintElement = document.getElementById(`hint-${questionId}`);
    hintElement.classList.toggle('show');
    if (hintElement.classList.contains('show')) {
        hintsUsed++;
    }
}

function initializeDragDrop(questionId) {
    const dragItems = document.querySelectorAll(`#${questionId} .drag-item`);
    const dropZones = document.querySelectorAll(`#${questionId} .drop-zone`);

    dragItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const dropZone = e.target.closest('.drop-zone');

    if (dropZone && !dropZone.classList.contains('dropped')) {
        const draggedItem = document.querySelector(`[data-id="${draggedId}"]`);
        const isCorrect = dropZone.dataset.correct === draggedId;

        dropZone.classList.add('dropped', isCorrect ? 'correct' : 'incorrect');
        dropZone.textContent = draggedItem.textContent;
        draggedItem.style.display = 'none';

        // Check if all items are placed
        const totalItems = document.querySelectorAll(`#${enhancedQuestions[currentQuestionIndex].id} .drag-item`).length;
        const placedItems = document.querySelectorAll(`#${enhancedQuestions[currentQuestionIndex].id} .dropped`).length;

        if (placedItems === totalItems) {
            setTimeout(() => {
                showDragDropResults(enhancedQuestions[currentQuestionIndex]);
            }, 1000);
        }
    }
}

function showDragDropResults(question) {
    const dropZones = document.querySelectorAll(`#${question.id} .drop-zone`);
    let allCorrect = true;

    dropZones.forEach(zone => {
        const isCorrect = zone.classList.contains('correct');
        if (!isCorrect) allCorrect = false;
    });

    document.getElementById(`explanation-${question.id}`).classList.add('show');

    if (allCorrect) {
        quizScore += question.points;
        questionsAnswered.push({ questionId: question.id, correct: true });
    } else {
        questionsAnswered.push({ questionId: question.id, correct: false });
    }

    setTimeout(() => {
        nextEnhancedQuestion();
    }, 3000);
}

function clickHotspot(hotspot, isCorrect, questionId) {
    hotspot.classList.add(isCorrect ? 'correct' : 'incorrect');

    // Disable further clicks temporarily
    document.querySelectorAll(`#${questionId} .hotspot`).forEach(h => {
        h.style.pointerEvents = 'none';
    });

    setTimeout(() => {
        const question = enhancedQuestions.find(q => q.id === questionId);
        const allHotspots = document.querySelectorAll(`#${questionId} .hotspot`);
        let correctClicks = 0;

        allHotspots.forEach(h => {
            if (h.classList.contains('correct')) correctClicks++;
        });

        const totalCorrect = question.hotspots.filter(h => h.correct).length;

        if (correctClicks === totalCorrect) {
            quizScore += question.points;
            questionsAnswered.push({ questionId, correct: true });
        } else {
            questionsAnswered.push({ questionId, correct: false });
        }

        document.getElementById(`explanation-${questionId}`).classList.add('show');

        setTimeout(() => {
            nextEnhancedQuestion();
        }, 3000);
    }, 1000);
}

function nextEnhancedQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < enhancedQuestions.length) {
        showEnhancedQuestion(currentQuestionIndex);
    } else {
        submitEnhancedQuiz();
    }
}

function updateQuizProgress() {
    const progress = ((currentQuestionIndex) / enhancedQuestions.length) * 100;
    const progressBar = document.querySelector('.progress-bar-fill');
    const progressText = document.querySelector('.progress-text');

    if (progressBar) progressBar.style.width = progress + '%';
    if (progressText) progressText.textContent = `Question ${currentQuestionIndex + 1} of ${enhancedQuestions.length}`;
}

function startQuizTimer() {
    quizTimer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(quizTimer);
            submitEnhancedQuiz();
        }
    }, 1000);
}

function submitEnhancedQuiz() {
    clearInterval(quizTimer);

    const percentage = (quizScore / totalPoints) * 100;
    const timeBonus = Math.floor(timeLeft / 60) * 5; // 5 points per remaining minute
    const finalScore = Math.min(quizScore + timeBonus, totalPoints);

    // Show results
    showQuizResults(finalScore, totalPoints, percentage, timeBonus);

    if (percentage >= 70) {
        setTimeout(() => {
            nextSection('certificate');
        }, 5000);
    } else {
        setTimeout(() => {
            alert(`You scored ${percentage.toFixed(0)}%. You need at least 70% to pass. Try again!`);
            startQuiz();
        }, 5000);
    }
}

function showQuizResults(score, total, percentage, timeBonus) {
    const resultsHTML = `
        <div class="score-display">
            <h3>Quiz Complete!</h3>
            <div class="score-number">${percentage.toFixed(0)}%</div>
            <p>Score: ${score}/${total} points</p>
            ${timeBonus > 0 ? `<p>Time Bonus: +${timeBonus} points</p>` : ''}
            <div class="score-breakdown">
                <div class="score-item">
                    <i class="fas fa-clock"></i>
                    <span>Time Left</span>
                    <span>${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
                <div class="score-item">
                    <i class="fas fa-lightbulb"></i>
                    <span>Hints Used</span>
                    <span>${hintsUsed}</span>
                </div>
                <div class="score-item">
                    <i class="fas fa-trophy"></i>
                    <span>Questions</span>
                    <span>${questionsAnswered.filter(a => a.correct).length}/${enhancedQuestions.length}</span>
                </div>
            </div>
        </div>`;

    document.querySelector('.quiz-container').innerHTML = resultsHTML;
}

function hasPassedQuiz() {
    return score >= Math.ceil(questions.length * 0.7);
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            submitQuiz();
        }
    }, 1000);
}

function showCertificate() {
    // Store the quiz results for certificate generation
    window.quizResults = {
        score: quizScore,
        totalPoints: totalPoints,
        percentage: (quizScore / totalPoints) * 100,
        timeLeft: timeLeft,
        hintsUsed: hintsUsed,
        questionsAnswered: questionsAnswered
    };

    // Show name input and hide certificate initially
    document.querySelector('.name-input-container').style.display = 'block';
    document.getElementById('cert').style.display = 'none';
    document.getElementById('downloadBtn').style.display = 'none';
}

function generateCertificate() {
    const nameInput = document.getElementById('userNameInput');
    const userName = nameInput.value.trim();

    if (!userName) {
        alert('Please enter your name to generate the certificate.');
        nameInput.focus();
        return;
    }

    // Hide name input and show certificate
    document.querySelector('.name-input-container').style.display = 'none';
    document.getElementById('cert').style.display = 'block';
    document.getElementById('downloadBtn').style.display = 'inline-block';

    // Populate certificate with data
    const date = new Date().toLocaleDateString();
    const results = window.quizResults;

    document.getElementById('userName').textContent = userName;
    document.getElementById('date').textContent = date;
    document.getElementById('score').textContent = `${results.score}/${results.totalPoints} (${results.percentage.toFixed(0)}%)`;

    // Trigger confetti
    confetti();
}

// Expert tips system
let expertTipInterval;

function showRandomExpertTip() {
    const tips = [
        "Remember: In a fire, smoke rises. Stay low to the ground where the air is cleaner.",
        "Fire spreads rapidly - you may have only 2 minutes to escape once the alarm sounds.",
        "Never use elevators during a fire. Always use stairs.",
        "If your clothes catch fire, STOP, DROP, and ROLL to extinguish the flames.",
        "Close doors behind you as you evacuate to slow the spread of fire and smoke.",
        "If trapped, call emergency services and signal from a window with a light or cloth.",
        "Smoke alarms save lives. Test yours monthly and change batteries twice a year.",
        "Know two ways out of every room in your home or workplace.",
        "Fire extinguishers are for small fires only. Evacuate if the fire is spreading.",
        "Crawl low under smoke - heat and toxic gases rise to the ceiling."
    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    document.getElementById('expertText').textContent = randomTip;
    document.getElementById('expertPopup').style.display = 'block';

    // Auto-hide after 8 seconds
    setTimeout(() => {
        closeExpertTip();
    }, 8000);
}

function closeExpertTip() {
    document.getElementById('expertPopup').style.display = 'none';
}

// Interactive scenarios with branching storylines
const scenarios = {
    home: {
        title: "Kitchen Fire Emergency",
        steps: [
            {
                description: "You're cooking dinner when you notice smoke coming from a pan on the stove. The pan is on fire and flames are spreading. What do you do first?",
                choices: [
                    { text: "Pour water on the fire", outcome: "Wrong! Never use water on a grease fire. Water spreads the flames. The fire grows larger and you need to evacuate immediately.", nextStep: null, correct: false },
                    { text: "Turn off the stove and cover the pan with a lid", outcome: "Correct! Smothering the fire by cutting off oxygen is the right approach for small grease fires. The fire is extinguished.", nextStep: 1, correct: true },
                    { text: "Fan the flames with a towel", outcome: "Wrong! Fanning spreads the fire. The flames grow and you inhale smoke. You need to evacuate.", nextStep: null, correct: false },
                    { text: "Run out of the house immediately", outcome: "Wrong! For a small contained fire, try to extinguish it first if safe. You waste time and the fire spreads.", nextStep: null, correct: false }
                ]
            },
            {
                description: "The fire is out, but there's still smoke. What do you do next?",
                choices: [
                    { text: "Open windows to let smoke out", outcome: "Wrong! Opening windows can feed the fire with oxygen. You should ventilate carefully.", nextStep: null, correct: false },
                    { text: "Turn on exhaust fan and monitor for reignition", outcome: "Correct! Proper ventilation helps clear smoke while staying alert for any remaining fire.", nextStep: null, correct: true },
                    { text: "Leave the kitchen and call the fire department", outcome: "Wrong! The fire is out, but you should still be cautious. Monitor the area.", nextStep: null, correct: false }
                ]
            }
        ]
    },
    office: {
        title: "Office Building Fire Alarm",
        steps: [
            {
                description: "You're working at your desk when the fire alarm sounds. You smell smoke but don't see flames. Your colleagues are starting to panic. What should you do?",
                choices: [
                    { text: "Continue working to finish your task", outcome: "Wrong! Fire alarms are not false alarms. You ignore the alarm and the fire spreads.", nextStep: null, correct: false },
                    { text: "Gather your belongings and then leave", outcome: "Wrong! Leave everything behind. Your life is more important than possessions. You evacuate safely.", nextStep: 1, correct: false },
                    { text: "Stop what you're doing, close your computer, and evacuate calmly", outcome: "Correct! Close programs if safe, but prioritize evacuation over saving work.", nextStep: 1, correct: true },
                    { text: "Check with your supervisor before leaving", outcome: "Wrong! Don't wait for permission. You evacuate immediately and safely.", nextStep: 1, correct: false }
                ]
            },
            {
                description: "You're in the hallway heading to the exit. You see a colleague frozen in panic. What do you do?",
                choices: [
                    { text: "Keep going - save yourself first", outcome: "Wrong! While your safety comes first, helping others when safe is important. You both evacuate.", nextStep: null, correct: false },
                    { text: "Stop and help guide them to the exit", outcome: "Correct! Help others when it's safe to do so. You both reach safety.", nextStep: null, correct: true },
                    { text: "Yell at them to move and continue", outcome: "Wrong! Panic can freeze people. Calm assistance is better.", nextStep: null, correct: false }
                ]
            }
        ]
    },
    outdoor: {
        title: "Campfire Safety",
        steps: [
            {
                description: "You're camping and have built a campfire. It's getting late and you're tired. The fire is still burning brightly. What should you do?",
                choices: [
                    { text: "Go to sleep - the fire will burn out on its own", outcome: "Wrong! Never leave a campfire unattended. It spreads and you wake to danger.", nextStep: null, correct: false },
                    { text: "Add more wood to keep it burning all night", outcome: "Wrong! Adding fuel makes the fire bigger and harder to control. It becomes unmanageable.", nextStep: null, correct: false },
                    { text: "Douse the fire completely with water and stir the ashes", outcome: "Correct! Make sure the fire is completely out before leaving. Stir ashes to check for hot spots.", nextStep: 1, correct: true },
                    { text: "Cover the fire with dirt and go to sleep", outcome: "Wrong! Dirt may not extinguish all embers. The fire reignites overnight.", nextStep: null, correct: false }
                ]
            },
            {
                description: "The fire is out and you've stirred the ashes. You notice a small glow. What do you do?",
                choices: [
                    { text: "Add more water to be sure", outcome: "Correct! Better safe than sorry. The remaining ember is extinguished.", nextStep: null, correct: true },
                    { text: "Ignore it - it's probably nothing", outcome: "Wrong! Hot spots can reignite. You should ensure complete extinguishment.", nextStep: null, correct: false },
                    { text: "Cover it with more dirt", outcome: "Wrong! Water is more effective for complete extinguishment.", nextStep: null, correct: false }
                ]
            }
        ]
    }
};

let currentScenario = null;
let currentStep = 0;

function selectScenario(type) {
    currentScenario = scenarios[type];
    currentStep = 0;
    showScenarioStep();
    document.getElementById('scenarioModal').style.display = 'block';
}

function showScenarioStep() {
    const step = currentScenario.steps[currentStep];
    document.getElementById('scenarioTitle').textContent = currentScenario.title;
    document.getElementById('scenarioDescription').textContent = step.description;

    const choicesContainer = document.getElementById('scenarioChoices');
    choicesContainer.innerHTML = '';

    step.choices.forEach((choice, index) => {
        const choiceElement = document.createElement('div');
        choiceElement.className = 'scenario-choice';
        choiceElement.textContent = choice.text;
        choiceElement.onclick = () => selectScenarioChoice(index);
        choicesContainer.appendChild(choiceElement);
    });

    document.getElementById('scenarioOutcome').style.display = 'none';
}

function selectScenarioChoice(index) {
    const step = currentScenario.steps[currentStep];
    const choice = step.choices[index];
    const outcomeText = document.getElementById('outcomeText');
    outcomeText.textContent = choice.outcome;

    // Highlight the selected choice
    const choices = document.querySelectorAll('.scenario-choice');
    choices.forEach((c, i) => {
        c.classList.remove('selected');
        if (i === index) {
            c.classList.add('selected');
            c.style.backgroundColor = choice.correct ? '#d4edda' : '#f8d7da';
        }
    });

    document.getElementById('scenarioOutcome').style.display = 'block';

    // Handle branching
    if (choice.nextStep !== null) {
        setTimeout(() => {
            currentStep = choice.nextStep;
            showScenarioStep();
        }, 3000);
    } else {
        // End of scenario
        setTimeout(() => {
            closeScenarioModal();
        }, 3000);
    }
}

function closeScenarioModal() {
    document.getElementById('scenarioModal').style.display = 'none';
    currentScenario = null;
    currentStep = 0;
}

function restartScenario() {
    if (currentScenario) {
        currentStep = 0;
        showScenarioStep();
    }
}

// Initialize expert tips on page load
document.addEventListener('DOMContentLoaded', function() {
    // Show first expert tip after 10 seconds
    setTimeout(() => {
        showRandomExpertTip();
        // Then show random tips every 30 seconds
        expertTipInterval = setInterval(showRandomExpertTip, 30000);
    }, 10000);
});

function downloadCertificate() {
    // Simple download simulation - in a real app, this would generate a PDF
    alert('Certificate download feature would be implemented here. For now, you can screenshot this page!');
}

function triggerAvatarAction() {
    // Trigger avatar action animation
    const avatar = document.querySelector('.avatar');
    avatar.classList.add('action-triggered');

    // Change speech bubble message
    const speechText = document.getElementById('speech-text');
    const actionMessages = [
        "Great! I'm here to help with fire safety training.",
        "Click on the steps to learn more about fire prevention!",
        "Remember: Stop, Drop, and Roll if your clothes catch fire!",
        "Stay calm during emergencies - that's the key to safety!"
    ];
    const randomMessage = actionMessages[Math.floor(Math.random() * actionMessages.length)];
    speechText.classList.remove('animate__fadeIn');
    setTimeout(() => {
        speechText.textContent = randomMessage;
        speechText.classList.add('animate__fadeIn');
    }, 100);

    // Remove action class after animation
    setTimeout(() => {
        avatar.classList.remove('action-triggered');
    }, 1000);
}

function showTipDetail(tipNumber) {
    const tipDetails = {
        1: {
            title: "Know Your Escape Routes",
            content: "Plan multiple escape routes from your home. Practice them regularly with your family. Never use elevators during a fire. Remember: 'Get out, stay out, and call 9-1-1!'"
        },
        2: {
            title: "Test Smoke Alarms Monthly",
            content: "Change batteries twice a year and test alarms monthly. Smoke alarms can alert you to a fire before you see or smell it. Install alarms in every bedroom, outside sleeping areas, and on every level of your home."
        },
        3: {
            title: "Have a Fire Extinguisher Ready",
            content: "Keep fire extinguishers in key locations. Learn how to use them and check them regularly. Remember the PASS method: Pull the pin, Aim at the base of the fire, Squeeze the handle, Sweep side to side."
        },
        4: {
            title: "Never Leave Cooking Unattended",
            content: "Stay in the kitchen when cooking. Keep flammable items away from heat sources. If a fire starts, cover the pan with a lid and turn off the heat. Never use water on a grease fire."
        }
    };

    const tip = tipDetails[tipNumber];
    document.getElementById('tipTitle').textContent = tip.title;
    document.getElementById('tipContent').textContent = tip.content;
    document.getElementById('tipModal').style.display = 'block';
    document.getElementById('tipModal').setAttribute('aria-hidden', 'false');
}

function closeModal() {
    document.getElementById('tipModal').style.display = 'none';
    document.getElementById('tipModal').setAttribute('aria-hidden', 'true');
}

function closeExpertTip(tipNumber) {
    document.getElementById('expertTip' + tipNumber).style.display = 'none';
}

// Show expert tips randomly
function showRandomExpertTip() {
    const tips = [1, 2, 3];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    document.getElementById('expertTip' + randomTip).style.display = 'block';
    setTimeout(() => {
        closeExpertTip(randomTip);
    }, 8000); // Auto-close after 8 seconds
}

// Show expert tip when user completes a step
setTimeout(showRandomExpertTip, 10000); // Show first tip after 10 seconds

function confetti() {
    confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6b6b', '#feca57', '#667eea', '#764ba2']
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('tipModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Typing effect for title
function typeWriter(text, element, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Accessibility functions
function toggleHighContrast() {
    highContrastEnabled = !highContrastEnabled;
    document.body.classList.toggle('high-contrast', highContrastEnabled);
    localStorage.setItem('highContrast', highContrastEnabled);
}

function skipToContent() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView();
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Skip link with Tab
    if (e.key === 'Tab') {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.style.top = '6px';
        }
    }

    // High contrast toggle with Ctrl+Shift+H
    if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        toggleHighContrast();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    updateNavIcons();

    // Load accessibility preferences
    const savedContrast = localStorage.getItem('highContrast') === 'true';
    if (savedContrast) {
        highContrastEnabled = true;
        document.body.classList.add('high-contrast');
    }

    // Start typing effect
    const titleElement = document.getElementById('typing-text');
    if (titleElement) {
        typeWriter('Advanced Fire Safety Training', titleElement);
    }

    // Start counter animation
    const counterElement = document.querySelector('.counter');
    if (counterElement) {
        setTimeout(() => {
            animateCounter(counterElement);
        }, 2000);
    }

    // Set initial step as active
    showStep(1);

    // Add accessibility features
    addAccessibilityFeatures();
});

function addAccessibilityFeatures() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.onclick = skipToContent;
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add high contrast toggle button
    const contrastBtn = document.createElement('button');
    contrastBtn.className = 'contrast-toggle';
    contrastBtn.innerHTML = '<i class="fas fa-adjust" aria-hidden="true"></i>';
    contrastBtn.onclick = toggleHighContrast;
    contrastBtn.setAttribute('aria-label', 'Toggle high contrast mode');
    contrastBtn.title = 'Toggle high contrast (Ctrl+Shift+H)';
    document.querySelector('.navbar').appendChild(contrastBtn);

    // Add ARIA live regions for dynamic content
    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) {
        quizContainer.setAttribute('aria-live', 'polite');
        quizContainer.setAttribute('aria-atomic', 'false');
    }

    // Improve button accessibility
    document.querySelectorAll('button').forEach(btn => {
        if (!btn.getAttribute('aria-label') && !btn.textContent.trim()) {
            btn.setAttribute('aria-label', 'Button');
        }
    });

    // Add focus management for modals
    const modal = document.getElementById('tipModal');
    if (modal) {
        modal.addEventListener('shown', () => {
            const closeBtn = modal.querySelector('.close');
            if (closeBtn) closeBtn.focus();
        });
    }
}
