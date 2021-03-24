import { registerApplication, start } from "single-spa";
import PubSub from "pubsub-js";

const publish = (event, data) => PubSub.publish(event, data);
const subscribe = (event, callback) => PubSub.subscribe(event, callback);

const userFromStorage = localStorage.getItem("USER");

let user = {};
if (userFromStorage != null) {
  user = JSON.parse(userFromStorage);
}

subscribe("USER_DATA_EVENT", (msg, data) => {
  localStorage.setItem("USER", JSON.stringify(data));
});

const apps = [
  {
    name: "@cd/navbar",
    route: (location) =>
      ["/login", "/logout"].indexOf(location.pathname) === -1,
  },
  { name: "@cd/test", route: "/test" },
  {
    name: "@cd/login",
    route: (location) =>
      ["/login", "/logout"].indexOf(location.pathname) !== -1,
  },
  { name: "@cd/dashboard", route: "/dashboard" },
];

apps.forEach((app) => {
  registerApplication({
    name: app.name,
    app: () => System.import(app.name),
    activeWhen: app.route,
    customProps: {
      publish,
      subscribe,
      user,
    },
  });
});

start();

if (user.username == null && window.location.pathname != "/login") {
  window.location = "/login";
}
