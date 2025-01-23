// Global variables
let diceInt;
let oldDiceInt;
let exerciseOptions = [];
let dataLength;

document.addEventListener("DOMContentLoaded", function () {
    loadMenu();
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

function transform() {
    const toolMap = {
        'insert': convertToSQL,
        'in': convertToInSQL,
    };
    const tool = document.getElementById('selTool').value;
    if (toolMap.hasOwnProperty(tool)) {
        toolMap[tool]();
    } else {
        console.error('Invalid tool selected');
    }
}

function convertToInSQL() {

    // const selectedDelimiter = document.getElementById('delimiter').value;
    // const delimiter = delimiterMap[selectedDelimiter] || selectedDelimiter;

    const inputText = document.getElementById('inputText').value;
    // const database = document.getElementById('database').value;
    // const table = document.getElementById('table').value;

    const rows = inputText.split('\n');
    // const columns = rows[0].split(delimiter);
    let sqlOutput = `(${rows.map(row => `'${row.trim()}'`).join(', ')})`;

    document.getElementById('outputText').value = sqlOutput;
}

function convertToSQL() {
    const delimiterMap = {
        'comma': ',',
        'tab': '\t',
        'space': ' ',
        'pipe': '|',
        'semicolon': ';',
        'colon': ':'
    };

    const selectedDelimiter = document.getElementById('delimiter').value;
    const delimiter = delimiterMap[selectedDelimiter] || selectedDelimiter;

    const inputText = document.getElementById('inputText').value;
    const database = document.getElementById('database').value;
    const table = document.getElementById('table').value;

    const rows = inputText.split('\n');
    const columns = rows[0].split(delimiter);
    let sqlOutput = `INSERT INTO ${database}.${table} (${columns.join(', ')}) VALUES\n`;

    for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(delimiter).map(value => `'${value}'`);
        if (values.length > 1) {
            sqlOutput += `(${values.join(', ')}),\n`;
        }
    }

    sqlOutput = sqlOutput.slice(0, -2) + ';';
    document.getElementById('outputText').value = sqlOutput;
}

function copySQL(event) {
    try {
        const textToCopy = outputText.value;
        navigator.clipboard.writeText(textToCopy).then(() => {
        }).catch(err => {
            console.error('Could not copy text:', err);
        });
    } catch (error) {
        console.error('Error copying text:', error);
    }
}

function toggleFields() {
    const selTool = document.getElementById('selTool').value;
    const database = document.getElementById('database');
    const delimiter = document.getElementById('delimiter');
    const table = document.getElementById('table');

    if (selTool === 'in') {
        database.style.display = 'none';
        delimiter.style.display = 'none';
        table.style.display = 'none';
    } else {
        database.style.display = 'block';
        delimiter.style.display = 'block';
        table.style.display = 'block';
    }
}