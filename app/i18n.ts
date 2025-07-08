import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Traductions
const translations = {
  fr: {
    welcome: "Bienvenue, %{name} 👋",
    your_email: "Ton email : %{email}",
    last_trip: "Ton dernier voyage : %{destination}",
    for_people_days: "Pour %{people} personnes, %{days} jours",
    add_item: "Ajouter un matériel",
    save_budget: "Sauvegarder le budget",
    customize_trip: "Personnaliser le Road Trip",
    no_trip: "Aucun voyage planifié.",
    plan_trip: "Planifier un voyage",
    logout: "Se déconnecter",
    profile: "Profil",
    budget: "Budget",
    items: "Matériel",
    steps: "Étapes",
    destination: "Destination",
    days: "Jours",
    people: "Personnes",
    rent_car: "Louer une voiture",
    edit: "Modifier",
    delete: "Supprimer",
    confirm: "Confirmer",
    cancel: "Annuler",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    add: "Ajouter",
    remove: "Retirer",
    quantity: "Quantité",
    price: "Prix",
    total: "Total",
    trip_story: "Histoire",
    modify_story: "Modifier mon histoire",
    add_story: "Ajouter une histoire",
    delete_story: "Supprimer l'histoire",
    delete_trip: "Supprimer ce voyage",
    no_items: "Aucun matériel",
    no_steps: "Aucune étape",
    see_more: "Voir plus",
    see_less: "Voir moins",
    not_authorized: "Veuillez vous reconnecter",
    budget_updated: "Budget mis à jour !",
    home: "Accueil",
    // Ajoute ici toutes les autres clés utilisées dans Home
  },
  en: {
    welcome: "Welcome, %{name} 👋",
    your_email: "Your email: %{email}",
    last_trip: "Your last trip: %{destination}",
    for_people_days: "For %{people} people, %{days} days",
    add_item: "Add item",
    save_budget: "Save budget",
    customize_trip: "Customize Road Trip",
    no_trip: "No trip planned.",
    plan_trip: "Plan a trip",
    logout: "Log out",
    profile: "Profile",
    budget: "Budget",
    items: "Items",
    steps: "Steps",
    destination: "Destination",
    days: "Days",
    people: "People",
    rent_car: "Rent a car",
    edit: "Edit",
    delete: "Delete",
    confirm: "Confirm",
    cancel: "Cancel",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    add: "Add",
    remove: "Remove",
    quantity: "Quantity",
    price: "Price",
    total: "Total",
    trip_story: "Story",
    modify_story: "Edit my story",
    add_story: "Add a story",
    delete_story: "Delete story",
    delete_trip: "Delete this trip",
    no_items: "No items",
    no_steps: "No steps",
    see_more: "See more",
    see_less: "See less",
    not_authorized: "Please log in again",
    budget_updated: "Budget updated!",
    home: "Home",
    // Add here all other keys used in Home
  }
};

const i18n = new I18n(translations);

i18n.locale = Localization.locale;
i18n.enableFallback = true;

// Permet de changer la langue globalement
export const setAppLanguage = (lang: 'fr' | 'en') => {
  i18n.locale = lang;
};

export default i18n;