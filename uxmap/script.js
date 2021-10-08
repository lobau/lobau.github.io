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

  set_download();
  localStorage.saveData = uxdatafield;
};

const showHelp = () => {
  $("help").style.top = "50%";
  $("help").style.transform = "translateX(-50%) translateY(-50%)";
};

const hideHelp = () => {
  $("help").style.top = "calc(0% - 2px)";
  $("help").style.transform = "translateX(-50%) translateY(-100%)";
};

const set_download = () => {
  let docData = $("editing").value;
  let dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(docData);
  $("download_button").setAttribute("href", dataStr);
  $("download_button").setAttribute("download", "markup.md");
};

window.addEventListener("popstate", function () {
  render();
});

window.onload = () => {
  window.currentRoute = "root";

  if (localStorage.saveData !== undefined) {
    $("editing").innerHTML = localStorage.saveData;
  } else {
    $("editing").innerHTML = `/root
# Welcome Screen
Welcome to my app!
[Sign up with Email](#email)
[Sign up with Google](#google)

/email
# Sign in with Email
|Data entry|
|---|
|Name field|
|Email field|
---
[Fill information](#email_filled)
[Cancel](#root)

/email_filled
# Sign in with email
|Data entry|
|---|
|Dorothy Gale|
|dorothy @ emerald.so|
---
[Submit information](#success)
[Cancel](#root)

/google
# Sign up with google
List of your google accounts
[dorothy@emerald.so](#success)
[dorothy@with.so](#success)
[Cancel](#root)

/success
# Welcome back, Dorothy!
You are now logged in and you do whatever you want!
[Sign out](#root)`;
  }

  $("editing").addEventListener("input", function (event) {
    render();
  });

  $("upload_markdown").addEventListener("change", function (event) {
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.readAsText(event.target.files[0]);
      reader.onload = function (event) {
        var file_data = event.target.result;
        $("editing").value = file_data;

        $("upload_button").classList.remove("flash");

        setTimeout(function () {
          $("upload_button").classList.add("flash");
        }, 1);

        // console.log(file_data);
        // setJson(file_json);
        render();
      };
    }
  });

  render();
};
