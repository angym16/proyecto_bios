console.log("ADMIN?", localStorage.getItem("isAdmin"));

document.querySelectorAll(".home-link").forEach(link => {
   link.href = homeLink;
});