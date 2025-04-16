document.addEventListener('DOMContentLoaded', function() {
    // Sélectionne tous les menus déroulants ayant la classe 'service-dropdown'
    const serviceDropdowns = document.querySelectorAll('.service-dropdown');
    if (serviceDropdowns.length > 0) {
        // On crée un fragment DOM pour améliorer la performance
        const fragment = document.createDocumentFragment();
        // Générer 1000 options (vous pouvez adapter ce nombre)
        for (let i = 1; i <= 1000; i++) {
            let option = document.createElement('option');
            option.value = 'service-' + i;
            option.text = 'Service ' + i;
            fragment.appendChild(option);
        }
        // Pour chaque menu déroulant, on insère une copie du fragment généré
        serviceDropdowns.forEach(dropdown => {
            // Pour préserver l’option par défaut, on vérifie si le premier élément existe déjà
            if(dropdown.options.length === 0){
                // Si le dropdown est vide, on ajoute une option par défaut
                let defaultOpt = document.createElement('option');
                defaultOpt.value = "";
                defaultOpt.text = "-- Sélectionnez un service --";
                dropdown.appendChild(defaultOpt);
            }
            dropdown.appendChild(fragment.cloneNode(true));
        });
    }
});
