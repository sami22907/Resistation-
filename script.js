const scriptURL = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Audiowide&family=Roboto&display=swap';

document.getElementById('bookingForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = { name: e.target.name.value, email: e.target.email.value, phone: e.target.phone.value };
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    try {
        const saveResponse = await fetch(scriptURL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        const saveData = await saveResponse.json();
        await fetch('https://formspree.io/f/mqaevnqz', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, serial: saveData.serial, event: "ROCK ON CHITTAGONG 2025" }) });
        alert(`Registration Successful! Your Serial Number: ${saveData.serial}`);
        window.location.href = '/';
    } catch (error) {
        alert('Error submitting form! Please try again.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Confirm Registration';
    }
});

async function checkTicket() {
    const serial = document.getElementById('serialNumber').value;
    const resultDiv = document.getElementById('verificationResult');
    if (!serial) { resultDiv.innerHTML = "Please enter a serial number"; return; }
    try {
        const response = await fetch(`${scriptURL}?serial=${serial}`);
        const data = await response.json();
        resultDiv.innerHTML = data.valid ? `✅ Valid Ticket!<br>Name: ${data.name}<br>Email: ${data.email}` : "❌ Invalid Ticket Number";
    } catch (error) {
        resultDiv.innerHTML = "Error checking ticket. Please try again.";
    }
}
