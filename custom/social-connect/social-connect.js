class ApiClient {
    static baseUrl = "https://social-connect-08x8.onrender.com";

    static getPosts = () => {
        return fetch(`${ApiClient.baseUrl}/facebook/posts`);
    }
}

function getBase64ImageUrl(width, height, backgroundColor = '#06294f') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    return canvas.toDataURL();
  }

(function ($) {
    'use strict';

    const fallbackPostImageUrl = getBase64ImageUrl(300, 300, "#06294f");

    ApiClient.getPosts().then(async (response) => {
        const posts = await response.json();
        console.log(posts);

        const postContainer = document.querySelector(".social-connect-swiper-wrapper");

        const template = document.querySelector("#social-connect-swiper-item-template");

        let postsToAppend = 5;

        for (const [, post] of Object.entries(posts)) {
            const templateClone = template.content.cloneNode(true);
            const dataPointNodes = templateClone.querySelectorAll(".social-connect-data");

            const [
                postLinkNode,
                avatarNode,
                usernameNode,
                timestampNode,
                textNode,
                postImageNode
            ] = dataPointNodes;

            const postDateStr = new Date(Number(post.timestamp)).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', });

            postLinkNode.href = `https://www.facebook.com/${post.postId}`;
            postLinkNode.title = `Post by ${post.authorName} on ${postDateStr}`;
            avatarNode.src = `https://graph.facebook.com/${post.authorId}/picture?type=square`;
            usernameNode.textContent = post.authorName;
            timestampNode.textContent = postDateStr;
            textNode.textContent = post.message;

            // const postImageSrc = post.photoUrl || fallbackPostImageUrl;

            postImageNode.src = post.photoUrl || fallbackPostImageUrl;
            
            // if (postImageSrc) {
            //     postImageNode.src = postImageSrc;
            // } else {
            //     templateClone.querySelector(".social-connect-media-box").classList.add("d-none");
            // }

            postContainer.appendChild(templateClone);

            if ((postsToAppend -= 1) < 1) {
                return;
            }
        }
    });

})(jQuery);