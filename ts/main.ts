async function loadNavbar() {
  const response = await fetch('/src/pages/navbar.html');
  const html = await response.text();
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.innerHTML = html;
  }
}
loadNavbar();
