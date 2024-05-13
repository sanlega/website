const translations = {
    en: {
        title: "Santi Legaristi",
        about: "About Me",
        blog: "Posts",
        contact: "Contact Me",
        aboutContent: "This section is now the main focus. It can contain information about you, your interests, or professional background.",
        email: "Feel free to reach out via email at <a href='mailto:santilega@gmail.com'>santilega@gmail.com</a>.",
        postedOn: "Posted on"
    },
    es: {
        title: "Santi Legaristi",
        about: "Sobre Mí",
        blog: "Publicaciones",
        contact: "Contáctame",
        aboutContent: "Esta sección es ahora el enfoque principal. Puede contener información sobre ti, tus intereses o antecedentes profesionales.",
        email: "No dudes en contactarme por correo electrónico en <a href='mailto:santilega@gmail.com'>santilega@gmail.com</a>.",
        postedOn: "Publicado el"
    }
};

let currentLanguage = 'en'; // Default language

document.addEventListener('DOMContentLoaded', function() {
    updateContent();
    loadContent();
});

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'es' : 'en';
    document.getElementById('lang-toggle').innerText = currentLanguage === 'en' ? 'ES' : 'EN';
    updateContent();
    loadContent();
}

function updateTextContent(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.innerText = text;
    } else {
        console.error(`Element with ID '${id}' not found.`);
    }
}

function updateHTMLContent(id, html) {
    const element = document.getElementById(id);
    if (element) {
        element.innerHTML = html;
    } else {
        console.error(`Element with ID '${id}' not found.`);
    }
}

function updateContent() {
    updateTextContent('header-title', translations[currentLanguage].title);
    updateTextContent('about-title', translations[currentLanguage].about);
    updateTextContent('blog-title', translations[currentLanguage].blog);
    updateTextContent('contact-title', translations[currentLanguage].contact);
    updateHTMLContent('contact-content', translations[currentLanguage].email);
}

async function loadContent() {
    await loadMarkdownContent(`about_${currentLanguage}.md`, 'about-content');
    await loadPosts();
}

async function loadPosts() {
    const filePath = `posts_${currentLanguage}.json`;
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const posts = await response.json();
        const section = document.getElementById('blog');
        section.innerHTML = '';  // Clear previous posts
        posts.forEach(post => {
            const article = document.createElement('article');
            const contentHtml = marked(post.content);  // Convert Markdown to HTML
            article.innerHTML = `<h3 class="post-title">${post.title}</h3>
                                 <p class="post-date">${translations[currentLanguage].postedOn} ${post.date}</p>
                                 ${contentHtml}`;  // Inject converted HTML
            section.appendChild(article);
        });
    } catch (e) {
        console.error("Failed to load posts:", e);
    }
}

async function loadMarkdownContent(filePath, elementId) {
    const response = await fetch(filePath);
    const text = await response.text();
    const html = marked(text);
    document.getElementById(elementId).innerHTML = html;
}
