"use strict";
// Author: Matthew Sherin- msherin@charlotte.edu
// Description: Landing page functionality for blog app


const MAX_LENGTH = 50; // Maximum length of the blog content shown on the page
//page limit is 12
const PAGE_LIMIT = 12; // Number of blogs per page

const BASE_URL = 'http://localhost:3000/blogs'; // JSON server blogs endpoint
const articlesWrapper = document.querySelector('.articles-wrapper');
const paginationContainer = document.querySelector('.pagination-container');
const searchInput = document.querySelector('input');
let totalPages = 0; // Total number of pages for blogs
let currentPage = 1; // Current page number
let data = [];

// Initialize the page after DOM is loaded
window.addEventListener('DOMContentLoaded', async () => {
    try {
        await fetchAndDisplayBlogs(currentPage);
    } catch (error) {
        console.error('Error initializing page:', error);
        displayError('Failed to load blogs');
    }
});

// Fetch and display blogs
async function fetchAndDisplayBlogs(page) {
    try {
        const response = await fetch(`${BASE_URL}?_page=${page}&_limit=${PAGE_LIMIT}&_sort=date&_order=desc`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data) {
            throw new Error('No data received from server');
        }
        console.log(data)
        articlesWrapper.innerHTML = '';
        data.forEach(blog => {
            const card = createCard(blog);
            articlesWrapper.appendChild(card);
        });
        totalPages = (response.headers.get('x-total-count')/PAGE_LIMIT);
        setupPagination();
    } catch (error) {
        console.error('Error fetching blogs:', error);
        displayError(error);
    }
}



// Create a card for a blog
function createCard(blog) {
    const article = document.createElement('article');
    article.classList.add('card');

    // Card header
    const header = document.createElement('div');
    header.classList.add('card-header');

    const avatar = document.createElement('img');
    avatar.src = blog.profile || 'images/default.jpeg'; // Use a default image if none provided
    avatar.width = 60;
    avatar.height = 60;
    avatar.alt = 'profile picture';
    avatar.classList.add('avatar');

    const authorDate = document.createElement('div');
    const formattedDate = new Date(blog.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
    authorDate.textContent = `${blog.author} · ${formattedDate}`;

    header.appendChild(avatar);
    header.appendChild(authorDate);

    // Card body
    const body = document.createElement('div');
    body.classList.add('card-body');

    const title = document.createElement('h3');
    title.textContent = blog.title;

    const content = document.createElement('p');
    content.textContent = truncateContent(blog.content);

    body.appendChild(title);
    body.appendChild(content);

    // Combine all sections into the article
    article.appendChild(header);
    article.appendChild(body);

    // When the card is clicked, navigate to the details page
    article.addEventListener('click', () => {
        window.location.href = `details.html?id=${blog.id}`;
    });

    return article;
}

// Truncate the content if it's longer than the max length
function truncateContent(content) {
    return content.length > MAX_LENGTH ? content.slice(0, MAX_LENGTH) + '...' : content;
}

// Set up pagination buttons
function setupPagination() {
    paginationContainer.innerHTML = ''; // Clear previous pagination buttons
    console.log(totalPages);
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('page-btn');
        
        if (i === currentPage) {
            pageButton.classList.add('active');
        }

        // When a page button is clicked, load the corresponding page
        pageButton.addEventListener('click', () => {
            currentPage = i;
            fetchAndDisplayBlogs(currentPage);
            updatePaginationButtons();
        });

        paginationContainer.appendChild(pageButton);
    }
}

// Update pagination button styles to indicate active page
function updatePaginationButtons() {
    document.querySelectorAll('.page-btn').forEach((btn, index) => {
        btn.classList.toggle('active', index + 1 === currentPage);
    });
}

// Handle search input change
async function handleSearchInputChange() {
    const searchTerm = searchInput.value.trim();
    const page = 1;

    if (searchTerm) {
        try {
            const url = `${BASE_URL}?_page=${page}&_limit=${PAGE_LIMIT}&q=${searchTerm}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (!data || data.length === 0) {
                // Handle the case when there are no pages with the search item
                await fetchAndDisplayBlogs(1);
            } else {
                articlesWrapper.innerHTML = '';
                data.forEach(blog => {
                    const card = createCard(blog);
                    articlesWrapper.appendChild(card);
                });
                totalPages = data.pages;
                setupPagination();
            }
        } catch (error) {
            console.error('Error fetching filtered blogs:', error);
            displayError('Failed to load filtered blogs');
        }
    } else {
        try {
            await fetchAndDisplayBlogs(page);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            displayError('Failed to load blogs');
        }
    }
}
searchInput.addEventListener('change', handleSearchInputChange);

// Display error message
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

