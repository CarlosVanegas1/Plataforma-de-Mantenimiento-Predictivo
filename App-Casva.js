document.querySelectorAll('.navegation a').forEach(link => {
    if (link.href.split('/').pop() === window.location.pathname.split('/').pop()) {
        link.classList.add('active');
    }
});

document.querySelectorAll('.faq-question').forEach(item => {
    item.addEventListener('click', event => {
        const parent = item.parentNode;
        parent.classList.toggle('active');
    });
});