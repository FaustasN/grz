// Straipsnio tipas
export interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  image?: string; 
}

// Straipsnių duomenys - čia galite pridėti savo straipsnius
export const articles: Article[] = [

  // {
    // id: 1,
    // title: 'Straipsnio pavadinimas',
    // excerpt: 'Trumpas straipsnio aprašymas...',
    // date: '2025-12-04',
    // content: 'Pilnas straipsnio tekstas...',
    // image: '/pvz.webp' // is public folderio
  // }
];

// Funkcija, kuri grąžina straipsnį pagal ID
export function getArticleById(id: number): Article | undefined {
  return articles.find(article => article.id === id);
}
