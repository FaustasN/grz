
export const serviceImages: { [key: string]: string } = {
  'diagnostics': '/pvz.webp', 
  'oil-change': '/oilchange.webp',
  'wheel-alignment': '/caralignment.webp',
  'suspension-repair': '/suspensionrepair.webp',
  'brake-repair': '/brakerepair.webp',
  'body-repair': '/carbodyrepair.webp',
  'headlight-repair': '/headlightsrepair.webp',
  'other-services': '/pvz.webp',
};

export function getServiceImage(slug: string): string {
  return serviceImages[slug] || '/pvz.webp';
}

