'use client';
import { useState, useEffect } from 'react';
import { Image as ImageIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Header from '../components/layout/Header';
import { API_ENDPOINTS, API_BASE_URL } from '../components/utils/api';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/ui/ScrollToTop';

interface Photo {
  id: number;
  caption: string | null;
  photo_url: string;
  photo_type: 'before' | 'after';
  created_at: string; 
}

interface PhotoGroup {
  caption: string;
  before: Photo[];
  after: Photo[];
}

export default function GalleryPageClient() {

  const [photoGroups, setPhotoGroups] = useState<PhotoGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (photoGroups.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === photoGroups.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [photoGroups.length]);

  const fetchPhotos = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(API_ENDPOINTS.PHOTOS.GET_ALL);
      const data = await response.json();
      
      if (data.success) {
        const grouped: { [key: string]: PhotoGroup } = {};
        data.photos.forEach((photo: Photo) => {
          const key = photo.caption || 'Be antraštės';
          if (!grouped[key]) {
            grouped[key] = { caption: key, before: [], after: [] };
          }
          if (photo.photo_type === 'before') {
            grouped[key].before.push(photo);
          } else {
            grouped[key].after.push(photo);
          }
        });
        setPhotoGroups(Object.values(grouped));
      } else {
        setError('Nepavyko užkrauti nuotraukų');
      }
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Klaida jungiantis prie serverio');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-40 pb-6 sm:pb-8 px-2 sm:px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full mb-2 sm:mb-3">
              <ImageIcon size={20} className="sm:hidden text-white" />
              <ImageIcon size={24} className="hidden sm:block text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
              Darbų galerija
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-3xl mx-auto px-2">
               Mūsų atliktų darbų nuotraukos - prieš ir po
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-md">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-16 sm:py-24">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-gray-800"></div>
              <p className="mt-6 text-gray-600 text-lg font-medium">Kraunamos nuotraukos...</p>
            </div>
          ) : photoGroups.length === 0 ? (
            <div className="text-center py-16 sm:py-24">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <ImageIcon size={64} className="mx-auto text-gray-300 mb-6" />
                <p className="text-gray-600 text-xl font-semibold mb-2">Nuotraukų nėra</p>
                <p className="text-gray-500 text-sm">Nuotraukos bus rodomos čia</p>
              </div>
            </div>
          ) : (
            <div className="relative max-w-2xl mx-auto px-10 sm:px-14">
              {photoGroups.length > 0 && (
                <>
                  {photoGroups.length > 1 && (  
                    <>
                      <button
                        onClick={() => setCurrentIndex((prev) => (prev === 0 ? photoGroups.length - 1 : prev - 1))}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg z-10"
                        aria-label="Previous"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => setCurrentIndex((prev) => (prev === photoGroups.length - 1 ? 0 : prev + 1))}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg z-10"
                        aria-label="Next"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden relative">
                    {photoGroups.map((group, index) => {
                      const isActive = index === currentIndex;
                      const direction = index > currentIndex ? 1 : -1;
                      return (
                        <div
                          key={`${group.caption}-${index}`}
                          className={`w-full transition-all duration-700 ease-in-out ${
                            isActive
                              ? 'opacity-100 translate-x-0 z-10 pointer-events-auto relative'
                              : direction > 0
                              ? 'opacity-0 translate-x-full z-0 pointer-events-none absolute top-0 left-0 right-0'
                              : 'opacity-0 -translate-x-full z-0 pointer-events-none absolute top-0 left-0 right-0'
                          }`}
                        >
                        <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-3 py-2 sm:px-4 sm:py-2.5 text-center">
                          <h2 className="text-xs sm:text-sm md:text-base font-bold text-white">
                            {group.caption}
                          </h2>
                        </div>

                        <div className="p-2 sm:p-3 md:p-4">
                          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                            <div className="space-y-1.5 sm:space-y-2">
                              {group.before.length > 0 && (
                                <>
                                  <h3 className="text-xs font-semibold text-gray-800 mb-1 sm:mb-2 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                    Prieš
                                  </h3>
                                  <div className="space-y-1 sm:space-y-1.5">
                                    {group.before.map((photo) => (
                                      <div
                                        key={photo.id}
                                        className="relative group overflow-hidden rounded-lg bg-gray-100 aspect-square shadow-sm cursor-pointer"
                                        onClick={() => setSelectedPhoto(`${API_BASE_URL}${photo.photo_url}`)}
                                      >
                                        <img
                                          src={`${API_BASE_URL}${photo.photo_url}`}
                                          alt={group.caption || 'Before photo'}
                                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999"%3EKlaida%3C/text%3E%3C/svg%3E';
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                              {group.after.length > 0 && (
                                <>
                                  <h3 className="text-xs font-semibold text-gray-800 mb-1 sm:mb-2 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                                    Po
                                  </h3>
                                  <div className="space-y-1 sm:space-y-1.5">
                                    {group.after.map((photo) => (
                                      <div
                                        key={photo.id}
                                        className="relative group overflow-hidden rounded-lg bg-gray-100 aspect-square shadow-sm cursor-pointer"
                                        onClick={() => setSelectedPhoto(`${API_BASE_URL}${photo.photo_url}`)}
                                      >
                                        <img
                                          src={`${API_BASE_URL}${photo.photo_url}`}
                                          alt={group.caption || 'After photo'}
                                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999"%3EKlaida%3C/text%3E%3C/svg%3E';
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        </div>
                      );
                    })}
                  </div>

                  {photoGroups.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-4">
                      {photoGroups.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentIndex
                              ? 'bg-gray-800 w-6'
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
     <Footer />
     <ScrollToTop /> 

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 z-10"
            aria-label="Close"
          >
            <X size={32} />
          </button>
          <img
            src={selectedPhoto}
            alt="Enlarged photo"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

