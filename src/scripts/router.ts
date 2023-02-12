const route = (event: any) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target!.href);
};

// window.route = route;