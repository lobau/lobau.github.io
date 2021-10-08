const $ = (el) => {
  return document.getElementById(el);
};

const render = () => {
    // Grab the route from the URL
    let route = window.location.hash.substr(1);
    if(route === "") {
        route = "root";
    }

    // Grab the current markdown
    let uxdatafield = $("markdown_code").value;
    let uxdataraw = uxdatafield.slice(1);
    let uxdata = uxdataraw.split("\n/"); //cut each state
    
    // Generate the data object
    let data = {};
    for (let i = 0; i < uxdata.length; i++) {
      let lines = uxdata[i].split(/\r?\n/);
      let slug = lines.shift();
      let body = lines.join("\n");
      let bodyHtml = marked(body);
      data[slug] = bodyHtml;
    }

    if(data[route] === undefined) {
        $("render_preview").innerHTML = `
        <div class="card main error">
        <h1>${route}</h1>
        <p>
            State doesn't exist yet.
            <a href="javascript:window.history.back()">Back</a>
        </p>
        `;
    } else {
        $("render_preview").innerHTML = `
        <div class="card main">
        ${data[route]}
        </div>
        `;
    }
    
}

window.addEventListener('popstate', function() {
    render();
});

window.onload = () => {
    window.currentRoute = "root";

    $("markdown_code").addEventListener("input", function (event) {
        render();
    });

    render();
}
