// Google Apps Script URL (আপনার স্ক্রিপ্ট URL দিয়ে প্রতিস্থাপন করুন)
const scriptURL = 'https://script.google.com/macros/s/AKfycbwrSNjMaDqpuGVTrwllZfZbNwD8U6SZy2K1wjSxj4HN/dev';

// ফর্ম সাবমিশন হ্যান্ডলার
document.getElementById('bookingForm')?.addEventListener('submit', async (e) => {
    e.preventDefault(); // ফর্মের ডিফল্ট সাবমিশন বন্ধ করুন

    // ফর্ম ডেটা সংগ্রহ করুন
    const formData = {
        name: e.target.name.value,
        email: e.target.email.value,
        phone: e.target.phone.value
    };

    // সাবমিট বাটন ডিজেবল করুন এবং লোডিং স্টেট দেখান
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
        // Google Apps Script-এ ডেটা সাবমিট করুন
        const saveResponse = await fetch(scriptURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        // রেসপন্স ডেটা পেতে
        const saveData = await saveResponse.json();

        // সিরিয়াল নম্বর দেখান এবং হোম পেজে রিডাইরেক্ট করুন
        alert(`Registration Successful! Your Serial Number: ${saveData.serial}`);
        window.location.href = '/'; // হোম পেজে রিডাইরেক্ট
    } catch (error) {
        // এরর হ্যান্ডলিং
        alert('Error submitting form! Please try again.');
    } finally {
        // সাবমিট বাটন আবার সক্রিয় করুন
        submitButton.disabled = false;
        submitButton.textContent = 'Confirm Registration';
    }
});

// টিকিট যাচাইকরণ ফাংশন
async function checkTicket() {
    const serial = document.getElementById('serialNumber').value; // সিরিয়াল নম্বর ইনপুট
    const resultDiv = document.getElementById('verificationResult'); // রেজাল্ট ডিভ

    // সিরিয়াল নম্বর চেক করুন
    if (!serial) {
        resultDiv.innerHTML = "Please enter a serial number";
        return;
    }

    try {
        // Google Apps Script-এ সিরিয়াল নম্বর যাচাই করুন
        const response = await fetch(`${scriptURL}?serial=${serial}`);
        const data = await response.json();

        // রেজাল্ট দেখান
        resultDiv.innerHTML = data.valid
            ? `✅ Valid Ticket!<br>Name: ${data.name}<br>Email: ${data.email}`
            : "❌ Invalid Ticket Number";
    } catch (error) {
        // এরর হ্যান্ডলিং
        resultDiv.innerHTML = "Error checking ticket. Please try again.";
    }
}
