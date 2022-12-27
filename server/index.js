const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { generateFile } = require("./GenerateFile.js");
const { executeCpp } = require("./ExecuteCpp.js");
const { executePy } = require("./ExecutePy.js");
const Job = require("./models/Job.js");
const fetch = require("./fetchCode.js");

require("dotenv").config();

mongoose.set("strictQuery", false);
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_DATABASE}.8yhgxmf.mongodb.net/?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) {
            console.log(err);
            process.exit(1);
        } else {
            console.log("Connected to Database - codemania");
        }
    }
);

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    return res.json({
        Name: "Kartik Mehta",
        Website: "www.kartikmehta.xyz",
        Twitter: "kartik_mehta8",
        GitHub: "kartikmehta8",
    });
});

app.post("/run", async (req, res) => {
    const { language = "cpp", code } = req.body;

    if (code === undefined) {
        return res
            .status(400)
            .json({ success: false, error: "Empty Code Body!" });
    }

    let job;

    try {
        const filepath = await generateFile(language, code);

        job = await new Job({ language, filepath }).save();
        const jobId = job["_id"];

        res.status(201).json({ success: true, jobId });

        let output;

        job["startedAt"] = new Date();

        if (language === "cpp" || language === "c") {
            output = await executeCpp(filepath);
        } else {
            output = await executePy(filepath);
        }

        job["completeAt"] = new Date();
        job["status"] = "success";
        job["output"] = output;

        await job.save();
    } catch (err) {
        job["completeAt"] = new Date();
        job["status"] = "error";
        job["output"] = JSON.stringify(err);
        await job.save();
    }
});

app.get("/status", async (req, res) => {
    const jobId = req.query.id;

    if (!jobId) {
        return res.status(400).json({ success: false, error: "ID not found!" });
    }

    try {
        const job = await Job.findById(jobId);

        if (job === undefined) {
            return res
                .status(404)
                .json({ success: false, error: "Invalid Job ID!" });
        }

        return res.status(200).json({ success: true, job });
    } catch (err) {
        return res
            .status(400)
            .json({ success: false, error: JSON.stringify(err) });
    }
});

app.post("/openai", (req, res) => {
    let { body } = req;
    let code;
    fetch(body.data)
        .then((resData) => {
            code = resData.data.choices[0];
            res.send(JSON.stringify(code));
            res.end();
        })
        .catch((err) => console.log(err));
});

app.listen(5000, () => {
    console.log("Listening on base URL - http://localhost:5000");
});
