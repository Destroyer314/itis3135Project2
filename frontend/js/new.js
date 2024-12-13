"use strict";
// Author: Matthew Sherin - msherin@charlotte.edu
// Description: New blog page functionality for blog app


document.querySelector('form').addEventListener('submit', async event => {
    event.preventDefault();

    const title = document.querySelector('#title').value;
    const content = document.querySelector('#content').value;
    const author = document.querySelector('#author').value;

    if (!title || !content || !author) {
        document.querySelector('.notification').textContent = 'All fields are required';
        document.querySelector('.notification-container').classList.remove('hidden');
        return;
    }

    const blog = {
        title,
        content,
        author,
        date: new Date().toISOString(),
        profile: 'images/default.jpeg',
    };

    try {
        const response = await fetch('http://localhost:3000/blogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(blog),
        });

        if (response.ok) {
            window.location.href = 'index.html';
        } else {
            throw new Error('Failed to create the blog');
        }
    } catch (error) {
        document.querySelector('.notification').textContent = error.message;
        document.querySelector('.notification-container').classList.remove('hidden');
    }
});