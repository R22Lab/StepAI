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

    // Add ripple effect to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function(e) {
            // Remove any existing ripples
            this.querySelectorAll('.ripple').forEach(ripple => ripple.remove());
            
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            // Position ripple at click location
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size/2;
            const y = e.clientY - rect.top - size/2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            // Remove ripple after animation completes
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-in-up');
            }
        });
    }, observerOptions);

    // Observe sections for animation
    document.querySelectorAll('.intensive-info, .hero, .details, .booking').forEach(section => {
        observer.observe(section);
    });

    const form = document.getElementById('booking-form');
    const overlay = document.getElementById('success-overlay');
    const closeOverlay = document.getElementById('close-overlay');
    const saveToCalendarBtn = document.getElementById('save-to-calendar');
    const confirmationMessage = document.getElementById('confirmation-message');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.querySelector('.btn-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    // Progress bar elements
    const progressFill = document.getElementById('progress-fill');
    const nameLabel = document.getElementById('label-name');
    const emailLabel = document.getElementById('label-email');
    const dateLabel = document.getElementById('label-date');
    const timeLabel = document.getElementById('label-time');
    
    // Validation icons
    const nameValidIcon = document.getElementById('name-valid-icon');
    const nameInvalidIcon = document.getElementById('name-invalid-icon');
    const emailValidIcon = document.getElementById('email-valid-icon');
    const emailInvalidIcon = document.getElementById('email-invalid-icon');
    const dateValidIcon = document.getElementById('date-valid-icon');
    const dateInvalidIcon = document.getElementById('date-invalid-icon');
    const timeValidIcon = document.getElementById('time-valid-icon');
    const timeInvalidIcon = document.getElementById('time-invalid-icon');
    
    // Booking preview elements
    const bookingPreview = document.getElementById('booking-preview');
    const previewName = document.getElementById('preview-name');
    const previewEmail = document.getElementById('preview-email');
    const previewDate = document.getElementById('preview-date');
    const previewTime = document.getElementById('preview-time');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;
    
    // Set maximum date to 30 days from today
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    document.getElementById('date').max = maxDate.toISOString().split('T')[0];
    
    // Available times for the AI intensive
    const availableTimes = ['12:00', '13:00', '14:00', '15:00', '16:00'];
    
    // Populate time dropdown with available times
    const timeSelect = document.getElementById('time');
    timeSelect.innerHTML = '<option value="">Выберите время</option>';
    availableTimes.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
    });
    
    // Function to update progress bar
    function updateProgressBar() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        
        let completedFields = 0;
        let totalFields = 4;
        
        // Reset labels
        nameLabel.classList.remove('active');
        emailLabel.classList.remove('active');
        dateLabel.classList.remove('active');
        timeLabel.classList.remove('active');
        
        // Check each field and update progress
        if (name) {
            completedFields++;
            nameLabel.classList.add('active');
        }
        if (email) {
            completedFields++;
            emailLabel.classList.add('active');
        }
        if (date) {
            completedFields++;
            dateLabel.classList.add('active');
        }
        if (time) {
            completedFields++;
            timeLabel.classList.add('active');
        }
        
        // Calculate percentage
        const percentage = (completedFields / totalFields) * 100;
        progressFill.style.width = percentage + '%';
        
        // Update booking preview
        updateBookingPreview();
    }
    
    // Function to update booking preview
    function updateBookingPreview() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        
        // Update preview content
        previewName.textContent = name || '-';
        previewEmail.textContent = email || '-';
        previewDate.textContent = date ? formatDate(date) : '-';
        previewTime.textContent = time || '-';
        
        // Show preview if all fields are filled
        if (name && email && date && time) {
            bookingPreview.style.display = 'block';
        } else {
            bookingPreview.style.display = 'none';
        }
    }
    
    // Form validation functions
    function validateField(fieldId, value) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + '-error');
        const formGroup = field.closest('.form-group');
        
        // Get corresponding validation icons
        let validIcon, invalidIcon;
        switch(fieldId) {
            case 'name':
                validIcon = nameValidIcon;
                invalidIcon = nameInvalidIcon;
                break;
            case 'email':
                validIcon = emailValidIcon;
                invalidIcon = emailInvalidIcon;
                break;
            case 'date':
                validIcon = dateValidIcon;
                invalidIcon = dateInvalidIcon;
                break;
            case 'time':
                validIcon = timeValidIcon;
                invalidIcon = timeInvalidIcon;
                break;
        }
        
        // Reset classes
        formGroup.classList.remove('error', 'success');
        validIcon.classList.remove('valid');
        invalidIcon.classList.remove('invalid');
        
        if (!value) {
            showError(field, formGroup, errorElement, validIcon, invalidIcon);
            return false;
        }
        
        // Specific validation for different fields
        switch(fieldId) {
            case 'name':
                if (value.trim().length < 2) {
                    showError(field, formGroup, errorElement, validIcon, invalidIcon, 'Имя должно содержать не менее 2 символов');
                    return false;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showError(field, formGroup, errorElement, validIcon, invalidIcon);
                    return false;
                }
                break;
            case 'date':
                // Date is already validated by the browser for required field
                break;
            case 'time':
                if (!availableTimes.includes(value)) {
                    showError(field, formGroup, errorElement, validIcon, invalidIcon);
                    return false;
                }
                break;
        }
        
        showSuccess(field, formGroup, validIcon, invalidIcon);
        return true;
    }
    
    function showError(field, formGroup, errorElement, validIcon, invalidIcon, customMessage = null) {
        formGroup.classList.add('error');
        errorElement.style.display = 'block';
        if (validIcon) validIcon.classList.remove('valid');
        if (invalidIcon) invalidIcon.classList.add('invalid');
        if (customMessage) {
            errorElement.textContent = customMessage;
        }
        field.setAttribute('aria-invalid', 'true');
        
        // If using Telegram Web App, show alert
        if(window.Telegram?.WebApp) {
            window.Telegram.WebApp.showAlert(errorElement.textContent);
        }
    }
    
    function showSuccess(field, formGroup, validIcon, invalidIcon) {
        formGroup.classList.add('success');
        if (invalidIcon) invalidIcon.classList.remove('invalid');
        if (validIcon) validIcon.classList.add('valid');
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
        updateProgressBar();
    }, 500));
    
    document.getElementById('email').addEventListener('input', debounce(function() {
        validateField('email', this.value);
        updateProgressBar();
    }, 500));
    
    document.getElementById('date').addEventListener('change', function() {
        validateField('date', this.value);
        updateProgressBar();
    });
    
    document.getElementById('time').addEventListener('change', function() {
        validateField('time', this.value);
        updateProgressBar();
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.classList.add('loading');
        btnText.textContent = 'Обработка...';
        submitBtn.disabled = true;
        
        if(tg) {
            tg.MainButton.setText('Обработка...');
            tg.MainButton.disable();
        }
        
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
            // Send registration data to Google Sheets
            const sheetsClient = new SheetsClient();
            const registrationData = [
                name,
                email,
                formatDateForSheet(date),
                time,
                getTelegramUserId() || 'N/A',
                new Date().toISOString()
            ];
            
            sheetsClient.addDataToSheet('registrations', registrationData)
                .then(sheetsResult => {
                    console.log('Registration saved to Google Sheets:', sheetsResult);
                    
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
                    
                    // Hide validation icons
                    document.querySelectorAll('.validation-icon').forEach(icon => {
                        icon.classList.remove('valid', 'invalid');
                    });
                    
                    // Reset progress bar
                    progressFill.style.width = '0%';
                    nameLabel.classList.add('active');
                    emailLabel.classList.remove('active');
                    dateLabel.classList.remove('active');
                    timeLabel.classList.remove('active');
                    
                    // Hide booking preview
                    bookingPreview.style.display = 'none';
                    
                    // Remove loading state
                    submitBtn.classList.remove('loading');
                    btnText.textContent = 'Забронировать';
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
                })
                .catch(error => {
                    console.error('Error saving registration to Google Sheets:', error);
                    
                    // Still show success overlay but log the error
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
                    
                    // Hide validation icons
                    document.querySelectorAll('.validation-icon').forEach(icon => {
                        icon.classList.remove('valid', 'invalid');
                    });
                    
                    // Reset progress bar
                    progressFill.style.width = '0%';
                    nameLabel.classList.add('active');
                    emailLabel.classList.remove('active');
                    dateLabel.classList.remove('active');
                    timeLabel.classList.remove('active');
                    
                    // Hide booking preview
                    bookingPreview.style.display = 'none';
                    
                    // Remove loading state
                    submitBtn.classList.remove('loading');
                    btnText.textContent = 'Забронировать';
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
                });
        } else {
            // Remove loading state if validation failed
            submitBtn.classList.remove('loading');
            btnText.textContent = 'Забронировать';
            submitBtn.disabled = false;
            
            if(tg) {
                tg.MainButton.setText('Забронировать');
                tg.MainButton.enable();
            }
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
    
    // Save to calendar functionality
    saveToCalendarBtn.addEventListener('click', function() {
        const name = document.getElementById('name').value.trim();
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        
        if (name && date && time) {
            // Create iCalendar event
            const eventDate = new Date(date + 'T' + time + ':00');
            const endDate = new Date(eventDate.getTime() + 4 * 60 * 60 * 1000); // Add 4 hours for the intensive
            
            const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AI Intensive//RU
BEGIN:VEVENT
UID:${Date.now()}@ai-intensive.com
DTSTAMP:${formatDateForICal(new Date())}
DTSTART:${formatDateForICal(eventDate)}
DTEND:${formatDateForICal(endDate)}
SUMMARY:ИНТЕНСИВ ПО ИИ
DESCRIPTION:Участие в 4-часовом интенсиве по искусственному интеллекту
LOCATION:ул. Беговая, 12 (технопарк РГСУ)
END:VEVENT
END:VCALENDAR`.replace(/\n/g, '\r\n');
            
            // Create and download the .ics file
            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `AI_Intensive_${formatDateForFilename(date)}.ics`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Show confirmation
            if(window.Telegram?.WebApp) {
                window.Telegram.WebApp.showAlert('Событие добавлено в ваш календарь!');
            } else {
                alert('Событие добавлено в ваш календарь!');
            }
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
    
    // Format date for Google Sheets (YYYY-MM-DD)
    function formatDateForSheet(dateString) {
        return dateString;
    }
    
    // Format date for iCalendar format (YYYYMMDDTHHMMSSZ)
    function formatDateForICal(date) {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        
        return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    }
    
    // Format date for filename
    function formatDateForFilename(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Get Telegram user ID if available
    function getTelegramUserId() {
        const tg = window.Telegram?.WebApp;
        return tg?.initDataUnsafe?.user?.id || null;
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
    
    // Add bounce animation to info icons
    document.querySelectorAll('.info-icon').forEach(icon => {
        icon.classList.add('bounce-animation');
    });
});