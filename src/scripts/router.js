// const route = (event) => {
//   event = event || window.event;
//   event.preventDefault();
//   window.history.pushState({}, "", event.target.href);
//   handleLocation();
// };

// const routes = {
//   "/": "/rs-clone/dist/index.html",
//   "/ggg": "/rs-clone/dist/404.html",
//   // "/login": "/rs-clone/dist/ggg.html",
//   // "/registration": "/rs-clone/dist/registration.html",
//   404: "/rs-clone/dist/registration.html"
// };

// const handleLocation = async () => {
//   const path = window.location.pathname;
//   const route = routes[path] || routes[404];
//   const html = await fetch(route).then((data) => data.text());
//   console.log(document.querySelector(".test-page"));
//   document.querySelector(".test-page").innerHTML = html;
// };

// window.onpopstate = handleLocation;
// window.route = route;

// handleLocation();