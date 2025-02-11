# Walk Prompt

This Deno script scans a specified directory for files that match a user-defined regex pattern, reads their content, sends it to OpenAI's GPT-4o API using a custom prompt, and replaces the file's content with the API response. It can also be installed as a global command for easier access.

## Features

- **Recursive Directory Search**: Scans all files in a given directory.
- **Regex-Based Filtering**: Selects files based on a user-defined regular expression.
- **Custom Prompting**: Allows inserting file content into an AI prompt using `{file_content}`.
- **ChatGPT API Integration**: Calls OpenAI's `gpt-4o` model for content processing.
- **Automated File Updates**: Replaces original file content with AI-generated text.

## Prerequisites

- **[Deno](https://deno.land/)**
- **OpenAI API Key** (can be set as an environment variable `API_KEY`)

## Installation

### Install as a Global Command

To install this script globally so it can be accessed from anywhere, run:

```sh
deno install --global --allow-read --allow-write --allow-net --allow-env -f --name wp ./walk-prompt.ts
```

Now you can run `wp` from any terminal window.

### Add Deno's Bin Directory to Your PATH

After installing, you need to make sure your terminal knows where to find the `wp` command. The installation process places the executable in a folder (by default, `C:\Users\<YourUsername>\.deno\bin` on Windows). Follow the instructions for your operating system:

#### **Windows**

- **Temporary (current session only):**

  Open PowerShell or Command Prompt and run:

  ```powershell
  $env:PATH += ";C:\Users\<YourUsername>\.deno\bin"
  ```

  or

  ```sh
  set PATH=%PATH%;C:\Users\<YourUsername>\.deno\bin
  ```

  Replace `<YourUsername>` with your actual Windows username.

- **Permanent:**

  1. Open the **Start Menu**, search for **"Environment Variables"**, and select **"Edit the system environment variables"**.
  2. In the **System Properties** window, click **"Environment Variables..."**.
  3. Under **User variables** (or **System variables** if you want it for all users), find and select **PATH**, then click **Edit**.
  4. Click **New** and add:
     ```
     C:\Users\<YourUsername>\.deno\bin
     ```
  5. Click **OK** to close all dialogs.
  6. Restart your terminal to apply the changes.

#### **macOS / Linux**

- Open your shell configuration file (e.g., `~/.bashrc`, `~/.zshrc`, or `~/.profile`) and add the following line:
  ```sh
  export PATH="$HOME/.deno/bin:$PATH"
  ```
- Save the file and then source it (or restart your terminal):
  ```sh
  source ~/.bashrc  # or the relevant file
  ```

Once the PATH is correctly set, you can run `wp` from any terminal window.

- Restart your terminal to apply the changes.

## Usage

Run the script with appropriate permissions:

```sh
wp
```

Or, if running without global installation:

```sh
deno run --allow-read --allow-write --allow-net --allow-env wp.ts
```

### Input Steps

1. **Enter the absolute or relative path** of the directory to scan.
2. **Provide a regex pattern** to filter the files.
3. **Define a prompt** (use `{file_content}` as a placeholder for file content).
4. **Enter OpenAI API key** (if not set in `API_KEY` environment variable).
5. **Processing begins**: The script reads, processes, and updates the matching files.

### Example Usage

Suppose you have a directory `./documents` with `.md` files. Running the script:

- **Directory**: `./documents`
- **Regex**: `.*\.md$`
- **Prompt**:  
  ```
  Improve the writing style of the following text:
  {file_content}
  ```

This will process all Markdown files inside `./documents`, sending their content to OpenAI for refinement and replacing them with the improved text.

## OpenAI API Configuration

This script uses OpenAI’s GPT-4o API. Ensure your API key is set:

- Via Environment Variable:
  ```sh
  export API_KEY=your_openai_api_key
  ```
- Or enter it manually when prompted.

## Permissions

Deno requires explicit permissions to access files and the network:

- `--allow-read` - Reads files in the directory.
- `--allow-write` - Overwrites files after processing.
- `--allow-net` - Calls OpenAI API.
- `--allow-env` - Reads API key from environment variables.

## Important Notes

- **Backup your files** before running, as content will be overwritten.
- **API costs apply**—check OpenAI's pricing and limits.
- **Regex filtering** ensures only selected files are processed.

## License

This project is licensed under the MIT License.

---
### Author: LA-TestCoder Oriens  
GitHub: [LuisArmando-TestCoder](https://github.com/LuisArmando-TestCoder)

