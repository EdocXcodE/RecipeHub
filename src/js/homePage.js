document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const welcomeTitle = document.getElementById('welcomeTitle');
    const logoutButton = document.getElementById('logoutButton');
    const savedRecipesBtn = document.getElementById('savedRecipesBtn');
    const discussBtn = document.getElementById('discussButton');
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');
    var flag = true;

    const apiKey = 'AIzaSyCeYibcJGRyRAjhSA2nfwne1IXgTHvPbRA';
    const welcMsg = 'Hi! I am here to answer all your queries.';
    // Show/hide chatbot window
    
    chatbotButton.addEventListener('click', function() {
        chatbotWindow.classList.toggle('open');
        if(flag){ 
            appendMessage('bot', welcMsg);
            flag=false;
        }
    });

    // Retrieve the name from local storage
    const name = localStorage.getItem('name');
    if (name) {
        welcomeTitle.textContent = `Welcome, ${name}! Let's Begin Recipe Hunt`;
    }

    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query === '') {
            alert('Please enter ingredients or keywords to search.');
            return;
        }

        // Redirect to recipe.html with the search query as a parameter
        window.location.href = `recipesPage.html?query=${encodeURIComponent(query)}`;
    });

    // Logout functionality
    logoutButton.addEventListener('click', function() {
        alert('Logged out successfully.');
        // Redirect to login page
        window.location.href = 'login.html';
    });

    if (savedRecipesBtn) {
        savedRecipesBtn.addEventListener('click', function() {
            window.location.href = 'saveRecipes.html';
        });
    } else {
        console.error('Saved Recipes button not found.');
    }

    if (discussBtn) {
        discussBtn.addEventListener('click', function() {
            window.location.href = 'discuss.html';
        });
    } else {
        console.error('Discuss button not found.');
    }

    // Send message function
    sendButton.addEventListener('click', function() {
        const message = chatInput.value.trim();
        if (message === '') {
            alert('Please enter a message.');
            return;
        }

        // Send message to ChatGPT
        sendMessageToChatbot(message);
    });

    chatInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const message = chatInput.value.trim();
            if (message === '') {
                alert('Please enter a message.');
                return;
            }
    
            // Send message to ChatGPT
            sendMessageToChatbot(message);
        }
    });

    // Function to send message to Gemini
    function sendMessageToChatbot(message) {
        // Append user's message to chat window
        appendMessage('user', message);
        chatInput.value = '';
        // Fetch response from Gemini
        const gettingResponseMessage = 'Getting response...';
        appendMessage('bot', gettingResponseMessage);

        fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' + apiKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: message }
                        ]
                    }
                ]
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Check if candidates array exists in the response
            if (data.candidates && data.candidates.length > 0) {
                // Get the content from the first candidate
                const content = data.candidates[0].content;

                // Check if content exists
                if (content && content.parts) {
                    // Extract text from parts array
                    const text = content.parts.map(part => part.text).join('\n');
                    chatMessages.removeChild(chatMessages.lastChild);
                    // Append bot's response to chat window
                    appendMessage('bot', text);
                }
            } else {
                chatMessages.removeChild(chatMessages.lastChild);
                appendMessage('bot', 'Sorry, I could not generate a response.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            chatMessages.removeChild(chatMessages.lastChild);
            appendMessage('bot', 'Sorry, something went wrong. Please try again later.');
        });
    }

    // Function to append message to chat window
    function appendMessage(sender, message) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container');
        messageContainer.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        
        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble');
        messageBubble.textContent = message;
        
        const senderName = document.createElement('span');
        senderName.textContent = sender === 'user' ? 'You' : 'Bot';
        senderName.classList.add('sender-name');

        const messageContent = document.createElement('div');
        messageContent.appendChild(senderName);
        messageContent.appendChild(messageBubble);

        messageContainer.appendChild(messageContent);
        chatMessages.appendChild(messageContainer);

        // Scroll to bottom of chat window
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Voice-to-speech functionality
    const speechButton = document.createElement('button');
    speechButton.textContent = '🎙️'; // Microphone emoji
    speechButton.classList.add('speech-button');
    chatInput.parentNode.insertBefore(speechButton, sendButton);

    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    speechButton.addEventListener('click', function() {
        if (speechButton.textContent === '🎙️') {
            speechButton.textContent = '🔴'; // Red circle emoji indicating speech recognition is active
            recognition.start();
        } else {
            recognition.stop();
            speechButton.textContent = '🎙️';
        }
    });

    let recognizedText = ''; // Variable to store recognized text
  
    recognition.onresult = function(event) {
        recognizedText = ''; // Clear the recognized text
        let last = event.results.length - 1;
        recognizedText = event.results[last][0].transcript;
        event.results = [];
    };
    
    
    recognition.onend = function() {
        chatInput.value += recognizedText; // Append the recognized text to the chat input
        recognizedText = ''; 
    };
    
    
    recognition.onspeechend = function() {
        speechButton.textContent = '🎙️';
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        speechButton.textContent = '🎙️';
    };
});
