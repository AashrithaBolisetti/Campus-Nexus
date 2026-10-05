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

async function showItemsList() {
    document.getElementById('items-list').classList.remove('hidden');
    document.getElementById('ask-question-form').classList.add('hidden');

    await renderJuniorItems();
}

function showSignupPage() {
    hideAllSections();
    document.getElementById('signup-page').classList.remove('hidden');
}

function showSeniorDashboard() {
    hideAllSections();
    document.getElementById('senior-dashboard').classList.remove('hidden');
}

async function showJuniorDashboard() {
    hideAllSections();
    document.getElementById('junior-dashboard').classList.remove('hidden');

    await renderJuniorItems();
}

function showAddItemForm() {
    document.getElementById('add-item-form').classList.remove('hidden');
    document.getElementById('answer-questions').classList.add('hidden');
}

async function showAnswerQuestions() {
    document.getElementById('answer-questions').classList.remove('hidden');
    document.getElementById('add-item-form').classList.add('hidden');

    await renderQuestions();
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

async function login(){

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const res = await fetch("http://localhost:3000/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({email,password})
    });

    if(res.ok){
        const user = await res.json();
        currentUser = user;

        user.role === "senior" ? showSeniorDashboard() : showJuniorDashboard();
    }
    else{
        alert("Invalid login");
    }
}

async function signup(){

    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const phone = document.getElementById("signup-phone").value;
    const password = document.getElementById("signup-password").value;
    const role = document.getElementById("signup-role").value;

    const res = await fetch("http://localhost:3000/signup",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({name,email,phone,password,role})
    });

    if(res.ok){
        alert("Signup successful. Please login.");
        showLoginPage();
    }else{
        alert("Signup failed");
    }
}
async function addItem(){

    const name = document.getElementById("item-name").value;
    const price = document.getElementById("item-price").value;

    const item = {
        name:name,
        price:price,
        phone:currentUser.phone,
        image:"https://via.placeholder.com/100"
    };

    await fetch("http://localhost:3000/items",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(item)
    });

    alert("Item added");
}

async function renderItems(){

    const res = await fetch("http://localhost:3000/items");
    const items = await res.json();

    const container = document.getElementById('items-container');
    container.innerHTML="";

    items.forEach(item=>{
        const div=document.createElement("div");

        div.innerHTML=`
        <h3>${item.name}</h3>
        <p>Price: ${item.price}</p>
        <p>Contact: ${item.phone}</p>
        `;

        container.appendChild(div);
    });
}

async function renderJuniorItems() {

    const res = await fetch("http://localhost:3000/items");
    const items = await res.json();

    const container = document.getElementById('items-container');
    container.innerHTML = "";

    items.forEach(item => {

        const div = document.createElement("div");
        div.className = "item";

        div.innerHTML = `
            <h3>${item.name}</h3>
            <p>Price: ${item.price}</p>
            <p><strong>Contact:</strong> ${item.phone}</p>
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

async function askQuestion(){

    const text = document.getElementById("question-text").value;

    await fetch("http://localhost:3000/questions",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            text:text,
            answered:false,
            answer:""
        })
    });

    alert("Question asked");
}

async function renderQuestions(){

    const res = await fetch("http://localhost:3000/questions");
    const questions = await res.json();

    const container = document.getElementById('questions-list');
    container.innerHTML = "";

    questions.forEach(q => {

        const div = document.createElement("div");

        div.innerHTML = `<p>${q.text}</p>`;

        if(!q.answered){

            const input = document.createElement("textarea");

            const button = document.createElement("button");
            button.textContent = "Answer";

            button.onclick = async () => {

                await fetch("http://localhost:3000/questions/" + q._id,{
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        answer: input.value
                    })
                });

                renderQuestions();
            };

            div.appendChild(input);
            div.appendChild(button);
        }
        else{
            div.innerHTML += `<p><b>Answer:</b> ${q.answer}</p>`;
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

async function renderAnsweredQuestions(){

    const res = await fetch("http://localhost:3000/questions");
    const questions = await res.json();

    const container = document.getElementById('answered-questions-list');
    container.innerHTML = "";

    questions.forEach(q => {

        if(q.answered){

            const div = document.createElement("div");

            div.innerHTML = `
                <strong>Question:</strong>
                <p>${q.text}</p>

                <strong>Answer:</strong>
                <p>${q.answer}</p>
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
