// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const icon = themeToggle.querySelector('i');

function updateTheme() {
    const isDark = localStorage.getItem('darkTheme') === 'true';
    document.body.classList.toggle('dark-theme', isDark);
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

themeToggle.addEventListener('click', () => {
    const isDark = localStorage.getItem('darkTheme') === 'true';
    localStorage.setItem('darkTheme', !isDark);
    updateTheme();
});

// Initialize theme
updateTheme();

// Newsletter Subscription
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Store subscription in localStorage
        const subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
        if (!subscriptions.includes(email)) {
            subscriptions.push(email);
            localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));
            showNotification('Thanks for subscribing to our newsletter!', 'success');
            newsletterForm.reset();
        } else {
            showNotification('You are already subscribed!', 'info');
        }
    });
}

// DOM Elements
const commentForm = document.querySelector('.comment-form');
const commentInput = document.querySelector('textarea.comment-input');
const commentsContainer = document.querySelector('.comments-container');
const nameInput = document.querySelector('input[type="text"].comment-input');
const emailInput = document.querySelector('input[type="email"].comment-input');

// Load comments from localStorage
function loadComments() {
    const savedComments = localStorage.getItem('comments');
    return savedComments ? JSON.parse(savedComments) : [];
}

// Save comments to localStorage
function saveComments(comments) {
    localStorage.setItem('comments', JSON.stringify(comments));
}

// Create a new comment
function createComment(name, email, text) {
    return {
        id: Date.now(),
        name: name || 'Anonymous Player',
        email: email || '',
        text: text,
        timestamp: new Date().toLocaleString(),
        likes: 0
    };
}

// Render a single comment
function renderComment(comment) {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment-item';
    commentElement.innerHTML = `
        <div class="comment-header">
            <div class="comment-avatar" style="background: ${getAvatarColor(comment.name)}">
                ${comment.name.charAt(0).toUpperCase()}
            </div>
            <div class="comment-info">
                <div class="comment-name">${comment.name}</div>
                ${comment.email ? `<div class="comment-email">${comment.email}</div>` : ''}
                <div class="comment-date">${comment.timestamp}</div>
            </div>
        </div>
        <div class="comment-content">${comment.text}</div>
        <div class="comment-actions">
            <button class="like-btn" onclick="likeComment(${comment.id})">
                <i class="fas fa-heart"></i>
                <span>${comment.likes}</span>
            </button>
        </div>
    `;
    return commentElement;
}

// Get avatar color based on name
function getAvatarColor(name) {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
        '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#1ABC9C'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
}

// Render all comments
function renderComments() {
    const comments = loadComments();
    const commentsWrapper = document.createElement('div');
    commentsWrapper.className = 'comments-list';
    
    if (comments.length === 0) {
        commentsWrapper.innerHTML = `
            <div class="no-comments">
                <i class="fas fa-comments"></i>
                <p>No comments yet. Be the first to share your thoughts!</p>
                <p class="comment-tip">Your comments will be visible to all players.</p>
            </div>
        `;
    } else {
        comments.forEach(comment => {
            commentsWrapper.appendChild(renderComment(comment));
        });
    }
    
    commentsContainer.innerHTML = '';
    commentsContainer.appendChild(commentsWrapper);
}

// Like a comment
function likeComment(commentId) {
    const comments = loadComments();
    const commentIndex = comments.findIndex(c => c.id === commentId);
    
    if (commentIndex !== -1) {
        comments[commentIndex].likes++;
        saveComments(comments);
        renderComments();
    }
}

// Handle form submission
commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const text = commentInput.value.trim();
    
    if (text.length < 3) {
        showNotification('Comment must be at least 3 characters long', 'error');
        return;
    }
    
    const comments = loadComments();
    const newComment = createComment(name, email, text);
    comments.unshift(newComment); // Add new comment at the beginning
    saveComments(comments);
    
    // Clear form
    commentForm.reset();
    
    // Show success message
    showNotification('Comment posted successfully!', 'success');
    
    // Re-render comments
    renderComments();
    
    // Scroll to the new comment
    const firstComment = commentsContainer.querySelector('.comment-item');
    if (firstComment) {
        firstComment.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize comments
renderComments(); 