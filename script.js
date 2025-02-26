const scriptURL = 'https://script.google.com/macros/s/AKfycbwrSNjMaDqpuGVTrwllZfZbNwD8U6SZy2K1wjSxj4HN/exec';

// Form Submission for Registration
document.getElementById('bookingForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = { 
        name: e.target.name.value, 
        email: e.target.email.value, 
        phone: e.target.phone.value 
    };
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
        console.log('Submitting form data:', formData);
        const saveResponse = await fetch(scriptURL, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(formData) 
        });
        if (!saveResponse.ok) throw new Error('Network response was not ok');
        const saveData = await saveResponse.json();
        console.log('Server response:', saveData);

        // Submit to Formspree (optional)
        await fetch('https://formspree.io/f/mqaevnqz', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ ...formData, serial: saveData.serial, event: "ROCK ON CHITTAGONG 2025" }) 
        });

        alert(`Registration Successful! Your Serial Number: ${saveData.serial}`);
        window.location.href = '/';
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting form! Please try again.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Confirm Registration';
    }
});

// Ticket Verification Function
async function checkTicket() {
    const serial = document.getElementById('serialNumber').value;
    const resultDiv = document.getElementById('verificationResult');
    if (!serial) { 
        resultDiv.innerHTML = "Please enter a serial number"; 
        return; 
    }
    try {
        const response = await fetch(`${scriptURL}?serial=${serial}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        resultDiv.innerHTML = data.valid ? 
            `✅ Valid Ticket!<br>Name: ${data.name}<br>Email: ${data.email}` : 
            "❌ Invalid Ticket Number";
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = "Error checking ticket. Please try again.";
    }
}
