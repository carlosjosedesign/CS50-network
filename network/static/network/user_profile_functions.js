const followForm = document.getElementById('follow_unfollow')
    if(followForm){
    const followButton = followForm.querySelector('button')
    followForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const related_id = document.getElementById('user_id').value

        fetch(`/follow-unfollow/${related_id}`, {
            method: 'POST',
            body: new FormData(event.target),
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if(result.success) {
                let svg,text
                if(result.success == 'unfollow'){
                    svg = `<svg viewBox="0 0 16 16" class="bi bi-person-plus-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5-3a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/></svg>`
                    text = current_language == 'pt-br' ? 'Seguir' : 'Follow'
                    followButton.classList.add('btn-success')
                    followButton.classList.remove('btn-danger')
                }else{
                    svg = `<svg viewBox="0 0 16 16" class="bi bi-person-x-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6.146-2.854a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708z"/></svg>`
                    text = current_language == 'pt-br' ? 'Não seguir' : 'Unfollow' 
                    followButton.classList.remove('btn-success')
                    followButton.classList.add('btn-danger')
                }
    
                followButton.innerHTML = `${svg} ${text}`
            }
        
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    imgModal();
});

function imgModal() {
    // Get the modal
    let modal = document.querySelector(".img-modal");
    
    // Get the image and insert it inside the modal - use its "alt" text as a caption
    let img = document.querySelector(".profile-picture > img");
    let modalImg = document.querySelector(".img-modal .modal-content");
    let captionText = document.getElementById("modal-img-caption");
    img.addEventListener('click', function(){
        // Disable main scroll bar
        document.body.style.overflow = "hidden";
        
        // Show modal
        modal.style.display = "block";
        
        // Get img info
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
    });
    
    // When the user clicks on close (x) or outside photo, close the modal
    modal.addEventListener('click', (event) => {
        let closeButton = document.querySelector(".modal-close");
        
        if (event.target === modal || event.target === closeButton) {
            // Enable main scroll bar
            document.body.style.overflow = "auto";
            
            // Hide modal
            modal.style.display = "none";
        }
    })
}