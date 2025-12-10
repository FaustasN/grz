type DataLayerEvent = Record<string, unknown>;

const getDataLayer = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const w = window as typeof window & { dataLayer?: DataLayerEvent[] };
  w.dataLayer = w.dataLayer || [];
  return w.dataLayer;
};

export const pushToDataLayer = (event: string, data: DataLayerEvent = {}) => {
  const dataLayer = getDataLayer();
  if (!dataLayer) {
    return;
  }

  dataLayer.push({
    event,
    ...data,
  });
};

export const trackReservationButtonClick = (context: string) => {
  pushToDataLayer('reservation_button_click', {
    context,
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    timestamp: Date.now(),
  });
};

export const trackContactFormSubmit = (context?: string) => {
  pushToDataLayer('contact_form_submit', {
    context: context || 'contact_form',
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    timestamp: Date.now(),
  });
};