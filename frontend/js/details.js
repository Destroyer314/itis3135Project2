"use strict";
// Author: Matthew Sherin = msherin@charlotte.edu
// Description: Blog detail page functionality for blog app


document.addEventListener('DOMContentLoaded', () => {
    getBlog();
})
async function getBlog() {
  // Get the blog ID from the URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get('id');

  try {
    // Send a fetch request to the JSON server to get the blog
    const response = await fetch(`http://localhost:3000/blogs/${blogId}`);
    if (!response.ok) {
      throw new Error('Blog not found');
    }
    const blog = await response.json();

    // Display the blog
    const wrapper = document.querySelector('.wrapper');
    const titleElement = document.createElement('h2');
    titleElement.textContent = blog.title;
    wrapper.appendChild(titleElement);

    const contentElement = document.createElement('p');
    contentElement.innerHTML = blog.content;
    wrapper.appendChild(contentElement);

    const authorElement = document.createElement('p');
    authorElement.textContent = `By ${blog.author}`;
    wrapper.appendChild(authorElement);

    const editButton = document.createElement('a');
    editButton.href = `edit.html?id=${blog.id}`;
    editButton.className = 'accent-btn';
    editButton.textContent = 'Edit';
    wrapper.appendChild(editButton);
  } catch (error) {
    displayError(error.message);
  }
}

function displayError(message) {
  const errorElement = document.querySelector('.notification-container');
  const errorMessage = document.querySelector('.notification');
  errorMessage.textContent = message;
  errorElement.classList.remove('hidden');
  const close = errorElement.querySelector('.close');
  close.addEventListener('click', () => {
    errorElement.classList.add('hidden');
  });
}