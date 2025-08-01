# PowerShell ObDefuscator

[![Dockerized](https://img.shields.io/badge/Dockerized-✅-blue)](https://www.docker.com/)
[![Made with PowerShell](https://img.shields.io/badge/Made%20with-PowerShell-012456?logo=powershell&logoColor=white)](https://docs.microsoft.com/en-us/powershell/)
[![AI-Enabled](https://img.shields.io/badge/AI%20Mode-OpenRouter.ai-blueviolet?logo=openai)](https://openrouter.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Issues](https://img.shields.io/github/issues/Acorzo1983/PowerShell_ObDefuscator)](https://github.com/Acorzo1983/PowerShell_ObDefuscator/issues)
[![Stars](https://img.shields.io/github/stars/Acorzo1983/PowerShell_ObDefuscator?style=social)](https://github.com/Acorzo1983/PowerShell_ObDefuscator/stargazers)

---

An advanced, AI-powered toolkit for obfuscating and deobfuscating PowerShell scripts. Designed for red teamers, blue teamers, and security researchers to aid in creating evasive payloads and analyzing malicious code.

## Features
🚀 Dual Mode Operation: Choose between a fast, offline Local Mode for rule-based tasks or a powerful AI Mode for advanced, context-aware operations.

🧠 Powerful AI Engine: AI Mode connects to the OpenRouter.ai service, giving you access to dozens of state-of-the-art models (like GPT-4o, Claude 3.5 Sonnet, Codestral, and Llama 3) through a single API key.

🔒 Local-First & Offline Capable: The default Local Mode works entirely in your browser with no external network requests, ensuring speed and privacy.

🎛️ Granular Obfuscation Control: Fine-tune your payloads by selecting the obfuscation level (from Low to Insane) and specific techniques like lexical, encoding, semantic, and junk code injection.

🔍 Detailed Analysis Reports: The deobfuscator provides a rich, structured report including a threat level assessment, a summary of the script's intent, a list of malicious indicators, and a step-by-step execution analysis.

🐳 Dockerized & Self-Contained: The entire application is packaged in a single Docker container for easy, one-command deployment.

---

## Getting Started
This application is designed to be run with Docker.

### Prerequisites
You must have Docker installed and running on your system.

### Step 1: Clone the Repository
```bash
git clone https://github.com/Acorzo1983/PowerShell_ObDefuscator.git
```
```bash
cd PowerShell_ObDefuscator
```

### Step 2: Build the Docker Image
From the root directory of the project, run the docker build command. This will create a self-contained image named powershell-obdefuscator.
```bash
sudo docker build -t powershell-obdefuscator .
```
### Step 3: Run the Docker Container
Once the image is built, run it as a container. This command will start the application in the background and map it to your chosen port (e.g., 6969). For persistent use, run it like this:
```bash
sudo docker run -d -p 6969:80 --name ps-obdefuscator powershell-obdefuscator
```
Tip: For temporary test runs, you can add the --rm flag to automatically delete the container when it's stopped.

### Step 4: Access the Application
The application is now running. To use it, open your web browser and navigate to:

http://localhost:6969

---

## Configuration (AI Mode)
Click the gear icon (⚙️) in the top-right corner to open the Settings panel.

Switch the Mode to AI (Online).

Paste your OpenRouter API Key into the input field.

Click the "Test Key" button to validate your key.

Once the key is validated, select your desired AI models from the dropdown menus.

Click "Save Settings".

---

## Credits
Created with ❤️ by @I_Am_Jakoby & @yz9yt.

---

## Legal Disclaimer
This tool is created for educational, research, and authorized security testing purposes only. The creators take no responsibility for any malicious use of this tool or its output. Always ensure you have explicit, authorized permission before executing any scripts on a target system.
