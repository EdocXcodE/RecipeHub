document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const imageInput = document.getElementById('imageInput');
    const imageUploadButton = document.getElementById('imageUploadButton');
    const chatMessages = document.getElementById('chatMessages');
    const currentUser = localStorage.getItem('loggedInUser');
    const messageKey = 'chatMessages';
    const backButton = document.getElementById('backButton');

    // Function to display chat messages
    function displayChatMessages() {
        chatMessages.innerHTML = ''; // Clear previous messages

        // Retrieve chat messages from local storage
        let messages = JSON.parse(localStorage.getItem(messageKey)) || [];

        // Display each message in the chat container
        messages.forEach(message => {
            const chatBubble = document.createElement('div');
            chatBubble.classList.add('chat-bubble');
            const senderName = document.createElement('span');
            senderName.classList.add('message-info');
            senderName.textContent = `${message.sender} - ${message.timestamp}`;
            const messageContent = document.createElement('div');

            // Check if the message is text or a photo
            if (message.text) {
                const textContent = document.createElement('p');
                textContent.textContent = message.text;
                messageContent.appendChild(textContent);
            }
            if (message.content) {
                const image = document.createElement('img');
                image.src = message.content;
                image.alt = 'Uploaded Image';
                messageContent.appendChild(image);
            }

            // Create container for like button and count
            const likeContainer = document.createElement('div');
            likeContainer.classList.add('like-container');

            // Create thumbs up/down button
            const likeButton = document.createElement('button');
            likeButton.classList.add('like-button');
            likeButton.innerHTML = '&#128077;'; // Thumbs up emoji
            likeButton.addEventListener('click', function() {
                toggleLike(message);
            });

            const likeCount = document.createElement('span');
            likeCount.classList.add('like-count');
            likeCount.textContent = message.likes ? message.likes.length : 0;

            // Append like button and count to like container
            likeContainer.appendChild(likeButton);
            likeContainer.appendChild(document.createTextNode('Likes '));
            likeContainer.appendChild(likeCount);

            // Append sender name, message content, and like container to chat bubble
            chatBubble.appendChild(senderName);
            chatBubble.appendChild(messageContent);
            chatBubble.appendChild(likeContainer);

            // Position user's messages on the right side
            if (message.sender === currentUser) {
                chatBubble.classList.add('user-message');
                // Add delete button on hover for user's messages
                chatBubble.addEventListener('mouseenter', function() {
                    const deleteButton = document.createElement('button');
                    deleteButton.classList.add('delete-button');
                    deleteButton.innerHTML = '&#10060;'; // 'X' symbol emoji
                    deleteButton.addEventListener('click', function() {
                        deleteMessage(message);
                    });
                    chatBubble.appendChild(deleteButton);
                });
                // Remove delete button when mouse leaves message
                chatBubble.addEventListener('mouseleave', function() {
                    const deleteButton = chatBubble.querySelector('.delete-button');
                    if (deleteButton) {
                        chatBubble.removeChild(deleteButton);
                    }
                });
            } else {
                chatBubble.classList.add('other-message');
                // Check if the message is liked by the current user
                if (message.likes && message.likes.includes(currentUser)) {
                    likeButton.innerHTML = '&#128078;'; // Thumbs down emoji
                }
            }

            chatMessages.appendChild(chatBubble);
        });

        // Scroll to the bottom of the chat container
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to send a chat message
    function sendMessage() {
        // Get the input value
        const text = chatInput.value.trim();

        // Get the timestamp
        const timestamp = new Date().toLocaleString();

        // Initialize an empty message object
        const message = { sender: currentUser, timestamp: timestamp, likes: [] };

        // Check if the input contains a file
        if (imageInput.files && imageInput.files.length > 0) {
            // File upload is detected
            const file = imageInput.files[0];
            const reader = new FileReader();

            // Read the file as a data URL
            reader.readAsDataURL(file);

            // When the file reading is complete
            reader.onload = function () {
                // Set the file content as the message content
                message.content = reader.result;

                // If there is also text input, include it in the message
                if (text !== '') {
                    message.text = text;
                }

                // Save the message to local storage
                saveMessage(message);

                // Clear the input fields after sending the message
                chatInput.value = '';
                imageInput.value = '';

                // Display the updated chat messages
                displayChatMessages();
            };
        } else if (text !== '') {
            // No file upload, only text message
            // Save the text message to local storage
            message.text = text;
            saveMessage(message);

            // Clear the input field after sending the message
            chatInput.value = '';

            // Display the updated chat messages
            displayChatMessages();
        }
    }

    // Function to toggle like on a message
    function toggleLike(message) {
        const index = message.likes ? message.likes.indexOf(currentUser) : -1;
        if (index === -1) {
            // User has not liked the message, so add their like
            message.likes.push(currentUser);
        } else {
            // User has already liked the message, so remove their like
            message.likes.splice(index, 1);
        }

        // Update the message in local storage
        let messages = JSON.parse(localStorage.getItem(messageKey)) || [];
        messages = messages.map(msg => {
            if (msg.timestamp === message.timestamp) {
                return message;
            } else {
                return msg;
            }
        });
        localStorage.setItem(messageKey, JSON.stringify(messages));

        // Refresh the display of chat messages
        displayChatMessages();
    }

    // Function to delete a message
    function deleteMessage(message) {
        // Check if the message sender is the current user
        if (message.sender === currentUser) {
            // Retrieve existing messages from local storage
            let messages = JSON.parse(localStorage.getItem(messageKey)) || [];

            // Filter out the message to be deleted
            messages = messages.filter(msg => msg.timestamp !== message.timestamp);

            // Save the updated array of messages to local storage
            localStorage.setItem(messageKey, JSON.stringify(messages));

            // Refresh the display of chat messages
            displayChatMessages();
        }
    }

    // Function to save a message to local storage
    function saveMessage(message) {
        // Retrieve existing messages from local storage
        let messages = JSON.parse(localStorage.getItem(messageKey)) || [];

        // Add the new message to the array
        messages.push(message);

        // Save the updated array of messages to local storage
        localStorage.setItem(messageKey, JSON.stringify(messages));
    }

    // Display chat messages when the page loads
    displayChatMessages();

    // Event listener for the send button
    sendButton.addEventListener('click', sendMessage);

    // Event listener for pressing Enter key in the input field
    chatInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Event listener for the image upload button
    imageUploadButton.addEventListener('click', function() {
        imageInput.click();
    });

    backButton.addEventListener('click', function() {

        window.location.href = 'homePage.html';
    });

});
