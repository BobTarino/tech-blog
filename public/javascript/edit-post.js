async function editFormHandler(event) {
    event.preventDefault();

    // get post id from url
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    // Get the post title and content from the form
    const title = document.querySelector('input[name="post-title"]').value;
    const post_text = document.querySelector('input[name="post-text"]').value;

    const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          post_text
        }),
        headers: {
          'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        document.location.replace('/dashboard/');
    } else {
        alert(response.statusText);
    }

}
  
document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);