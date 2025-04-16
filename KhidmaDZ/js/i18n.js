// Dictionnaire de traductions pour FR, AR et EN
const translations = {
  'fr': {
    'nav-home': 'Accueil',
    'nav-login': 'Connexion',
    'nav-dashboard': 'Dashboard',
    'nav-missions': 'Missions',
    'btn-create-account': 'Créer un compte',
    'btn-discover-missions': 'Découvrir les Missions',
    'hero-title': 'Bienvenue sur KhidmaDZ',
    'hero-text': 'La plateforme premium pour connecter clients et prestataires avec élégance.',
    'section-services-title': 'Nos Services',
    'section-services-desc': 'Nous proposons un catalogue de services variés, allant de la rénovation à la maintenance, en passant par des prestations personnalisées.',
    'auth-title': 'Connexion / Inscription',
    'auth-name-placeholder': 'Nom (pour inscription)',
    'auth-email-placeholder': 'Email',
    'auth-phone-placeholder': 'Téléphone',
    'auth-password-placeholder': 'Mot de passe',
    'auth-profile-type': 'Type de profil',
    'btn-continue': 'Continuer',
    'btn-use-otp': 'Utiliser OTP',
    'dashboard-title': 'Votre Dashboard',
    'dashboard-text': 'Gérez vos demandes, vos missions, vos profils et communications.',
    'profile-client-title': 'Création / Mise à Jour du Profil Client',
    'profile-prestataire-title': 'Création / Mise à Jour du Profil Prestataire',
    'missions-title': 'Missions Proposées',
    'mission-add-title': 'Ajouter une Mission',
    'mission-title-placeholder': 'Titre de la mission',
    'mission-desc-placeholder': 'Description de la mission',
    'mission-service-placeholder': '-- Choisissez un service --',
    'mission-location-placeholder': 'Localisation',
    'mission-price-placeholder': 'Budget souhaité',
    'btn-send-mission': 'Envoyer la Mission',
    'default-option': '-- Sélectionnez une option --'
  },
  'en': {
    'nav-home': 'Home',
    'nav-login': 'Login',
    'nav-dashboard': 'Dashboard',
    'nav-missions': 'Missions',
    'btn-create-account': 'Create an Account',
    'btn-discover-missions': 'Discover Missions',
    'hero-title': 'Welcome to KhidmaDZ',
    'hero-text': 'The premium platform to connect clients and providers with elegance.',
    'section-services-title': 'Our Services',
    'section-services-desc': 'We offer a wide catalogue of services ranging from renovation to maintenance, with personalized offers in diverse fields.',
    'auth-title': 'Login / Sign Up',
    'auth-name-placeholder': 'Name (for sign up)',
    'auth-email-placeholder': 'Email',
    'auth-phone-placeholder': 'Phone',
    'auth-password-placeholder': 'Password',
    'auth-profile-type': 'Profile Type',
    'btn-continue': 'Continue',
    'btn-use-otp': 'Use OTP',
    'dashboard-title': 'Your Dashboard',
    'dashboard-text': 'Manage your requests, missions, profiles and communications.',
    'profile-client-title': 'Client Profile Management',
    'profile-prestataire-title': 'Provider Profile Management',
    'missions-title': 'Available Missions',
    'mission-add-title': 'Add a Mission',
    'mission-title-placeholder': 'Mission Title',
    'mission-desc-placeholder': 'Mission Description',
    'mission-service-placeholder': '-- Select a service --',
    'mission-location-placeholder': 'Location',
    'mission-price-placeholder': 'Desired Budget',
    'btn-send-mission': 'Submit Mission',
    'default-option': '-- Select an option --'
  },
  'ar': {
    'nav-home': 'الرئيسية',
    'nav-login': 'تسجيل الدخول',
    'nav-dashboard': 'لوحة التحكم',
    'nav-missions': 'المهام',
    'btn-create-account': 'إنشاء حساب',
    'btn-discover-missions': 'اكتشف المهام',
    'hero-title': 'مرحباً بكم في KhidmaDZ',
    'hero-text': 'المنصة الراقية لربط العملاء ومقدمي الخدمات بأناقة.',
    'section-services-title': 'خدماتنا',
    'section-services-desc': 'نقدم مجموعة واسعة من الخدمات بدءاً من التجديد والصيانة وصولاً إلى العروض المخصصة في مختلف المجالات.',
    'auth-title': 'تسجيل الدخول / الاشتراك',
    'auth-name-placeholder': 'الاسم (للاشتراك)',
    'auth-email-placeholder': 'البريد الإلكتروني',
    'auth-phone-placeholder': 'الهاتف',
    'auth-password-placeholder': 'كلمة المرور',
    'auth-profile-type': 'نوع الحساب',
    'btn-continue': 'متابعة',
    'btn-use-otp': 'استخدام OTP',
    'dashboard-title': 'لوحة التحكم',
    'dashboard-text': 'قم بإدارة طلباتك، مهامك، حساباتك والتواصل.',
    'profile-client-title': 'إدارة حساب العميل',
    'profile-prestataire-title': 'إدارة حساب مقدم الخدمة',
    'missions-title': 'المهام المتاحة',
    'mission-add-title': 'إضافة مهمة',
    'mission-title-placeholder': 'عنوان المهمة',
    'mission-desc-placeholder': 'وصف المهمة',
    'mission-service-placeholder': '-- اختر خدمة --',
    'mission-location-placeholder': 'الموقع',
    'mission-price-placeholder': 'الميزانية المرغوبة',
    'btn-send-mission': 'إرسال المهمة',
    'default-option': '-- اختر خياراً --'
  }
};

// Fonction pour appliquer les traductions
function applyTranslations() {
  const lang = localStorage.getItem('lang') || 'fr';
  document.documentElement.lang = lang;
  // Récupère tous les éléments ayant l'attribut data-i18n
  const translatableElements = document.querySelectorAll('[data-i18n]');
  translatableElements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      if(el.placeholder !== undefined) {
        el.placeholder = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });
}

// Expose la fonction pour qu'elle soit appelée dans main.js
window.applyTranslations = applyTranslations;
