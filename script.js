document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('booking-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        
        // Simple validation
        if (!name || !email || !date || !time) {
            alert('Please fill in all fields');
            return;
        }
        
        // In a real application, you would send this data to a server
        // For now, we'll just show a success message
        alert(`Thank you, ${name}! Your booking for ${date} at ${time} has been received. We'll contact you shortly to confirm.`);
        
        // Reset form
        form.reset();
    });
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;
});