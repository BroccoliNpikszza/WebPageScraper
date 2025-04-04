const express = require("express");
const { spawn } = require("child_process");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: true,
};

app.use(express.json());
app.use(cors(corsOptions));

function getPythonData(url, script, tags, classes, id, callback) {
  const args = [script, "--url", url];

  if (tags) {
    args.push("--tag", tags);
  }
  if (classes) {
    args.push("--classes", classes);
  }
  if (id) {
    args.push("--id", id);
  }

  const pythonProcess = spawn("python3", args);

  let dataFromPy = "";

  pythonProcess.stdout.on("data", (data) => {
    dataFromPy += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python error: ${data}`);
  });

  pythonProcess.on("close", (exitCode) => {
    if (exitCode !== 0) {
      console.log("Python script failed :{");
    }
    callback(dataFromPy);
  });
}

app.post("/", (req, res) => {
  const { url, tags, classes, id } = req.body;
  console.log("Incoming request body:", req.body);

  getPythonData(url, "src/seleniumScraper.py", tags, classes, id, (data) => {
    try {
      const parsedData = JSON.parse(data); // from Python script
      console.log(parsedData)
      res.json(parsedData);
    } catch (e) {
      console.error("Error parsing Python output as JSON:", e);
      res.status(500).send("Failed to parse scraped data");
    }
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000...");
});
