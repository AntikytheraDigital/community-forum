// Assuming you have an array of comments and a function to render the comments on the page
const commentList = document.querySelector('.comment-list');
const initialComments = JSON.parse(commentList.getAttribute('data-initial-comments') || '[]');
console.log("INITIAL COMMENTS: ", initialComments);
let comments = initialComments || [];
// check local storage for comments and add them to the DOM (only pre-existing comments), save post id too

function renderComments() {
    const commentList = document.querySelector('.comment-list');
    const newCommentsContainer = document.createElement('div');

    commentList.innerHTML = ''; // Clear existing comments
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'post-card';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'post-card-info';

        const authorSpan = document.createElement('span');
        authorSpan.className = 'post-card-author';
        authorSpan.textContent = `Posted by ${comment.username}`;
        infoDiv.appendChild(authorSpan);

        const dateSpan = document.createElement('span');
        dateSpan.className = 'post-card-date';
        dateSpan.textContent = ` at ${new Date(comment.timestamp).toLocaleString()}`;
        infoDiv.appendChild(dateSpan);

        commentElement.appendChild(infoDiv);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'post-card-content';

        const contentP = document.createElement('p');
        contentP.textContent = comment.content;
        contentDiv.appendChild(contentP);

        commentElement.appendChild(contentDiv);

        commentList.appendChild(commentElement);

        newCommentsContainer.appendChild(commentElement);

    });

    commentList.appendChild(newCommentsContainer);

}


// Assuming you have a form with an input field for the comment text and a submit button
const commentForm = document.querySelector('#comment-form');
const commentInput = document.querySelector('#comment-input');
const boardName = commentForm.getAttribute('data-board-name');
const postID = commentForm.getAttribute('data-post-id');
const postData = JSON.parse(commentForm.getAttribute('data-post'));

commentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const commentText = commentInput.value;

    const newComment = {
        content: commentText,
        username : document.getElementById("currentUser").textContent,
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch(`/board/${boardName}/posts/${postID}/addComment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                postID: postID,
                comment: commentText
            })
        });

        if (!response.ok) {
            const responseData = await response.json();
            console.error('Server responded with an error:', responseData);
        } else {
            comments.push(newComment);
            renderComments();
            commentInput.value = '';  

        }

    } catch (error) {
        console.error('Fetch Error:', error);
    }
});