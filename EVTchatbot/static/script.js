document.addEventListener("DOMContentLoaded", function () {
    const chatContainer = document.getElementById("chat-container");
    const userMessageInput = document.getElementById("user-message");
    const sendButton = document.getElementById("send-button");

    sendButton.addEventListener("click", async function () {
        await handleUserInput();
    });

    userMessageInput.addEventListener("keypress", async function (event) {
        if (event.key === "Enter") {
            await handleUserInput();
        }
    });

    // Handle user input
    async function handleUserInput() {
        const userMessage = userMessageInput.value.trim();
        if (userMessage !== "") {
            displayUserMessage(userMessage);
            try {
                await sendUserInput(userMessage);
            } catch (error) {
                console.error('Error:', error.message);
                displayChatbotMessage("An error occurred while processing your request.");
            }
            userMessageInput.value = "";
        }
    }

async function sendUserInput(userMessage) {
    try {
        const response = await fetch('/get_response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'user_message=' + encodeURIComponent(userMessage),
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }

        const responseHtml = await response.text();  // Get response as text
        displayChatbotMessage(responseHtml, true);  // Pass true to indicate it's HTML content
    } catch (error) {
        console.error('Error:', error);
        displayChatbotMessage("An unexpected error occurred while processing your request.");
    }
}


function displayChatbotMessage(message) {
    const chatbotMessageElement = document.createElement("div");
    chatbotMessageElement.className = "chatbot-message";
    chatbotMessageElement.innerHTML = message; // Set innerHTML to render HTML content
    chatContainer.appendChild(chatbotMessageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}


    // Display user message in the chat
    function displayUserMessage(message) {
        const userMessageElement = document.createElement("div");
        userMessageElement.className = "user-message";
        userMessageElement.textContent = message;
        chatContainer.appendChild(userMessageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

// Function to display event names
function displayEventNames(events) {
    if (events.length === 0) {
        displayChatbotMessage("No events available at the moment.");
        return;
    }
    // Check if the first element is a string or an object to determine how to process
    let isStringArray = typeof events[0] === 'string';
    let message = "Events you might be interested in: ";
    let eventNames;

    if (isStringArray) {
        eventNames = events.join(', ');
    } else {
        eventNames = events.map(event => event.name || 'Unnamed Event').join(', ');
    }

    message += eventNames;
    displayChatbotMessage(message);
}




});


/*

function displayEventsAsTable(events) {
    console.log("Displaying events as table", events); // Log the events data for debugging

    const table = document.createElement('table');
    table.className = 'events-table';
    table.style.width = '100%'; // Set the table width to full container width

    // Add table headers
    const headers = ['Event Name', 'City', 'Genre', 'Price'];
    const headerRow = table.insertRow();
    headers.forEach(headerText => {
        let header = headerRow.insertCell();
        header.textContent = headerText;
    });

    // Add event rows
    events.forEach(event => {
        const row = table.insertRow();
        headers.forEach(header => {
            let cell = row.insertCell();
            // Adjust the key to match your event data structure
            let value = event[header.replace(/ /g, '').toLowerCase()];
            if (typeof value === 'undefined') {
                console.error(`Error: ${header} is undefined in event data`, event);
                value = 'N/A';
            }
            cell.textContent = value;
        });
    });

    // Append the table to your chat container
    const chatContainer = document.getElementById('chat-container');
    chatContainer.appendChild(table);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom of the chat
}
*/