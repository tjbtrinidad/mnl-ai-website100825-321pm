// Update counter targets to reflect new stats
const updatedCounterTargets = {
  clients: 20,    // Changed from 50 to 20
  years: 2,       // Changed from 3 to 2  
  satisfaction: 100  // Remains 100
};

// Update counter animation function to use new targets
function setupCounterAnimations() {
    const trustNumbers = document.querySelectorAll('.trust-number, .stat-number');
    
    if (trustNumbers.length === 0) return;

    let hasAnimated = false;

    function animateCounters() {
        if (hasAnimated) return;
        hasAnimated = true;

        trustNumbers.forEach(function(number) {
            const finalText = number.textContent.trim();
            
            // Use updated targets for specific counters
            let numValue;
            if (finalText.includes('20') || finalText.includes('Happy') || finalText.includes('Client')) {
                numValue = updatedCounterTargets.clients;
            } else if (finalText.includes('2') || finalText.includes('Years') || finalText.includes('Experience')) {
                numValue = updatedCounterTargets.years;
            } else if (finalText.includes('100') || finalText.includes('Satisfaction')) {
                numValue = updatedCounterTargets.satisfaction;
            } else {
                numValue = parseInt(finalText.replace(/[^\d]/g, ''));
            }
            
            if (isNaN(numValue)) return;
            
            const isPercentage = finalText.includes('%');
            const isPlus = finalText.includes('+');
            const isCurrency = finalText.includes('₱');
            const isK = finalText.toLowerCase().includes('k');
            
            let current = 0;
            const duration = 2000;
            const startTime = Date.now();

            function updateCounter() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                current = numValue * easeOutQuart;
                
                let displayValue = Math.floor(current);
                let displayText = displayValue.toString();
                
                if (isCurrency && isK) {
                    displayText = '₱' + displayValue + 'k';
                } else if (isCurrency) {
                    displayText = '₱' + displayValue;
                } else if (isPercentage) {
                    displayText = displayValue + '%';
                } else if (isPlus) {
                    displayText = displayValue + '+';
                } else if (isK) {
                    displayText = displayValue + 'k';
                }
                
                number.textContent = displayText;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    // Set final values
                    if (numValue === updatedCounterTargets.clients) {
                        number.textContent = '20+';
                    } else if (numValue === updatedCounterTargets.years) {
                        number.textContent = '2+';
                    } else if (numValue === updatedCounterTargets.satisfaction) {
                        number.textContent = '100%';
                    } else {
                        number.textContent = finalText;
                    }
                }
            }

            updateCounter();
        });
    }

    // Trigger animation when trust indicators are visible
    const firstTrustElement = document.querySelector('.trust-indicators, .about-stats');
    
    if (firstTrustElement && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    setTimeout(animateCounters, 500);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(firstTrustElement);
    } else {
        setTimeout(animateCounters, 1000);
    }
}