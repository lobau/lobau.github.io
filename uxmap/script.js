// TODO
// - [x] Save to local storage
// - [ ] Download / Upload markdown
// - [-] Syntax highlight // nope, not doing that

const $ = (el) => {
  return document.getElementById(el);
};

const render = () => {
  // Grab the route from the URL
  let route = window.location.hash.substr(1);
  if (route === "") {
    route = "root";
  }

  // Grab the current markdown
  let uxdatafield = $("editing").value;

  // Generate the data object
  let uxdataraw = uxdatafield.slice(1);
  let uxdata = uxdataraw.split("\n/"); //cut each state
  let data = {};
  for (let i = 0; i < uxdata.length; i++) {
    let lines = uxdata[i].split(/\r?\n/);
    let slug = lines.shift();
    let body = lines.join("\n");
    let bodyHtml = marked(body);
    data[slug] = bodyHtml;
  }

  if (data[route] === undefined) {
    if (route == "root") {
      $("render_preview").innerHTML = `
        <div class="card error">
        <h1>Root is missing</h1>
        <p>
            The first state <strong>has</strong> to be called /root
            Make sure the first line is "/root" 
            <a href="javascript:window.history.back()">Back</a>
        </p>
        `;
    } else {
      $("render_preview").innerHTML = `
        <div class="card error">
        <h1>${route}</h1>
        <p>
            State doesn't exist yet.
            <a href="javascript:window.history.back()">Back</a>
        </p>
        `;
    }
  } else {
    $("render_preview").innerHTML = `
        <div class="route_name">/${route}</div>
        <div class="card">
        ${data[route]}
        </div>
        `;
  }

  localStorage.saveData = uxdatafield;
};

window.addEventListener("popstate", function () {
  render();
});

window.onload = () => {
  window.currentRoute = "root";

//   if (localStorage.saveData !== undefined) {
//     $("editing").innerHTML = localStorage.saveData;
//   } else {
    $("editing").innerHTML = `/root
# UX Map
UX Map is a simple tool allowing _anybody with some markdown knowledge_ to quickly draft and test UX flows.
Try it now! Just edit this sentence in the editor!
[What's a state?](#state)
[But what is it exactly?](#but_what)
[Learn more about markdown](#markdown)

/state
# What are states?
Any time a user is faced with a new set of actions, this is a new state.
- When the user visit a new page or screen
- When the user open a popover or a menu
- When the set of possible actions changes  
[Got it](#root)

/but_what
# But what is it exactly?
If you look on the left hand-side, you will see markdown code.  
You can easily add new _pages_, or _states_ by creating a new block starting with "/" followed by a unique name, and link blocks together using their unique #name
[Sounds great](#root)

/markdown
# Markdown Cheatsheet
**Markdown** is a lightweight way to add _formatting elements_ to plaintext text documents like this one. Look in the left-hand side to see how is the styling applied to this text.
[Back](#root)`;
//   }

  $("editing").addEventListener("input", function (event) {
    render();
  });

  render();
};
