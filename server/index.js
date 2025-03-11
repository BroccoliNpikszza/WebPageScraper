const express = require("express");
const {spawn} = require("child_process");
const app = express();

/*
 * getPythonData gets url, and returns a callback, which returns the data once the process is complete
 * param1: a srting of url to scrape
 * param2: callback that waits for pyhthon process to complete 
 * callback: returns stdout from python as a string
*/
function getPythonData(url, callback){
  const pythonProcess = spawn("python3",["src/scraper.py", url]);
  let dataFromPy = "";
  //in case of read
  pythonProcess.stdout.on("data",(data)=>{
    dataFromPy += data.toString();
  });
  //in case of err
  pythonProcess.stderr.on("data",(data)=>{
    console.error(`Python error: ${data}`);
  });

  //after exit
  pythonProcess.on("close",(exitCode)=>{
    if (exitCode!==0){
      console.log("Python script failed :{")
    }
    callback(dataFromPy);
  })
}

app.get("/",(req,res)=>{
  const url = "https://news.ycombinator.com/news";
  getPythonData(url,(data)=>{
    res.send(data);
  });
})

app.listen(3000,()=>{
  console.log("Server running on port 3000...");
})
