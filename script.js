document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('booking-form');
    const overlay = document.getElementById('success-overlay');
    const closeOverlay = document.getElementById('close-overlay');
    const confirmationMessage = document.getElementById('confirmation-message');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;
    
    // Set maximum date to 30 days from today
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    document.getElementById('date').max = maxDate.toISOString().split('T')[0];
    
    // Available times for the AI intensive
    const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    
    // Form validation functions
    function validateField(fieldId, value) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + '-error');
        const formGroup = field.closest('.form-group');
        
        // Reset classes
        formGroup.classList.remove('error', 'success');
        
        if (!value) {
            showError(field, formGroup, errorElement);
            return false;
        }
        
        // Specific validation for different fields
        switch(fieldId) {
            case 'name':
                if (value.trim().length < 2) {
                    showError(field, formGroup, errorElement, 'Name must be at least 2 characters');
                    return false;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showError(field, formGroup, errorElement);
                    return false;
                }
                break;
            case 'date':
                // Date is already validated by the browser for required field
                break;
            case 'time':
                if (!availableTimes.includes(value)) {
                    showError(field, formGroup, errorElement);
                    return false;
                }
                break;
        }
        
        showSuccess(field, formGroup);
        return true;
    }
    
    function showError(field, formGroup, errorElement, customMessage = null) {
        formGroup.classList.add('error');
        errorElement.style.display = 'block';
        if (customMessage) {
            errorElement.textContent = customMessage;
        }
        field.setAttribute('aria-invalid', 'true');
    }
    
    function showSuccess(field, formGroup) {
        formGroup.classList.add('success');
        field.setAttribute('aria-invalid', 'false');
    }
    
    // Real-time validation
    document.getElementById('name').addEventListener('blur', function() {
        validateField('name', this.value);
    });
    
    document.getElementById('email').addEventListener('blur', function() {
        validateField('email', this.value);
    });
    
    document.getElementById('date').addEventListener('change', function() {
        validateField('date', this.value);
    });
    
    document.getElementById('time').addEventListener('change', function() {
        validateField('time', this.value);
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        
        // Validate all fields
        const isNameValid = validateField('name', name);
        const isEmailValid = validateField('email', email);
        const isDateValid = validateField('date', date);
        const isTimeValid = validateField('time', time);
        
        if (isNameValid && isEmailValid && isDateValid && isTimeValid) {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                // Show success overlay
                confirmationMessage.textContent = `Thank you, ${name}! Your booking for ${formatDate(date)} at ${formatTime(time)} has been received. We'll contact you shortly to confirm.`;
                overlay.classList.remove('hidden');
                
                // Reset form
                form.reset();
                
                // Remove loading state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Remove validation classes
                document.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('error', 'success');
                });
                
                // Hide error messages
                document.querySelectorAll('.form-error-message').forEach(msg => {
                    msg.style.display = 'none';
                });
            }, 1000);
        }
    });
    
    // Close overlay
    closeOverlay.addEventListener('click', function() {
        overlay.classList.add('hidden');
    });
    
    // Close overlay when clicking outside the content
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.classList.add('hidden');
        }
    });
    
    // Format date for display (YYYY-MM-DD to Month DD, YYYY)
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Format time for display
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${period}`;
    }
});