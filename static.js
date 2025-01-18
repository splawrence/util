// Global variables
let diceInt;
let oldDiceInt;
let exerciseOptions = [];
let dataLength;

// Fetch exercises from data.json
async function getExercises() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();
        exerciseOptions = data;
    } catch (error) {
        console.error('Error fetching exercises:', error);
    }
}

// Load menu and apply dark mode settings on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    loadMenu();
    applyDarkModeSettings();
});

// Load menu from menu.html and sanitize the content
async function loadMenu() {
    try {
        const response = await fetch('./menu.html');
        const html = await response.text();
        document.getElementById("menu").innerHTML = DOMPurify.sanitize(html);
    } catch (error) {
        console.error('Error loading menu:', error);
    }
}

// Split input text into chunks and write to nodes
function spit() {
    const inputText = document.getElementById("inputText").value;
    splitAndWriteText(inputText);
}

// Copy text to clipboard and remove the node
function copyText(event) {
    try {
        const textToCopy = event.target.closest('p').innerText.trim();
        const elPrefix = document.getElementById('prefix').value;
        const allText = elPrefix + textToCopy;
        navigator.clipboard.writeText(allText).then(() => {
            event.target.closest('.node').remove();
        }).catch(err => {
            console.error('Could not copy text:', err);
        });
    } catch (error) {
        console.error('Error copying text:', error);
    }
}

// Split input text into chunks and write each chunk to a node
function splitAndWriteText(inputText) {
    const limit = 15900;
    let fileNum = 0;
    for (let i = 0; i < inputText.length; i += limit) {
        const chunk = inputText.substring(i, i + limit);
        writeToNode(chunk, fileNum);
        fileNum++;
    }
}

// Create a node with text and a copy button, and append it to the chunks container
function writeToNode(text) {
    const elChunks = document.getElementById('chunks');
    const node = document.createElement('p');
    node.className = 'node';

    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-copy"></i>';
    button.onclick = copyText;
    button.className = 'btn btn-primary btn-lg';

    node.appendChild(button);
    node.appendChild(document.createElement('br')); // Add a line break
    const textNode = document.createElement('p');
    textNode.textContent = text;
    node.appendChild(textNode);

    elChunks.appendChild(node);
}

// Reset input text and chunks container
function reset() {
    document.getElementById("inputText").value = "";
    document.getElementById("chunks").innerHTML = "";
}