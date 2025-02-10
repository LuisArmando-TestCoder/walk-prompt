#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net --allow-env

import { walk } from "https://deno.land/std@0.203.0/fs/walk.ts";

/**
 * Calls the ChatGPT API (model "gpt-4o") with the provided prompt.
 * Returns the text content from the API response.
 */
async function callChatGPT(
  promptText: string,
  apiKey: string
): Promise<string> {
  const url = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  const payload = {
    model: "gpt-4o",
    messages: [{ role: "user", content: promptText }],
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API call failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  // Extract and return the content from the API response.
  return data.choices[0].message.content;
}

async function main() {
  // 1. Ask for an absolute (or relative) directory path.
  const inputPath = prompt(
    "Enter the absolute (or relative) path of the directory:"
  )?.trim();
  if (!inputPath) {
    console.error("No directory provided.");
    Deno.exit(1);
  }
  // Resolve to an absolute path if necessary.
  let directory = inputPath;
  if (!inputPath.startsWith("/")) {
    directory = `${Deno.cwd()}/${inputPath}`;
  }
  try {
    const stat = await Deno.stat(directory);
    if (!stat.isDirectory) {
      console.error("The provided path is not a directory.");
      Deno.exit(1);
    }
  } catch {
    console.error("The directory does not exist.");
    Deno.exit(1);
  }

  // 2. Ask for a search regex.
  const regexInput = prompt("Enter the search regex:")?.trim();
  if (!regexInput) {
    console.error("No regex provided.");
    Deno.exit(1);
  }
  let regex: RegExp;
  try {
    regex = new RegExp(regexInput);
  } catch (error) {
    console.error("Invalid regex pattern:", error);
    Deno.exit(1);
  }

  // 3. Ask for a prompt.
  const userPrompt = prompt(
    "Enter your prompt (use {file_content} as a placeholder if desired):"
  )?.trim();
  if (!userPrompt) {
    console.error("No prompt provided.");
    Deno.exit(1);
  }

  // 4. Get API key from environment variable, or ask the user.
  let apiKey = Deno.env.get("API_KEY");
  if (!apiKey) {
    apiKey = prompt("Enter your API key:")?.trim();
    if (!apiKey) {
      console.error("No API key provided.");
      Deno.exit(1);
    }
  }

  // 5. Walk through the directory and collect matching files.
  const matchingFiles: string[] = [];
  for await (const entry of walk(directory, {
    includeFiles: true,
    includeDirs: false,
  })) {
    if (regex.test(entry.path)) {
      matchingFiles.push(entry.path);
    }
  }

  if (matchingFiles.length === 0) {
    console.log("No files matching the regex were found.");
    return;
  }

  console.log(`Found ${matchingFiles.length} matching file(s):`);
  for (const file of matchingFiles) {
    console.log(file);
  }

  // 6. Process each matching file.
  for (const filePath of matchingFiles) {
    console.log(`\nProcessing file: ${filePath}`);
    let fileContent: string;
    try {
      fileContent = await Deno.readTextFile(filePath);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      continue;
    }

    // Prepare the final prompt.
    let finalPrompt: string;
    if (userPrompt.includes("{file_content}")) {
      finalPrompt = userPrompt.replace("{file_content}", fileContent);
    } else {
      finalPrompt = `${userPrompt}\n\nFile content:\n${fileContent}`;
    }

    // Call the ChatGPT API to get the updated content.
    let newContent: string;
    try {
      newContent = await callChatGPT(finalPrompt, apiKey);
    } catch (error) {
      console.error(`API call failed for file ${filePath}:`, error);
      continue;
    }

    // Replace the file content with the API response.
    try {
      await Deno.writeTextFile(filePath, newContent);
      console.log(`Updated file: ${filePath}`);
    } catch (error) {
      console.error(`Error writing to file ${filePath}:`, error);
    }
  }
}

main();
