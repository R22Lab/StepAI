document.addEventListener('DOMContentLoaded', function() {
    // Initialize Telegram Web App
    let tg = window.Telegram?.WebApp;
    
    // Expand the web app to full height
    if(tg) {
        tg.expand();
        tg.setHeaderColor('#3949ab');
        tg.setBackgroundColor('#f5f7fa');
        
        // Set up main button
        tg.MainButton.setText('Забронировать');
        tg.MainButton.show();
        
        // Add theme change listener
        tg.onEvent('themeChanged', function() {
            // Update header color if theme changes
            tg.setHeaderColor('#3949ab');
        });
    }

    const form = document.getElementById('booking-form');
    const overlay = document.getElementById('success-overlay');
    const closeOverlay = document.getElementById('close-overlay');
    const confirmationMessage = document.getElementById('confirmation-message');
    const submitBtn = document.getElementById('submit-btn');
    
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
                    showError(field, formGroup, errorElement, 'Имя должно содержать не менее 2 символов');
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
        
        // If using Telegram Web App, show alert
        if(window.Telegram?.WebApp) {
            window.Telegram.WebApp.showAlert(errorElement.textContent);
        }
    }
    
    function showSuccess(field, formGroup) {
        formGroup.classList.add('success');
        field.setAttribute('aria-invalid', 'false');
    }
    
    // Real-time validation with debouncing
    const debouncedValidation = {};
    function debounce(func, timeout = 500) {
        return (...args) => {
            const previousCall = debouncedValidation[func.name];
            if (previousCall) {
                clearTimeout(previousCall);
            }
            debouncedValidation[func.name] = setTimeout(() => func.apply(this, args), timeout);
        };
    }
    
    document.getElementById('name').addEventListener('input', debounce(function() {
        validateField('name', this.value);
    }, 500));
    
    document.getElementById('email').addEventListener('input', debounce(function() {
        validateField('email', this.value);
    }, 500));
    
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
            if(tg) {
                tg.MainButton.setText('Обработка...');
                tg.MainButton.disable();
            }
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Обработка...';
            submitBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                // Show success overlay
                confirmationMessage.textContent = `Спасибо, ${name}! Ваше бронирование на ${formatDate(date)} в ${formatTime(time)} получено. Мы свяжемся с вами в ближайшее время для подтверждения.`;
                overlay.classList.remove('hidden');
                
                // Reset form
                form.reset();
                
                // Remove validation classes
                document.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('error', 'success');
                });
                
                // Hide error messages
                document.querySelectorAll('.form-error-message').forEach(msg => {
                    msg.style.display = 'none';
                });
                
                // Remove loading state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                if(tg) {
                    tg.MainButton.setText('Забронировать');
                    tg.MainButton.enable();
                    
                    // Update main button to close the web app after booking
                    tg.MainButton.setText('Закрыть');
                    tg.MainButton.offClick(handleMainButtonClick);
                    tg.MainButton.onClick(() => {
                        tg.close();
                    });
                }
            }, 1000);
        }
    });
    
    // Handle main button click for Telegram
    function handleMainButtonClick() {
        form.dispatchEvent(new Event('submit'));
    }
    
    if(tg) {
        tg.MainButton.onClick(handleMainButtonClick);
    }
    
    // Close overlay
    closeOverlay.addEventListener('click', function() {
        overlay.classList.add('hidden');
        
        if(tg) {
            // Restore main button functionality
            tg.MainButton.setText('Забронировать');
            tg.MainButton.offClick(() => {
                tg.close();
            });
            tg.MainButton.onClick(handleMainButtonClick);
            tg.MainButton.enable();
        }
    });
    
    // Close overlay when clicking outside the content
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.classList.add('hidden');
            
            if(tg) {
                // Restore main button functionality
                tg.MainButton.setText('Забронировать');
                tg.MainButton.offClick(() => {
                    tg.close();
                });
                tg.MainButton.onClick(handleMainButtonClick);
                tg.MainButton.enable();
            }
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
        return `${hour}:${minutes}`;
    }
    
    // Add input field focus effects
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});