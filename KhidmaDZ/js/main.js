// Gestion du sélecteur de langue
const langSwitcher = document.getElementById('lang-switcher');
if (langSwitcher) {
  // Définition initiale de la langue sélectionnée
  langSwitcher.value = localStorage.getItem('lang') || 'fr';
  langSwitcher.addEventListener('change', () => {
    localStorage.setItem('lang', langSwitcher.value);
    // Réappliquer les traductions sur la page
    if(window.applyTranslations) {
      window.applyTranslations();
    }
  });
}

// Appliquer les traductions dès le chargement
if(window.applyTranslations) {
  window.applyTranslations();
}

// Simulation d'authentification via JWT et protection des routes
const token = localStorage.getItem('jwtToken');
const currentPage = location.pathname.split('/').pop();
const protectedPages = ['dashboard.html', 'profil-client.html', 'profil-prestataire.html', 'ajouter-mission.html'];
if (protectedPages.includes(currentPage) && !token) {
  window.location.href = 'auth.html';
}

// Gestion simple du formulaire d'authentification
const authForm = document.getElementById('auth-form');
if (authForm) {
  authForm.addEventListener('submit', e => {
    e.preventDefault();
    // Simulation d'un token JWT
    const fakeToken = btoa(JSON.stringify({user: 'demo', exp: Date.now() + 3600000}));
    localStorage.setItem('jwtToken', fakeToken);
    window.location.href = 'dashboard.html';
  });
}

// Simulation bouton OTP
document.getElementById('otp-btn')?.addEventListener('click', () => {
  const phone = document.getElementById('phone').value;
  alert('OTP envoyé au ' + phone);
});

// Gestion du formulaire d'ajout de mission
const missionForm = document.getElementById('mission-form');
if (missionForm) {
  missionForm.addEventListener('submit', e => {
    e.preventDefault();
    // Extraction des données
    const title = document.getElementById('mission-title').value;
    const desc = document.getElementById('mission-desc').value;
    const locationVal = document.getElementById('mission-location').value;
    const price = document.getElementById('mission-price').value;
    alert('Mission \"' + title + '\" enregistrée !');
    missionForm.reset();
  });
}

// Gestion du filtrage sur la page missions.html
const filterBtn = document.getElementById('filter-btn');
if (filterBtn) {
  filterBtn.addEventListener('click', () => {
    const keyword = document.getElementById('filter-keyword').value.toLowerCase();
    const locationKeyword = document.getElementById('filter-location').value.toLowerCase();
    const missions = document.querySelectorAll('.mission-item');
    missions.forEach(item => {
      const title = item.querySelector('h3').textContent.toLowerCase();
      const locText = item.querySelector('p:nth-of-type(2)').textContent.toLowerCase();
      if(title.includes(keyword) && locText.includes(locationKeyword)){
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
}
