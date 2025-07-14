// Composable pour gérer le formatage des dates d'événements
// Prend en charge la nouvelle structure dateInfo et l'ancienne structure date

interface EventDateInfo {
  eventDuration: 'single' | 'multiple';
  singleDate?: string;
  startDate?: string;
  endDate?: string;
}

interface EventWithDate {
  date?: string; // Ancienne structure
  dateInfo?: EventDateInfo; // Nouvelle structure
}

export const useEventDate = () => {
  // Formate une date d'événement selon sa structure
  const formatEventDate = (event: EventWithDate): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    
    // Gestion de la nouvelle structure dateInfo
    if (event.dateInfo?.eventDuration === 'single' && event.dateInfo?.singleDate) {
      return new Date(event.dateInfo.singleDate).toLocaleDateString('fr-FR', options);
    } else if (event.dateInfo?.eventDuration === 'multiple' && event.dateInfo?.startDate && event.dateInfo?.endDate) {
      const startDate = new Date(event.dateInfo.startDate).toLocaleDateString('fr-FR', options);
      const endDate = new Date(event.dateInfo.endDate).toLocaleDateString('fr-FR', options);
      return `${startDate} - ${endDate}`;
    }
    
    // Fallback pour l'ancienne structure (rétrocompatibilité)
    if (event.date) {
      return new Date(event.date).toLocaleDateString('fr-FR', options);
    }
    
    return 'Date non définie';
  };

  // Formate une date d'événement pour l'affichage détaillé (page événement)
  const formatEventDateDetailed = (event: EventWithDate): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    };
    
    // Gestion de la nouvelle structure dateInfo
    if (event.dateInfo?.eventDuration === 'single' && event.dateInfo?.singleDate) {
      return new Date(event.dateInfo.singleDate).toLocaleDateString('fr-FR', options);
    } else if (event.dateInfo?.eventDuration === 'multiple' && event.dateInfo?.startDate && event.dateInfo?.endDate) {
      const startDate = new Date(event.dateInfo.startDate).toLocaleDateString('fr-FR', options);
      const endDate = new Date(event.dateInfo.endDate).toLocaleDateString('fr-FR', options);
      return `Du ${startDate} au ${endDate}`;
    }
    
    // Fallback pour l'ancienne structure (rétrocompatibilité)
    if (event.date) {
      return new Date(event.date).toLocaleDateString('fr-FR', options);
    }
    
    return 'Date non définie';
  };

  // Obtient la date de tri (pour les requêtes GROQ ou le tri côté client)
  const getSortDate = (event: EventWithDate): string => {
    if (event.dateInfo?.eventDuration === 'single' && event.dateInfo?.singleDate) {
      return event.dateInfo.singleDate;
    } else if (event.dateInfo?.eventDuration === 'multiple' && event.dateInfo?.startDate) {
      return event.dateInfo.startDate;
    }
    
    return event.date || '';
  };

  return {
    formatEventDate,
    formatEventDateDetailed,
    getSortDate
  };
};
