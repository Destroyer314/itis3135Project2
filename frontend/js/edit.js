"use strict";
// Author: Matthew Sherin - msherin@charlotte.edu
// Description: Edit blog page functionality for blog app


document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
    if (blogId) {
        try {
            const response = await fetch(`http://localhost:3000/blogs/${blogId}`);
            const blog = await response.json();
            document.querySelector('#title').value = blog.title;
            document.querySelector('#content').value = blog.content;
        } catch (error) {
            console.error('Error fetching blog:', error);
        }
    }

    document.querySelector('form').addEventListener('submit', async event => {
        event.preventDefault();

        const title = document.querySelector('#title').value;
        const content = document.querySelector('#content').value;

        // Get the existing blog data
        const urlParams = new URLSearchParams(window.location.search);
        const blogId = urlParams.get('id');
        const response = await fetch(`http://localhost:3000/blogs/${blogId}`);
        const existingBlog = await response.json();

        console.log(existingBlog);
        // Create a new blog object with the updated title and content
        const updatedBlog = {
            id: existingBlog.id,
            title: title,
            author: existingBlog.author,
            date: new Date().toISOString(),
            content: content,
        };

        try {
            const response = await fetch(`http://localhost:3000/blogs/${blogId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedBlog)
            });

            if (response.ok) {
                window.location.href = `details.html?id=${blogId}`;
            } else {
                throw new Error('Failed to update the blog');
            }
        } catch (error) {
            console.error('Error updating blog:', error);
        }
    });
});