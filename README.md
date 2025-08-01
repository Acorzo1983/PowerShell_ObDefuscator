# PowerShell ObDefuscator

An AI-enhanced and local-first toolkit for obfuscating and deobfuscating PowerShell scripts. This tool is designed for penetration testers, red teamers, and blue teamers to aid in creating evasive scripts and analyzing suspicious ones.

![Screenshot](https://user-images.githubusercontent.com/1259731/189495007-8575a7a7-33d3-463e-9f37-67253503a749.png)

## Features

- **Local-First Operation:** Works out-of-the-box in an offline "Local Mode" with a built-in JavaScript engine for fast, autonomous obfuscation and best-effort deobfuscation.
- **Powerful AI Mode:** Can be upgraded to AI Mode using the [OpenRouter.ai](https://openrouter.ai) service, giving you access to dozens of state-of-the-art models (like GPT-4o, Claude 3, Gemini, Codestral) through a single API key.
- **In-App Configuration:** No `.env` or config files needed. All settings are managed through a secure, in-app settings panel.
- **Flexible API Key Handling:** Your API key is stored only for the session by default. You can optionally choose to persist the key in your browser's local storage for convenience.
- **Flexible Obfuscator & Deobfuscator:** Features multiple complexity levels, granular technique control, and one-click reverse shell payload wrapping.
- **Docker Support:** Ready to be built and deployed as a self-contained Docker container.

---

## How It Works

The tool operates in one of two modes, which you can set in the in-app settings panel.

### Local Mode (Default)
The application starts in this mode. It uses a built-in JavaScript engine to perform all tasks and does not make any external network requests.
- **Pros:** Works completely offline, is extremely fast, and requires no configuration.
- **Cons:** The obfuscation and deobfuscation are based on pre-defined rules. It is less "intelligent" than the AI and may not be able to analyze or create highly advanced, novel techniques.

### AI Mode
By providing an OpenRouter API key, you unlock AI Mode. All obfuscation and deobfuscation tasks are sent to the AI model you select.
- **Pros:** Extremely powerful and context-aware. Can generate highly complex, layered obfuscation and provide deep, human-like analysis of unknown scripts using world-class models.
- **Cons:** Requires an active internet connection and a valid OpenRouter API key.

---

## Configuration

Configuration is handled entirely within the application.

1.  Click the **gear icon** (⚙️) in the top-right corner to open the Settings panel.
2.  Enable the **AI Mode** switch.
3.  Paste your **OpenRouter API Key** into the input field. You can get a key from [https://openrouter.ai](https://openrouter.ai).
4.  Select your desired **AI Model** from the dropdown. The list includes many powerful code-focused models.
5.  (Optional) Check the **"Persist API Key"** box if you want the key to be saved in your browser for future visits. Leave it unchecked to have the key automatically deleted when you close the browser tab.
6.  Click **"Save Settings"**.

---

## Getting Started

### Option 1: Running Locally (No Dependencies)

Because this project uses no build tools, you can run it directly. You may need to serve the files from a simple local web server to handle module imports correctly due to browser security policies (CORS).

1.  Clone the repository.
2.  A quick way to serve the files is with Python:

    ```bash
    # From the project's root directory:
    python3 -m http.server
    
    # Then open http://localhost:8000 in your browser.
    ```

### Option 2: Running with Docker

This is the recommended way to run the application.

1.  **Clone the repository.**
2.  **Build the Docker image:**

    ```bash
    docker build -t powershell-obdefuscator .
    ```

3.  **Run the Docker container:**

    ```bash
    docker run -p 8080:80 -d --name ps-obdefuscator powershell-obdefuscator
    ```

4.  **Access the application** by navigating to `http://localhost:8080` in your web browser and configure it using the in-app settings panel.

---

## Legal Disclaimer

This tool is created for educational and learning purposes only. The creators take no responsibility for any malicious use of this tool or its output. Always ensure you have explicit, authorized permission before executing any scripts on a target system.