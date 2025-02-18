const activeElements = {
    type: null,
    status: null,
    source: null
};

document.addEventListener('DOMContentLoaded', () => {
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

    const radioHandlers = {
        type: {
            film: () => {
                hideNestedInCategory('autre-content', 'type');
                document.getElementById('autre-text').required = false;
                
                showNestedInCategory('team-size', 'type');
                document.getElementById('team-select').required = true;
                updateTeamSize(5);
            },
            serie: () => {
                hideNestedInCategory('autre-content', 'type');
                document.getElementById('autre-text').required = false;
                
                showNestedInCategory('team-size', 'type');
                document.getElementById('team-select').required = true;
                updateTeamSize(10);
            },
            autre: () => {
                hideNestedInCategory('team-size', 'type');
                document.getElementById('team-select').required = false;
                
                showNestedInCategory('autre-content', 'type');
                document.getElementById('autre-text').required = true;
            }
        },
        status: {
            standalone: () => {
                hideNestedInCategory('universe-details', 'status');
                document.querySelector('textarea[name="entry.527286151"]').required = false;
                
                showNestedInCategory('standalone-followup', 'status');
                document.getElementById('standalone-details').required = true;
            },
            newuniverse: () => {
                hideNestedInCategory('standalone-followup', 'status');
                document.getElementById('standalone-details').required = false;
                
                showNestedInCategory('universe-details', 'status');
                document.querySelector('textarea[name="entry.527286151"]').required = true;
            }
        },
        source: {
            adapte: () => showNestedInCategory('adapte-followup', 'source')
        }
    };

    const radioGroups = {
        type: 'entry.74717093',
        status: 'entry.1997500657',
        source: 'entry.1401803324',
        role: 'entry.1512927452'
    };

    Object.entries(radioGroups).forEach(([groupType, nameAttr]) => {
        document.querySelectorAll(`input[name="${nameAttr}"]`).forEach(radio => {
            radio.addEventListener('change', function() {
                const radios = document.querySelectorAll(`input[name="${nameAttr}"]`);
                radios.forEach(r => {
                    const option = r.closest('.radio-option');
                    if (option) {
                        option.classList.toggle('selected', r.checked);
                    }
                });

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
            allSections.forEach(section => section.style.display = 'block');
            
            formatSection.style.display = 'none';
            document.querySelectorAll('input[name="entry.74717093"]').forEach(input => {
                input.checked = false;
                input.required = false;
            });
            hideNestedInCategory('type');
    
            allSections.forEach(section => {
                if (section !== formatSection) {
                    section.querySelectorAll('input[required]').forEach(input => {
                        input.required = true;
                    });
                }
            });
        } else if (radio.id === 'aucun') {
            allSections.forEach(section => {
                const sectionTitle = section.querySelector('.section-title span')?.textContent;
                const keepVisible = [
                    'Informations personnelles',
                    'Informations sur le projet',
                    'Type de projet',
                    'Nature du projet',
                    'Rôle dans le projet',
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

    const savedRole = document.querySelector('input[name="entry.1512927452"]:checked');
    if (savedRole) {
        handleRoleChange(savedRole);
    }
});