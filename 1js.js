let users = JSON.parse(localStorage.getItem('users')) || [];
let questions = JSON.parse(localStorage.getItem('questions')) || [];
let currentUser = null;
let items = JSON.parse(localStorage.getItem('items')) || [
    {
        name: 'Used Laptop',
        image: 'https://via.placeholder.com/100',
        price: 300
    },
    {
        name: 'Books',
        image: 'https://via.placeholder.com/100',
        price: 50
    }
];

function hideAllSections() {
    document.querySelectorAll('.container').forEach(section => {
        section.classList.add('hidden');
    });
}

function showLoginPage() {
    hideAllSections();
    document.getElementById('login-page').classList.remove('hidden');
}

function showSignupPage() {
    hideAllSections();
    document.getElementById('signup-page').classList.remove('hidden');
}

function showSeniorDashboard() {
    hideAllSections();
    document.getElementById('senior-dashboard').classList.remove('hidden');
}

function showJuniorDashboard() {
    hideAllSections();
    document.getElementById('junior-dashboard').classList.remove('hidden');
    renderJuniorItems();
}

function showAddItemForm() {
    document.getElementById('add-item-form').classList.remove('hidden');
    document.getElementById('answer-questions').classList.add('hidden');
}

function showAnswerQuestions() {
    document.getElementById('answer-questions').classList.remove('hidden');
    document.getElementById('add-item-form').classList.add('hidden');
    renderQuestions();
}

function showAnsweredQuestions() {
    document.getElementById('answered-questions').classList.remove('hidden');
    document.getElementById('ask-question-form').classList.add('hidden');
    document.getElementById('items-list').classList.add('hidden');
    renderAnsweredQuestions();
}

function showAskQuestionForm() {
    document.getElementById('ask-question-form').classList.remove('hidden');
    document.getElementById('items-list').classList.add('hidden');
}

function showItemsList() {
    document.getElementById('items-list').classList.remove('hidden');
    document.getElementById('ask-question-form').classList.add('hidden');
    renderItems();
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        user.role === 'senior' ? showSeniorDashboard() : showJuniorDashboard();
    } else {
        alert('Invalid email or password.');
    }
}

function signup() {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const role = document.getElementById('signup-role').value.trim();

    if (!name || !email || !phone || !password || !role) {
        alert('Please fill out all fields.');
        return;
    }

    if (!email.endsWith('@gmail.com')) {
        alert('Please enter a valid Gmail address.');
        return;
    }

    if (!/^\d{10}$/.test(phone)) {
        alert('Please enter a valid 10-digit phone number.');
        return;
    }

    if (users.find(u => u.email === email)) {
        alert('Email already registered.');
        return;
    }

    const newUser = { name, email, phone, password, role };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = newUser;

    role === 'senior' ? showSeniorDashboard() : showJuniorDashboard();
}

function addItem() {
    const name = document.getElementById('item-name').value;
    const imageInput = document.getElementById('item-image');
    const price = document.getElementById('item-price').value;

    if (!name || !imageInput.files[0] || !price || !currentUser) {
        alert('Please fill out all fields or log in as a senior.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const newItem = {
            name,
            image: e.target.result,
            price,
            phone: currentUser.phone
        };

        items.push(newItem);
        localStorage.setItem('items', JSON.stringify(items));

        alert('Item added successfully.');

        renderItems();
        renderJuniorItems();

        document.getElementById('item-name').value = '';
        document.getElementById('item-image').value = '';
        document.getElementById('item-price').value = '';
    };

    reader.readAsDataURL(imageInput.files[0]);
}

function renderItems() {
    const container = document.getElementById('items-container');
    container.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <div style="flex: 0 0 150px; text-align: center;">
                <img src="${item.image}" alt="${item.name}" style="max-width: 100%; max-height: 100px; border-radius: 5px;">
            </div>
            <div style="flex: 1; padding-left: 15px;">
                <b><p>${item.name}</p></b>
                <p>Price: ${item.price}</p>
                <p><strong>Contact:</strong> ${item.phone}</p>
                <button onclick="removeItem(${index})" style="padding: 5px 10px;">Accept</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderJuniorItems() {
    const container = document.getElementById('items-container');
    container.innerHTML = '';
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];

    storedItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <h3>${item.name}</h3>
            <img src="${item.image}" alt="${item.name}">
            <p>Price: ${item.price}</p>
            <p><strong>Contact:</strong> ${item.phone}</p>
            <button onclick="acceptItem(${index})">Accept</button>
        `;
        container.appendChild(div);
    });
}

function removeItem(index) {
    items.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(items));
    renderItems();
    renderJuniorItems();
}

function acceptItem(index) {
    const acceptedItem = items[index];
    items.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(items));
    renderItems();
    renderJuniorItems();
    alert(`You have accepted the item: ${acceptedItem.name}`);
}

function askQuestion() {
    const questionText = document.getElementById('question-text').value.trim();
    if (questionText === '') {
        alert('The question field cannot be empty.');
        return;
    }
    questions.push({ text: questionText, answered: false, answer: '' });
    localStorage.setItem('questions', JSON.stringify(questions));
    alert('Question asked successfully.');
    document.getElementById('question-text').value = '';
}

function renderQuestions() {
    const container = document.getElementById('questions-list');
    container.innerHTML = '';
    questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.className = 'question';
        div.innerHTML = `<p>${q.text}</p>`;
        if (!q.answered) {
            const input = document.createElement('textarea');
            input.placeholder = 'Your answer';
            const button = document.createElement('button');
            button.textContent = 'Answer';
            button.onclick = () => answerQuestion(index, input.value);
            div.appendChild(input);
            div.appendChild(button);
        } else {
            div.innerHTML += `<p><strong>Answer:</strong> ${q.answer}</p>`;
        }
        container.appendChild(div);
    });
}

function answerQuestion(index, answer) {
    questions[index].answered = true;
    questions[index].answer = answer;
    localStorage.setItem('questions', JSON.stringify(questions));
    renderQuestions();
}

function renderAnsweredQuestions() {
    const container = document.getElementById('answered-questions-list');
    container.innerHTML = '';
    questions.forEach(q => {
        if (q.answered) {
            const div = document.createElement('div');
            div.className = 'qa-box';
            div.innerHTML = `
                <div class="question-box">
                    <strong>Question:</strong>
                    <p>${q.text}</p>
                </div>
                <div class="answer-box">
                    <strong>Answer:</strong>
                    <p>${q.answer}</p>
                </div>
            `;
            container.appendChild(div);
        }
    });
}

function fetchQuestions() {
    fetch('http://localhost:3000/questions')
        .then(response => response.json())
        .then(fetchedQuestions => {
            questions = fetchedQuestions;
            renderAnsweredQuestions();
        });
}
