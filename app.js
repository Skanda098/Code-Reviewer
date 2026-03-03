document.getElementById('submitBtn').addEventListener('click', async () => {
    const codeText = document.getElementById('codeInput').value;
    const outputArea = document.getElementById('outputArea');
    const statusLabel = document.getElementById('statusLabel');
    const copyBtn = document.getElementById('copyBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Safety check: Don't run if empty
    if (!codeText.trim()) return;

    // UI Loading State
    submitBtn.innerText = "TRANSLATING...";
    statusLabel.innerHTML = '<span class="animate-pulse text-emerald-500">Processing...</span>';
    outputArea.value = "";
    copyBtn.classList.add('hidden'); // Hide copy button while loading

    try {
        const response = await fetch('http://127.0.0.1:8000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: 'java', code: codeText })
        });

        const data = await response.json();
        
        if (data.status === "success") {
            // Put the translated code exactly into the output box
            outputArea.value = data.translated_code;
            statusLabel.innerHTML = '<span class="text-emerald-500">Translation Complete</span>';
            copyBtn.classList.remove('hidden'); // Show copy button
        } else {
            outputArea.value = "Error: " + data.message;
            statusLabel.innerHTML = '<span class="text-rose-500">Failed</span>';
        }

    } catch (error) {
        outputArea.value = "Error connecting to backend.\nEnsure Python server is running.";
        statusLabel.innerHTML = '<span class="text-rose-500">Connection Failed</span>';
    } finally {
        // Reset button text
        submitBtn.innerText = "Translate Comments";
    }
});

// --- Copy to Clipboard Feature ---
document.getElementById('copyBtn').addEventListener('click', () => {
    const outputArea = document.getElementById('outputArea');
    
    // Select the text and copy it to the user's clipboard
    outputArea.select();
    navigator.clipboard.writeText(outputArea.value);
    
    // Give visual feedback
    const originalText = copyBtn.innerText;
    copyBtn.innerText = "[ COPIED! ]";
    copyBtn.classList.replace('text-zinc-500', 'text-emerald-400');
    
    // Reset button after 2 seconds
    setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.classList.replace('text-emerald-400', 'text-zinc-500');
    }, 2000);
});