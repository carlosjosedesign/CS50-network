
//Submit Comment
function comment (event) {
    event.preventDefault()
    event.target.querySelector('.icon-button').disabled = true
    fetch(`/post-comment/comment`, {
        method: 'POST',
        body: new FormData(event.target),
    })
    .then(response => response.json())
    .then(result => {
        if(!result.error){
            createComment(result)
            event.target.querySelector('textarea').value = ''
            event.target.querySelector('.icon-button').disabled = false
        }
    })
}

function createComment(comment){
    const post_id = comment.post_id
    const comment_id = comment.id
    
    const post = document.querySelector(`#post_${post_id}`).parentNode
    const comments = post.querySelector('.comment-section')
    const commentsForm = comments.querySelector('.comment-form-wrapper')
    const userimage = commentsForm.querySelector('.comment-profile-picture')
    
    const commentWrapper = document.createElement('div');
    commentWrapper.classList = 'comment'
    commentWrapper.id = `comment_${comment_id}`
    
    //Image
    const commentImage = document.createElement('div')
    commentImage.classList = 'comment-user-image'
    
    const commentImageAuthorLink = document.createElement('a')
    commentImageAuthorLink.gref = `/user-profile/${comment.user.id}`
    
    const AuthorImage = document.createElement('img')
    AuthorImage.classList = 'round-picture comment-profile-picture'
    AuthorImage.src = userimage.src
    AuthorImage.alt = 'profile picture'
    AuthorImage.title =  comment.user.name
    
    commentImageAuthorLink.append(AuthorImage)
    commentImage.append(commentImageAuthorLink)
    
    //Main
    const commentMain = document.createElement('div')
    commentMain.classList = 'comment-main'
    
    const commentAuthorLink = document.createElement('a')
    commentAuthorLink.gref = `/user-profile/${comment.user.id}`
    commentAuthorLink.innerHTML = comment.user.name
    
    const commentContent = document.createElement('div')
    commentContent.classList = 'content comment-content short'
    commentContent.innerHTML = comment.content
    
    commentMain.append(commentAuthorLink, commentContent)

    //Show more
    const commentShowMore = document.createElement('div')
    commentShowMore.classList = 'show-more'
    commentShowMore.innerHTML =  current_language == 'pt-br' ? 'Veja mais' : 'Show more'
    
    //Panel
    const commentPanel = document.createElement('div')
    commentPanel.classList = 'delete-edit-panel'
    
    const dropdown = document.createElement('div')
    dropdown.classList = 'dropdown'
    
    const dropdownLink = document.createElement('a')
    dropdownLink.classList = 'btn icon-button'
    dropdownLink.href='#'
    dropdownLink.id = `dropdownMenuLink_${comment_id}`
    dropdownLink.dataset.toggle = 'dropdown'
    dropdownLink.setAttribute('role','button')
    dropdownLink.setAttribute('aria-haspopup',true)
    dropdownLink.setAttribute('aria-expanded',false)
    dropdownLink.innerHTML = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-three-dots" fill="rgb(101, 103, 107)" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg>`
    // dropdownLink.addEventListener('click', function(e) {
    
    // })
    
    const dropdownMenu = document.createElement('div')
    dropdownMenu.classList = 'dropdown-menu'
    dropdownMenu.setAttribute('aria-labelledby', `dropdownMenuLink_${comment_id}`)
    
    const dropdownMenuEditButton = document.createElement('button')
    dropdownMenuEditButton.classList = 'dropdown-item dropdown-edit'
    dropdownMenuEditButton.innerHTML = current_language == 'pt-br' ? 'Editar' : 'Edit'
    dropdownMenuEditButton.dataset.toggle = 'modal'
    dropdownMenuEditButton.dataset.target = `#modal_edit_comment_${post_id}`
    
    const dropdownMenuDeleteButton = document.createElement('button')
    dropdownMenuDeleteButton.classList = 'dropdown-item dropdown-delete'
    dropdownMenuDeleteButton.innerHTML = current_language == 'pt-br' ? 'Deletar' : 'Delete'
    dropdownMenuDeleteButton.dataset.toggle = 'modal'
    dropdownMenuDeleteButton.dataset.target = `#modal_delete_comment_${post_id}`
    
    dropdownMenu.append(dropdownMenuEditButton, dropdownMenuDeleteButton)
    dropdown.append(dropdownLink, dropdownMenu)
    commentPanel.append(dropdown)
    
    //Date
    const commentDate = document.createElement('div')
    commentDate.classList = 'comment-date'
    commentDate.innerHTML = current_language == 'pt-br' ? 'agora' : 'now'
    
    //Like
    const likeData = document.createElement('div')
    likeData.classList = 'like-data'
    
    const likeControl = document.createElement('div')
    likeControl.classList = 'like-comment-control'
    
    //Separator
    const separator = document.createElement('hr');
    separator.id = `comment_separation_${comment_id}`
    separator.classList = 'comment-separation'
    
    //Insert
    commentWrapper.append(commentImage, commentMain, commentShowMore, commentPanel, commentDate, likeData, likeControl)
    comments.insertBefore(commentWrapper, commentsForm);
    comments.insertBefore(separator, commentsForm);
    
    editCommentControl(commentWrapper,comment_id)
    deleteCommentControl(commentWrapper,comment_id)
    showMoreButtonControl(commentWrapper);
    
    updatePostCommentsCont (post_id, 'plus')
}


function updatePostCommentsCont (post, method){
    const counter = document.querySelector(`#post_${post} .comment-count span`)
    if(method == 'plus'){
        counter.innerHTML = parseInt(counter.innerHTML) + 1
    }else{
        counter.innerHTML = parseInt(counter.innerHTML) - 1
    }
    
}

// Handles POST request and single comment appearance after like
function likeCommentControl(commentNode) {
    let element = commentNode.querySelector(".like-panel")
    // Handle like comment
    element.addEventListener('click', (event) => {
        let csrftoken = getCookie('csrftoken');
        let emojiType;
        
        // Look for event's emoji type
        // Check if like button is a target
        if (event.target.name === "like") {
            emojiType = event.target.name;
        }
        // Check if emoji list is a target
        else if (typeof event.target.dataset.name === "string"){
            emojiType = event.target.dataset.name;
        }  
        // Something else is a target
        else {
            return false;
        }
        // Already liked - update like's emoji type
        if (commentNode.querySelector(".like-button").classList.contains("liked")) {
            fetch(`/like/comment/${commentNode.id.substr(8)}`, {
                method: "PUT",
                body: JSON.stringify({
                    emojiType: emojiType
                }),
                headers: {"X-CSRFToken": csrftoken}
            })
            .then(async(response) => {
                // Successful like -> update comment view
                if (response.status === 201) {
                    console.log(`comment id: ${commentNode.id.substr(8)} like updated successfully`)
                    // Update like button emoji and class
                    updateCommentLikeIcon(commentNode);
                    // Update like counter and emoji list
                    let previousEmojiType = commentNode.querySelector(".like-button > i").dataset.name;
                    updateEmojiList(commentNode, emojiType, previousEmojiType);
                    // Reconnect like amount indicator event to each emoji
                    likesAmountIndicatorControl(commentNode);
                }
                else {
                    let response_body = await response.json();
                    
                    throw new Error(response_body.error) ;                     
                }
            })
            .catch(error => {
                alert(error);
                location.reload();
            })
        }
        // No liked yet - save like
        else {
            fetch(`/like/comment/${commentNode.id.substr(8)}`, {
                method: "POST",
                body: JSON.stringify({
                    emojiType: emojiType
                }),
                headers: {"X-CSRFToken": csrftoken}
            })
            .then(async(response) => {
                // Successful like -> update comment view
                if (response.status === 201) {
                    console.log(`comment id: ${commentNode.id.substr(8)} liked successfully`)
                    // Update like button emoji and class
                    updateCommentLikeIcon(commentNode);
                    // Update like counter and emoji list
                    updateEmojiList(commentNode, emojiType);
                    // Reconnect like amount indicator event to each emoji
                    likesAmountIndicatorControl(commentNode);
                }
                else {
                    let response_body = await response.json();
                    
                    throw new Error(response_body.error) ;                     
                }
            })
            .catch(error => {
                alert(error);
                location.reload();
            })
        }
        
    })
}


// Controls asynchronous editing of a comment
function editCommentControl(commentNode) {
    
    const parentPost = commentNode.closest('.comment-section')
    let modalDialog = parentPost.querySelector(".edit-modal");
    
    commentNode.querySelector('.dropdown-edit').addEventListener('click', (e) => {
        // Get save button and modal body
        let modalBody = modalDialog.querySelector(".modal-body");
        
        // Get comment id
        const commentID = commentNode.id.substr(8);
        
        // Get content of comment to be edited
        let contentNode = commentNode.querySelector("div.comment-content");
        const contentInnerText = contentNode.textContent.trim();
        
        // Populate content with form to fill
        modalBody.innerHTML = `<input type="hidden" name="comment_id" value="${commentID}"><textarea class="new-content form-control">${contentInnerText}</textarea>`;
        
    })
}

function SaveEditComment (event) {
    const modalDialog = event.target.closest('.modal')
    modalBody = modalDialog.querySelector(".modal-body")
    
    // Get content to submit
    const submittedContent = modalBody.querySelector("textarea.new-content").value.trim();
    const comment_id = modalBody.querySelector('input[name="comment_id"]').value
    console.log(comment_id)
    const commentNode = document.getElementById(`comment_${comment_id}`)
    let contentNode = commentNode.querySelector("div.comment-content")
    
    let csrftoken = getCookie('csrftoken');
    
    
    // Send PUT request
    fetch("/post-comment/comment", {
        method: "PUT",
        body: JSON.stringify({
            id: comment_id,
            content: submittedContent,
        }),
        headers: {"X-CSRFToken": csrftoken}
    })
    .then(async(response) => {
        // if success - update comment's content
        if (response.status === 201) {
            showMoreButtonControl(commentNode);
            contentNode.innerHTML = submittedContent;
            console.log(`comment id: ${comment_id} edited successfully`);
            // Hide modal
            $(modalDialog).modal('hide');
        }
        // if error - show alert and reload the page
        else {
            let response_body = await response.json();
            throw new Error(response_body.error);                        
        }
    })
    .catch(error => {
        alert(error);
        location.reload();
    })
}

let CommentToDelete = null
// Controls deleting of a comment
function deleteCommentControl(commentNode) {
    commentNode.querySelector('.dropdown-delete').addEventListener('click', (e) => {
        CommentToDelete = commentNode.id.substr(8)
    })
  
}

function SaveDeleteComment (event) {

    let csrftoken = getCookie('csrftoken');
   
    // Send DELETE request
    fetch("/post-comment/comment", {
        method: "DELETE",
        body: JSON.stringify({
            id: CommentToDelete,
        }),
        headers: {"X-CSRFToken": csrftoken}
    })
    .then(async(response) => {
        // if success - update comment's content and relaod the page
        if (response.status === 204) {
            console.log(`Comment id: ${CommentToDelete} deleted successfully`)
            updatePostCommentsCont (5, 'minus')
            const modalDialog = event.target.closest('.modal')
            $(modalDialog).modal('hide')
            
            const thisComment =  document.querySelector(`#comment_${CommentToDelete}`)
            thisComment.classList.add('hide')
            
            const thisSeparator =  document.querySelector(`#comment_separation_${CommentToDelete}`)
            thisSeparator.remove()
            
            setTimeout(() => {
                thisComment.remove()
            },2000)
            //location.reload()
        }
        // if error - show alert and reload the page
        else {
            let response_body = await response.json();
            
            throw new Error(response_body.error);                        
        }
    })
    .catch(error => {
        alert(error);
        location.reload();
    })
}

function updateCommentLikeIcon(commentNode){
    // Show user's like type on like button
    fetch(`/like/comment/${commentNode.id.substr(8)}`)
    .then(async(response) => {
        let response_body = await response.json();
        
        if (response.status === 200) {
            if (response_body.like === "True"){
                const likeButton = commentNode.querySelector(".like-button");
                likeButton.classList.add("liked");
                // Add emoji of user's like type to like button
                likeButton.innerHTML = emojiNameToHtml(response_body.emojiType);
            }
        }
        else {
            throw new Error(response_body.error);
        }
    })
    .catch(error => {
        alert(error);
        location.reload();
    })
}