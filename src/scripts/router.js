const Path = window.location.pathname;
const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};

const routes = {

  [Path]: "/rs-clone/dist/registration.html",
  ["/registration"]: "/rs-clone/dist/registration.html",
  // "/login": "/rs-clone/dist/ggg.html",
  // "/registration": "/rs-clone/dist/registration.html",
  404: "/rs-clone/dist/404.html"
};
console.log(routes);
const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404];
  const html = await fetch(route).then((data) => data.text());
  console.log(route);
  console.log("'path'",path);
  document.querySelector(".test-page").innerHTML = html;
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();