import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const dataPath = path.join(process.cwd(), "data", "datasets.json");

router.get("/dashboard", (req, res) => {
  fs.readFile(dataPath, "utf8", (err, jsonData) => {
    if (err)
      return res.status(500).json({ error: "Unable to read datasets.json" });

    const datasets = JSON.parse(jsonData);
    const predictionDistribution = Object.entries(datasets).map(
      ([name, meta]) => ({
        name,
        value: meta.size,
      })
    );

    const response = {
      totalPredictions: 10000,
      accuracy: 91.5,
      activeUsers: 240,
      predictionDistribution,
      performanceOverTime: [
        { date: "2025-01", accuracy: 88.5, precision: 87.5, recall: 86.0 },
        { date: "2025-02", accuracy: 91.5, precision: 90.0, recall: 89.0 },
      ],
      featureImportance: [
        { name: "feature1", value: 35 },
        { name: "feature2", value: 40 },
        { name: "feature3", value: 25 },
      ],
    };

    res.json(response);
  });
});

router.get("/model-details", (req, res) => {
  res.json({
    name: "Dummy ML Model",
    version: "1.0.0",
    type: "Classification",
    created_date: "2025-04-01",
    training_data_size: 11500,
    accuracy: 91.5,
    precision: 90.0,
    recall: 89.0,
    f1_score: 89.5,
    features: [
      {
        name: "feature1",
        importance: 0.35,
        description: "Feature 1 description",
      },
      {
        name: "feature2",
        importance: 0.4,
        description: "Feature 2 description",
      },
      {
        name: "feature3",
        importance: 0.25,
        description: "Feature 3 description",
      },
    ],
  });
});

router.post("/predict", (req, res) => {
  console.log("🔥 Incoming request body:", req.body);
  const { smiles, properties } = req.body;
  const normalizedSmiles = smiles.trim().toUpperCase();
  console.log(normalizedSmiles);
  fs.readFile(dataPath, "utf8", (err, jsonData) => {
    if (err)
      return res.status(500).json({ error: "Unable to read datasets.json" });

    const allData = JSON.parse(jsonData);
    const result = allData[normalizedSmiles];

    if (!result) {
      return res
        .status(404)
        .json({ error: `No data found for SMILES: ${smiles}` });
    }

    const formatted = {};
    for (const prop of properties) {
      const value = result[prop] ?? "N/A";
      formatted[prop] = {
        value,
        confidence: Math.floor(Math.random() * 21) + 80,
        explanation: `Mock prediction for ${prop}`,
      };
    }

    res.json({
      drug_name: smiles,
      predictions: formatted,
    });
  });
});

export default router;
