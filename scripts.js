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

    
    const radioHandlers = {
        status: {
            standalone: () => showNestedInCategory('standalone-followup', 'status'),
            newuniverse: () => showNestedInCategory('universe-details', 'status')
        },
        source: {
            adapte: () => showNestedInCategory('adapte-followup', 'source')
        },
        type: {
            film: () => {
                showNestedInCategory('team-size', 'type');
                updateTeamSize(5);
            },
            serie: () => {
                showNestedInCategory('team-size', 'type');
                updateTeamSize(10);
            },
            autre: () => {
                hideNestedInCategory('type'); // Cache d'abord la section team-size
                const autreText = document.getElementById('autre-text');
                if (autreText) {
                    autreText.style.display = 'inline-block';
                    autreText.focus();
                }
            }
        }
    };

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

    // Add event listeners to radio groups
    ['status', 'source', 'type'].forEach(groupName => {
        const radios = document.querySelectorAll(`input[name="${groupName}"]`);
        radios.forEach(radio => {
            radio.addEventListener('change', function() {
                // Mettre à jour le style pour tous les radios du groupe
                radios.forEach(r => {
                    const option = r.closest('.radio-option');
                    if (option) {
                        option.classList.toggle('selected', r.checked);
                    }
                });

                // Gérer l'affichage des sections conditionnelles
                const handler = radioHandlers[groupName]?.[this.id];
                if (handler) {
                    handler();
                } else {
                    hideNestedInCategory(groupName);
                }
            });
        });
    });

    document.querySelectorAll('input[name="role"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const radios = document.querySelectorAll('input[name="role"]');
            radios.forEach(r => {
                const option = r.closest('.radio-option');
                if (option) {
                    option.classList.toggle('selected', r.checked);
                }
            });
        });
    });

    // Définir les sections à masquer/afficher selon le rôle
    document.querySelectorAll('input[name="role"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const formatSection = document.querySelector('.form-section:has(#film)'); // Section format du projet
            const teamSizeSection = document.getElementById('team-size');

            // Mettre à jour le style des options radio
            const radios = document.querySelectorAll('input[name="role"]');
            radios.forEach(r => {
                const option = r.closest('.radio-option');
                if (option) {
                    option.classList.toggle('selected', r.checked);
                }
            });

            // Gérer l'affichage de la section format selon le rôle
            if (this.id === 'membre') {
                // Cacher la section format et team-size si "membre" est sélectionné
                formatSection.style.display = 'none';
                if (teamSizeSection) {
                    teamSizeSection.style.display = 'none';
                }
                // Désactiver les radios de type
                document.querySelectorAll('input[name="type"]').forEach(typeRadio => {
                    typeRadio.checked = false;
                    typeRadio.required = false;
                });
            } else {
                // Afficher la section format pour les autres rôles
                formatSection.style.display = 'block';
                document.querySelectorAll('input[name="type"]').forEach(typeRadio => {
                    typeRadio.required = true;
                });
            }
        });
    });

    
    document.querySelectorAll('input[name="role"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const formatSection = document.querySelector('.form-section:has(#film)');
            const teamSizeSection = document.getElementById('team-size');
            const sectionsToToggle = document.querySelectorAll('.form-section');

            // Mettre à jour le style des options radio
            const radios = document.querySelectorAll('input[name="role"]');
            radios.forEach(r => {
                const option = r.closest('.radio-option');
                if (option) {
                    option.classList.toggle('selected', r.checked);
                }
            });

            // Gérer l'affichage selon le rôle
            if (this.id === 'membre') {
                
                formatSection.style.display = 'none';
                if (teamSizeSection) {
                    teamSizeSection.style.display = 'none';
                }
                document.querySelectorAll('input[name="type"]').forEach(typeRadio => {
                    typeRadio.checked = false;
                    typeRadio.required = false;
                });
            } else if (this.id === 'aucun') {
                
                sectionsToToggle.forEach(section => {
                    const isSectionToKeep = 
                        section.querySelector('.section-title span')?.textContent === 'Informations personnelles' ||
                        section.querySelector('.section-title span')?.textContent === 'Informations supplémentaires';
                    
                    if (!isSectionToKeep) {
                        section.style.display = 'none';
                        const inputs = section.querySelectorAll('input, textarea, select');
                        inputs.forEach(input => {
                            input.required = false;
                            if (input.type === 'radio') {
                                input.checked = false;
                            }
                        });
                    }
                });
            } else {
                
                sectionsToToggle.forEach(section => {
                    section.style.display = 'block';
                });
                formatSection.style.display = 'block';
                document.querySelectorAll('input[name="type"]').forEach(typeRadio => {
                    typeRadio.required = true;
                });
            }
        });
    });

    
    document.querySelectorAll('input[name="role"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const roleSection = this.closest('.form-section');
            const nextSections = [];
            let current = roleSection.nextElementSibling;
            
            
            while (current) {
                if (current.classList.contains('form-section')) {
                    nextSections.push(current);
                }
                current = current.nextElementSibling;
            }

            
            const radios = document.querySelectorAll('input[name="role"]');
            radios.forEach(r => {
                const option = r.closest('.radio-option');
                if (option) {
                    option.classList.toggle('selected', r.checked);
                }
            });

            if (this.id === 'aucun') {
                
                nextSections.forEach(section => {
                    const isAdditionalInfo = section.querySelector('.section-title span')?.textContent === 'Informations supplémentaires';
                    
                    if (!isAdditionalInfo) {
                        section.style.display = 'none';
                        
                        section.querySelectorAll('input, textarea, select').forEach(input => {
                            input.required = false;
                            if (input.type === 'radio') {
                                input.checked = false;
                            }
                        });
                    }
                });
            } else if (this.id === 'membre') {
                
                nextSections.forEach(section => {
                    const isFormatSection = section.querySelector('.section-title span')?.textContent === 'Format du projet';
                    section.style.display = isFormatSection ? 'none' : 'block';
                    
                    if (isFormatSection) {
                        section.querySelectorAll('input[name="type"]').forEach(input => {
                            input.required = false;
                            input.checked = false;
                        });
                    }
                });
            } else {
                
                nextSections.forEach(section => {
                    section.style.display = 'block';
                    section.querySelectorAll('input').forEach(input => {
                        if (input.hasAttribute('required')) {
                            input.required = true;
                        }
                    });
                });
            }
        });
    });

    // Gestionnaire pour le bouton radio "autre"
    document.getElementById('autre')?.addEventListener('change', function() {
        const autreContent = document.getElementById('autre-content');
        const autreText = document.getElementById('autre-text');
        
        if (this.checked) {
            autreContent.style.display = 'block';
            setTimeout(() => {
                autreContent.classList.add('visible');
                autreText.focus();
            }, 10);
        } else {
            autreContent.classList.remove('visible');
            setTimeout(() => autreContent.style.display = 'none', 300);
        }
    });

    // Gestionnaire unique pour les boutons radio de rôle
    document.querySelectorAll('input[name="role"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const formatSection = document.querySelector('.form-section:has(#film)');
            const autreContent = document.getElementById('autre-content');
            
            if (this.id === 'membre') {
                formatSection.style.display = 'none';
                if (autreContent) {
                    autreContent.style.display = 'none';
                    autreContent.classList.remove('visible');
                }
            } else if (this.id === 'referent') {
                formatSection.style.display = 'block';
                // Ne pas masquer automatiquement le textarea si "autre" est sélectionné
                if (document.getElementById('autre')?.checked && autreContent) {
                    autreContent.style.display = 'block';
                    autreContent.classList.add('visible');
                }
            }
        });
    });

    // Gestionnaire unique pour les boutons radio de type (film/série/autre)
    document.querySelectorAll('input[name="type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const autreContent = document.getElementById('autre-content');
            const teamSizeSection = document.getElementById('team-size');

            // Masquer d'abord tous les contenus conditionnels
            if (autreContent) {
                autreContent.style.display = 'none';
                autreContent.classList.remove('visible');
            }
            if (teamSizeSection) {
                teamSizeSection.style.display = 'none';
                teamSizeSection.classList.remove('visible');
            }

            // Afficher le contenu approprié selon la sélection
            if (this.id === 'autre') {
                if (autreContent) {
                    autreContent.style.display = 'block';
                    setTimeout(() => {
                        autreContent.classList.add('visible');
                        document.getElementById('autre-text')?.focus();
                    }, 10);
                }
            } else if (this.id === 'film' || this.id === 'serie') {
                if (teamSizeSection) {
                    teamSizeSection.style.display = 'block';
                    setTimeout(() => teamSizeSection.classList.add('visible'), 10);
                    updateTeamSize(this.id === 'film' ? 5 : 10);
                }
            }
        });
    });

    // Un seul gestionnaire pour les boutons radio de rôle
    document.querySelectorAll('input[name="role"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Mise à jour du style des options radio
            const allRadios = document.querySelectorAll('input[name="role"]');
            allRadios.forEach(r => {
                const option = r.closest('.radio-option');
                if (option) {
                    option.classList.toggle('selected', r.checked);
                }
            });

            // Gestion des sections selon le rôle
            const allSections = document.querySelectorAll('.form-section');
            
            if (this.id === 'aucun') {
                allSections.forEach(section => {
                    const sectionTitle = section.querySelector('.section-title span')?.textContent;
                    const keepVisible = [
                        'Informations personnelles',
                        'Informations sur le projet',
                        'Type de projet',
                        'Nature du projet',
                        'Informations supplémentaires'
                    ].includes(sectionTitle);

                    section.style.display = keepVisible ? 'block' : 'none';
                    
                    if (!keepVisible) {
                        section.querySelectorAll('input, textarea, select').forEach(input => {
                            input.required = false;
                            if (input.type === 'radio') {
                                input.checked = false;
                            }
                        });
                    }
                });
            } else if (this.id === 'membre') {
                allSections.forEach(section => {
                    const isFormatSection = section.querySelector('.section-title span')?.textContent === 'Format du projet';
                    section.style.display = isFormatSection ? 'none' : 'block';
                    
                    if (isFormatSection) {
                        section.querySelectorAll('input[name="type"]').forEach(input => {
                            input.required = false;
                            input.checked = false;
                        });
                    }
                });
            } else {
                // Pour référent, tout afficher
                allSections.forEach(section => {
                    section.style.display = 'block';
                });
            }
        });
    });

    // Gestionnaire pour les types de projet
    document.querySelectorAll('input[name="type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const autreContent = document.getElementById('autre-content');
            const teamSizeSection = document.getElementById('team-size');

            // Masquer les deux sections conditionnelles
            [autreContent, teamSizeSection].forEach(section => {
                if (section) {
                    section.style.display = 'none';
                    section.classList.remove('visible');
                }
            });

            // Afficher la section appropriée
            if (this.id === 'autre') {
                if (autreContent) {
                    autreContent.style.display = 'block';
                    setTimeout(() => {
                        autreContent.classList.add('visible');
                        document.getElementById('autre-text')?.focus();
                    }, 10);
                }
            } else if (this.id === 'film' || this.id === 'serie') {
                if (teamSizeSection) {
                    teamSizeSection.style.display = 'block';
                    setTimeout(() => teamSizeSection.classList.add('visible'), 10);
                    updateTeamSize(this.id === 'film' ? 5 : 10);
                }
            }
        });
    });
});

document.getElementById('autre').addEventListener('change', function() {
    const autreText = document.getElementById('autre-text');
    autreText.classList.toggle('visible', this.checked);
    if (this.checked) autreText.required = true;
    else autreText.required = false;
});

document.getElementById('autre').addEventListener('change', function() {
    const autreText = document.getElementById('autre-text');
    autreText.style.display = this.checked ? 'inline-block' : 'none';
    autreText.required = this.checked;
    if (this.checked) {
        autreText.focus();
    }
});

document.getElementById('standalone').addEventListener('change', function() {
    const followup = document.getElementById('standalone-followup');
    if (this.checked) {
        followup.style.display = 'block';
        setTimeout(() => followup.classList.add('visible'), 10);
    } else {
        followup.classList.remove('visible');
        setTimeout(() => followup.style.display = 'none', 300);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const serie = document.getElementById('serie');
    const film = document.getElementById('film');
    const teamSize = document.getElementById('team-size');
    const select = document.getElementById('team-select');

    function updateOptions(max) {
        select.innerHTML = '<option value="">Choisir...</option>';
        for(let i = 2; i <= max; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            select.appendChild(option);
        }
    }

    serie.addEventListener('change', function() {
        if(this.checked) {
            updateOptions(10);
            teamSize.style.display = 'block';
            setTimeout(() => teamSize.classList.add('visible'), 10);
        }
    });

    film.addEventListener('change', function() {
        if(this.checked) {
            updateOptions(5);
            teamSize.style.display = 'block';
            setTimeout(() => teamSize.classList.add('visible'), 10);
        }
    });
});


document.querySelectorAll('input[name="type"]').forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.id === 'serie' || this.id === 'film') {
            showNestedInCategory('team-size', 'type');
        } else if (this.id === 'autre') {
            showNestedInCategory('autre-text', 'type');
        } else {
            hideNestedInCategory('type');
        }
    });
});

document.querySelectorAll('input[name="status"]').forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.id === 'standalone') {
            showNestedInCategory('standalone-followup', 'status');
        } else if (this.id === 'newuniverse') {
            showNestedInCategory('universe-details', 'status');
        } else {
            hideNestedInCategory('status');
        }
    });
});

document.querySelectorAll('input[name="source"]').forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.id === 'adapte') {
            showNestedInCategory('adapte-followup', 'source');
        } else {
            hideNestedInCategory('source');
        }
    });
});

const proposantSections = ['team-size', 'collaborators', 'competences-section'];

document.querySelectorAll('input[name="role"]').forEach(radio => {
    radio.addEventListener('change', function() {
        proposantSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                if (this.id === 'proposant') {
                    section.classList.remove('visible');
                    setTimeout(() => section.style.display = 'none', 300);
                } else {
                    section.style.display = 'block';
                    setTimeout(() => section.classList.add('visible'), 10);
                }
            }
        });

        
        if (this.id === 'proposant') {
            document.querySelectorAll('input[name="type"]').forEach(typeRadio => {
                typeRadio.checked = false;
            });
            hideNestedInCategory('type');
        }
    });
});

document.querySelectorAll('input[name="role"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const formatSection = document.querySelector('.form-section:has(#film)');
        const teamSizeSection = document.getElementById('team-size');
        const currentSection = this.closest('.form-section');
        const allSections = Array.from(document.querySelectorAll('.form-section'));
        const startIndex = allSections.indexOf(currentSection);

        // Mettre à jour le style des options radio
        const radios = document.querySelectorAll('input[name="role"]');
        radios.forEach(r => {
            const option = r.closest('.radio-option');
            if (option) {
                option.classList.toggle('selected', r.checked);
            }
        });

        if (this.id === 'membre') {
            // Logic pour "membre"
            formatSection.style.display = 'none';
            if (teamSizeSection) {
                teamSizeSection.style.display = 'none';
            }
            document.querySelectorAll('input[name="type"]').forEach(typeRadio => {
                typeRadio.checked = false;
                typeRadio.required = false;
            });
        } else if (this.id === 'aucun') {
            // Masquer uniquement les sections qui suivent
            allSections.forEach((section, index) => {
                if (index > startIndex && 
                    section.querySelector('.section-title span')?.textContent !== 'Informations supplémentaires') {
                    section.style.display = 'none';
                    const inputs = section.querySelectorAll('input, textarea, select');
                    inputs.forEach(input => {
                        input.required = false;
                        if (input.type === 'radio') {
                            input.checked = false;
                        }
                    });
                } else {
                    section.style.display = 'block';
                }
            });
        } else {
            
            allSections.forEach(section => {
                section.style.display = 'block';
            });
            formatSection.style.display = 'block';
            document.querySelectorAll('input[name="type"]').forEach(typeRadio => {
                typeRadio.required = true;
            });
        }
    });
});

document.querySelectorAll('input[name="role"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const roleSection = this.closest('.form-section');
        const allSections = Array.from(document.querySelectorAll('.form-section'));
        const currentIndex = allSections.indexOf(roleSection);

        // Mettre à jour le style des options radio
        const radios = document.querySelectorAll('input[name="role"]');
        radios.forEach(r => {
            const option = r.closest('.radio-option');
            if (option) {
                option.classList.toggle('selected', r.checked);
            }
        });

        if (this.id === 'aucun') {
            // Masquer uniquement certaines sections
            allSections.forEach((section) => {
                const sectionTitle = section.querySelector('.section-title span')?.textContent;
                console.log('Section title:', sectionTitle); // Pour déboguer

                // Liste des sections à garder visibles avec les titres exacts
                const sectionsToKeep = [
                    'Informations personnelles',
                    'Informations sur le projet',
                    'Type de projet', 
                    'Nature du projet', 
                    'Informations supplémentaires'
                ];

                const shouldShow = sectionsToKeep.includes(sectionTitle);
                console.log(`Section ${sectionTitle}: ${shouldShow ? 'visible' : 'hidden'}`); // Pour déboguer

                section.style.display = shouldShow ? 'block' : 'none';
                
                if (!shouldShow) {
                    section.querySelectorAll('input, textarea, select').forEach(input => {
                        input.required = false;
                        if (input.type === 'radio') {
                            input.checked = false;
                        }
                    });
                }
            });
        } else if (this.id === 'membre') {
            // Logic pour "membre" - masquer seulement la section format
            allSections.forEach(section => {
                const isFormatSection = section.querySelector('.section-title span')?.textContent === 'Format du projet';
                section.style.display = isFormatSection ? 'none' : 'block';
            });
        } else {
            // Afficher toutes les sections pour référent
            allSections.forEach(section => {
                section.style.display = 'block';
            });
        }
    });
});