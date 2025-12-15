const http = require("http");
const fs = require("fs");

http.get("http://localhost:4000/api/v1/demo-feedback", (resp) => {
    let data = "";

    resp.on("data", (chunk) => {
        data += chunk;
    });

    resp.on("end", () => {
        fs.writeFileSync("api_response.json", data);
        console.log("Data written to api_response.json");
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
