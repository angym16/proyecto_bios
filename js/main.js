const isAdmin = localStorage.getItem("isAdmin") === "true";

const homeLink = isAdmin
  ? "../admin/index.html"
  : "../index.html";