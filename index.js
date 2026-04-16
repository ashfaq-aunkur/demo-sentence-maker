const express = require("express");
const { exec, execFile } = require("child_process");

const app = express();
const PORT = 3000;

// Optional: allow JSON body
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/make-sentence", async (req, res) => {
  const activityObject = req.body;

  if (!activityObject || typeof activityObject !== "object") {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid object in request body",
    });
  }

  execFile(
    "python",
    ["sentence-maker.py", JSON.stringify(activityObject)],
    (error, stdout, stderr) => {
      if (error) {
        console.error("Error:", error);
        return res
          .status(500)
          .json({ success: false, message: "Failed to make sentences" });
      }

      res.json({
        success: true,
        input: activityObject,
        sentence: stdout.trim(),
      });
    },
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
