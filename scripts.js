const activeElements = {
    type: null,
    status: null,
    source: null
};

document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle logic
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const icon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });

    function updateIcon(theme) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Utility functions for nested elements
    function hideNestedInCategory(category) {
        if (activeElements[category]) {
            const element = document.getElementById(activeElements[category]);
            if (element) {
                element.classList.remove('visible');
                setTimeout(() => element.style.display = 'none', 300);
            }
            activeElements[category] = null;
        }
    }

    function showNestedInCategory(elementId, category) {
        if (activeElements[category] !== elementId) {
            hideNestedInCategory(category);
            const element = document.getElementById(elementId);
            if (element) {
                element.style.display = 'block';
                setTimeout(() => element.classList.add('visible'), 10);
                activeElements[category] = elementId;
            }
        }
    }

    function updateTeamSize(max) {
        const select = document.getElementById('team-select');
        if (select) {
            select.innerHTML = '<option value="">Choisir...</option>';
            for (let i = 2; i <= max; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                select.appendChild(option);
            }
        }
    }

    // Radio handlers mapping
    const radioHandlers = {
        type: {
            film: () => {
                // Cache la section "autre"
                hideNestedInCategory('autre-content', 'type');
                // Affiche et configure team-size
                showNestedInCategory('team-size', 'type');
                updateTeamSize(5);
            },
            serie: () => {
                // Cache la section "autre"
                hideNestedInCategory('autre-content', 'type');
                // Affiche et configure team-size
                showNestedInCategory('team-size', 'type');
                updateTeamSize(10);
            },
            autre: () => {
                // Cache team-size
                hideNestedInCategory('team-size', 'type');
                // Affiche la section "autre"
                showNestedInCategory('autre-content', 'type');
            }
        },
        status: {
            standalone: () => showNestedInCategory('standalone-followup', 'status'),
            newuniverse: () => showNestedInCategory('universe-details', 'status')
        },
        source: {
            adapte: () => showNestedInCategory('adapte-followup', 'source')
        }
    };

    // Setup radio event listeners
    const radioGroups = {
        type: 'entry.74717093',
        status: 'entry.1997500657',
        source: 'entry.1401803324',
        role: 'entry.1512927452'
    };

    Object.entries(radioGroups).forEach(([groupType, nameAttr]) => {
        document.querySelectorAll(`input[name="${nameAttr}"]`).forEach(radio => {
            radio.addEventListener('change', function() {
                // Update radio styles
                const radios = document.querySelectorAll(`input[name="${nameAttr}"]`);
                radios.forEach(r => {
                    const option = r.closest('.radio-option');
                    if (option) {
                        option.classList.toggle('selected', r.checked);
                    }
                });

                // Handle specific group behaviors
                if (groupType === 'type') {
                    const handler = radioHandlers.type[this.id];
                    if (handler) {
                        handler();
                    }
                } else if (groupType === 'role') {
                    handleRoleChange(this);
                } else {
                    const handler = radioHandlers[groupType]?.[this.id];
                    if (handler) {
                        handler();
                    } else {
                        hideNestedInCategory(groupType);
                    }
                }
            });
        });
    });

    function handleRoleChange(radio) {
        const formatSection = document.querySelector('.form-section:has(#film)');
        const allSections = document.querySelectorAll('.form-section');
    
        if (radio.id === 'membre') {
            formatSection.style.display = 'none';
            document.querySelectorAll('input[name="entry.74717093"]').forEach(input => {
                input.checked = false;
                input.required = false;
            });
            hideNestedInCategory('type');
        } else if (radio.id === 'aucun') {
            allSections.forEach(section => {
                const sectionTitle = section.querySelector('.section-title span')?.textContent;
                const keepVisible = [
                    'Informations personnelles',
                    'Informations sur le projet',
                    'Type de projet',
                    'Nature du projet',
                    'Rôle dans le projet', // Ajout de cette section
                    'Informations supplémentaires'
                ].includes(sectionTitle);
    
                section.style.display = keepVisible ? 'block' : 'none';
                if (!keepVisible) {
                    section.querySelectorAll('input, textarea, select').forEach(input => {
                        input.required = false;
                        if (input.type === 'radio') input.checked = false;
                    });
                }
            });
        } else {
            allSections.forEach(section => section.style.display = 'block');
            document.querySelectorAll('input[name="entry.74717093"]').forEach(input => {
                input.required = true;
            });
        }
    }

    // Initialize form sections visibility based on saved state
    const savedRole = document.querySelector('input[name="entry.1512927452"]:checked');
    if (savedRole) {
        handleRoleChange(savedRole);
    }
});