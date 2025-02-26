const scriptURL = 'https://script.google.com/macros/s/AKfycbwrSNjMaDqpuGVTrwllZfZbNwD8U6SZy2K1wjSxj4HN/exec';

// Form Submission
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
          // Save to Google Sheets
          const saveResponse = await fetch(scriptURL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
          });
          const saveData = await saveResponse.json();
          
          // Send email via Formspree
          await fetch('https://formspree.io/f/mqaevnqz', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  ...formData,
                  serial: saveData.serial,
                  event: "ROCK ON CHITTAGONG 2025"
              })
          });

          alert(`Registration Successful! Your Serial Number: ${saveData.serial}`);
          window.location.href = '/';
      } catch (error) {
          alert('Error submitting form! Please try again.');
      } finally {
          submitButton.disabled = false;
          submitButton.textContent = 'Confirm Registration';
      }
  });

        alert(`Registration Successful! Your Serial Number: ${saveData.serial}`);
        window.location.href = '/';
    } catch (error) {
        alert('Error submitting form! Please try again.');
    }
});

// Ticket Verification
async function checkTicket() {
    const serial = document.getElementById('serialNumber').value;
    const resultDiv = document.getElementById('verificationResult');
    
    if(!serial) {
        resultDiv.innerHTML = "Please enter a serial number";
        return;
    }

    try {
        const response = await fetch(`${scriptURL}?serial=${serial}`);
        const data = await response.json();
        
        if(data.valid) {
            resultDiv.innerHTML = `✅ Valid Ticket!<br>Name: ${data.name}<br>Email: ${data.email}`;
        } else {
            resultDiv.innerHTML = "❌ Invalid Ticket Number";
        }
    } catch (error) {
        resultDiv.innerHTML = "Error checking ticket. Please try again.";
    }
}
