// Assuming you have an array of comments and a function to render the comments on the page
let comments = [];

function renderComments() {
    const commentList = document.querySelector('.comment-list');
    commentList.innerHTML = ''; // Clear existing comments
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'post-card';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'post-card-info';

        const authorSpan = document.createElement('span');
        authorSpan.className = 'post-card-author';
        authorSpan.textContent = `Posted by ${comment.authorID}`;
        infoDiv.appendChild(authorSpan);

        const dateSpan = document.createElement('span');
        dateSpan.className = 'post-card-date';
        dateSpan.textContent = `at ${new Date(comment.timestamp).toLocaleString()}`;
        infoDiv.appendChild(dateSpan);

        commentElement.appendChild(infoDiv);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'post-card-content';

        const contentP = document.createElement('p');
        contentP.textContent = comment.text;
        contentDiv.appendChild(contentP);

        commentElement.appendChild(contentDiv);

        commentList.appendChild(commentElement);
    });
}


// Assuming you have a form with an input field for the comment text and a submit button
const commentForm = document.querySelector('#comment-form');
const commentInput = document.querySelector('#comment-input');


commentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get the comment input field inside the event listener function
    const commentText = commentInput.value;
    
    // Create a new comment object with the text and any other relevant data
    const newComment = {
        text: commentText,
        authorID: "fakeUsername - test",
        timestamp: new Date().toISOString()
        // Add any other relevant data here
    };

    // Add the new comment to the array of comments
    comments.push(newComment);

    // Clear the input field
    commentInput.value = '';

    // Render the updated comments on the page
    renderComments();
});
