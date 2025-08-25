// src/aos_ado_demo.ts

import fetch from "node-fetch";

// aOS API Example
const AOS_API_URL = "https://api.andromedaprotocol.io/v1/tokenomics/history?limit=1";

// ADO (Azure DevOps) Settings and API call
const ADO_ORG_URL = "https://dev.azure.com/myorganization";
const ADO_PAT = "abc123xyzPAT"; // Apni actual PAT yahan daalein

async function getAosData() {
  try {
    const response = await fetch(AOS_API_URL);
    if (!response.ok) {
      throw new Error(`aOS API error: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("aOS data:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch aOS data:", error);
  }
}

async function createAdoIssue() {
  const url = `${ADO_ORG_URL}/_apis/projects?api-version=7.0`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: "Basic " + Buffer.from(":" + ADO_PAT).toString("base64"),
      },
    });
    if (!response.ok) {
      throw new Error(`ADO API error: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("ADO projects data:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch ADO data:", error);
  }
}

async function demo() {
  console.log("Starting demo aOS and ADO integration...");

  const aosData = await getAosData(); // aOS API call
  const adoData = await createAdoIssue(); // ADO API call

  console.log("Demo finished");
}

demo();
