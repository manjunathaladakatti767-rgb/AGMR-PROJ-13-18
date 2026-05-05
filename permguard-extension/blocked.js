const urlParams = new URLSearchParams(window.location.search);
const url = urlParams.get('url');
if (url) {
    document.getElementById('blocked-url').textContent = url;
}
