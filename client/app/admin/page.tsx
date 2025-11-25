'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, Phone, User, Trash2, RefreshCw, Search, X, LogOut, ArrowUp, ArrowDown, Plus, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Upload, Image as ImageIcon } from 'lucide-react';
import AdminLogin from '../components/ui/AdminLogin';
import ReservationModal from '../components/forms/ReservationModalAdmin';
import { API_ENDPOINTS, API_BASE_URL } from '../components/utils/api';

interface Reservation {
  id: number;
  name: string;
  phone: string | number;
  reservation_date: string;
  service_type: string;
  additional_info: string | null;
  created_at: string;
}

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

type SortField = 'reservation_date' | 'created_at' | 'name';
type SortOrder = 'asc' | 'desc';
type ActiveTab = 'reservations' | 'photos';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [beforeFiles, setBeforeFiles] = useState<FileList | null>(null);
  const [afterFiles, setAfterFiles] = useState<FileList | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [sortField, setSortField] = useState<SortField>('reservation_date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('reservations');
  const [photoGroups, setPhotoGroups] = useState<PhotoGroup[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [photoDeleteConfirm, setPhotoDeleteConfirm] = useState<number | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isSortExpanded, setIsSortExpanded] = useState(false);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchReservations = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_ENDPOINTS.RESERVATIONS.GET_ALL}?limit=1000`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setReservations(data.data);
        setFilteredReservations(data.data);
      } else {
        if (response.status === 401 || response.status === 403) {
          handleLogout();
          setError('Sesija baigėsi. Prašome prisijungti iš naujo.');
        } else {
          setError('Nepavyko užkrauti rezervacijų');
        }
      }
    } catch (err) {
      setError('Klaida jungiantis prie serverio');
      console.error('Error fetching reservations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchReservations();
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    let filtered = reservations;
    
    const now = new Date();
    filtered = filtered.filter(reservation => {
      const reservationDate = new Date(reservation.reservation_date);
      return reservationDate >= now;
    });
    
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(reservation => 
        reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.phone.toString().replace(/\.0+$/, '').includes(searchTerm) ||
        (reservation.additional_info && reservation.additional_info.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      if (sortField === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortField === 'reservation_date') {
        aValue = new Date(a.reservation_date).getTime();
        bValue = new Date(b.reservation_date).getTime();
      } else {
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredReservations(sorted);
  }, [searchTerm, reservations, sortField, sortOrder]);

  const handleDelete = async (id: number) => {
    if (!token) return;
    
    try {
      const response = await fetch(API_ENDPOINTS.RESERVATIONS.DELETE(id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setReservations(reservations.filter(r => r.id !== id));
        setDeleteConfirm(null);
      } else {
        if (response.status === 401 || response.status === 403) {
          handleLogout();
          setError('Sesija baigėsi. Prašome prisijungti iš naujo.');
        } else {
          alert('Nepavyko ištrinti rezervacijos');
        }
      }
    } catch (err) {
      alert('Klaida ištrinant rezervaciją');
      console.error('Error deleting reservation:', err);
    }
  };

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setToken(null);
    setIsAuthenticated(false);
    setReservations([]);
    setFilteredReservations([]);
  };

  const handleReservationSuccess = () => {
    fetchReservations();
    setIsReservationModalOpen(false);
  };

  const handleSubmitUpload = async () => {
    if (!token) return;
    if (!beforeFiles && !afterFiles) {
      setError('Pasirinkite bent vieną nuotrauką');
      return;
    }
    setError('');
    setUploading(true);
    try {
      if (beforeFiles && beforeFiles.length > 0) {
        const formDataBefore = new FormData();
        Array.from(beforeFiles).forEach((file) => formDataBefore.append('photos', file));
        if (caption) formDataBefore.append('caption', caption);
        const resB = await fetch(API_ENDPOINTS.PHOTOS.UPLOAD('before'), {
          method: 'POST',
          headers: { 
            Authorization: `Bearer ${token}`
          },
          body: formDataBefore,
        });
        const dataB = await resB.json().catch(() => ({ success: false }));
        if (!resB.ok || !dataB.success) {
          throw new Error(dataB.message || 'Nepavyko įkelti nuotraukų „Prieš"');
        }
      }
      if (afterFiles && afterFiles.length > 0) {
        const formDataAfter = new FormData();
        Array.from(afterFiles).forEach((file) => formDataAfter.append('photos', file));
        if (caption) formDataAfter.append('caption', caption);
        const resA = await fetch(API_ENDPOINTS.PHOTOS.UPLOAD('after'), {
          method: 'POST',
          headers: { 
            Authorization: `Bearer ${token}`
          },
          body: formDataAfter,
        });
        const dataA = await resA.json().catch(() => ({ success: false }));
        if (!resA.ok || !dataA.success) {
          throw new Error(dataA.message || 'Nepavyko įkelti nuotraukų „Po"');
        }
      }
      setIsUploadModalOpen(false);
      setCaption('');
      setBeforeFiles(null);
      setAfterFiles(null);
      fetchPhotos();
      alert('Nuotraukos sėkmingai įkeltos');
    } catch (e) {
      console.error('Upload error:', e);
      setError(e instanceof Error ? e.message : 'Nepavyko įkelti nuotraukų');
    } finally {
      setUploading(false);
    }
  };

  const fetchPhotos = async () => {
    if (!token) return;
    setIsLoadingPhotos(true);
    try {
      const response = await fetch(API_ENDPOINTS.PHOTOS.GET_ALL, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
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
      }
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Nepavyko užkrauti nuotraukų');
    } finally {
      setIsLoadingPhotos(false);
    }
  };

  const handleDeletePhoto = async (id: number) => {
    if (!token) return;
    try {
      const response = await fetch(API_ENDPOINTS.PHOTOS.DELETE(id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        fetchPhotos();
        setPhotoDeleteConfirm(null);
      } else {
        alert('Nepavyko ištrinti nuotraukos');
      }
    } catch (err) {
      alert('Klaida ištrinant nuotrauką');
      console.error('Error deleting photo:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'photos' && token) {
      fetchPhotos();
    }
  }, [activeTab, token]);

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReservations = filteredReservations.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortField, sortOrder]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const formatCreatedDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const formatPhone = (phone: string | number) => {
    const phoneStr = typeof phone === 'number' 
      ? Math.floor(phone).toString() 
      : phone.replace(/\.0+$/, '');
    
    if (phoneStr.length === 11 && phoneStr.startsWith('370')) {
      return `+${phoneStr.slice(0, 3)} ${phoneStr.slice(3, 6)} ${phoneStr.slice(6)}`;
    }
    
    if (phoneStr.length === 9 && phoneStr.startsWith('6')) {
      return `+370 ${phoneStr.slice(0, 3)} ${phoneStr.slice(3)}`;
    }
    
    if (phoneStr.length === 11) {
      return `+${phoneStr.slice(0, 3)} ${phoneStr.slice(3, 6)} ${phoneStr.slice(6)}`;
    }
    
    return phoneStr;
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Admin<span className="text-gray-600"> Panel</span>
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {activeTab === 'reservations' 
                    ? `${filteredReservations.length} ${filteredReservations.length === 1 ? 'rezervacija' : 'rezervacijos'}`
                    : `${photoGroups.length} ${photoGroups.length === 1 ? 'nuotraukų grupė' : 'nuotraukų grupės'}`
                  }
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsReservationModalOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md text-xs sm:text-sm font-semibold"
              >
                <Plus size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Pridėti rezervaciją</span>
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                disabled={uploading}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105 active:scale-95 disabled:bg-emerald-400 disabled:cursor-not-allowed shadow-md text-xs sm:text-sm font-semibold"
                aria-label="Įkelti nuotraukas"
              >
                <Upload size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Įkelti nuotraukas</span>
                <span className="sm:hidden">Įkelti</span>
              </button>
              <button
                onClick={fetchReservations}
                disabled={isLoading}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md text-xs sm:text-sm font-semibold"
              >
                <RefreshCw size={14} className={`sm:w-4 sm:h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Atnaujinti</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md text-xs sm:text-sm font-semibold"
              >
                <LogOut size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Atsijungti</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'reservations'
                  ? 'border-gray-800 text-gray-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar size={18} className="inline mr-2" />
              Rezervacijos
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'photos'
                  ? 'border-gray-800 text-gray-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ImageIcon size={18} className="inline mr-2" />
              Nuotraukos
            </button>
          </div>

          {activeTab === 'reservations' && (
          <div className="mt-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ieškoti pagal vardą, telefoną ar papildomą informaciją..."
                className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none shadow-sm transition-all duration-300 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setIsSortExpanded(!isSortExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">Rūšiuoti:</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {sortField === 'reservation_date' && '📅 Rezervacijos data'}
                    {sortField === 'created_at' && '🕐 Sukūrimo data'}
                    {sortField === 'name' && '👤 Vardas'}
                    {' '}
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                </div>
                {isSortExpanded ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>

              {isSortExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-100 animate-fade-in">
                  <div className="flex flex-col gap-3 pt-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSortField('reservation_date')}
                        className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                          sortField === 'reservation_date'
                            ? 'bg-gray-800 text-white shadow-md scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 active:scale-95'
                        }`}
                      >
                        📅 Rezervacijos data
                      </button>
                      <button
                        onClick={() => setSortField('created_at')}
                        className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                          sortField === 'created_at'
                            ? 'bg-gray-800 text-white shadow-md scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 active:scale-95'
                        }`}
                      >
                        🕐 Sukūrimo data
                      </button>
                      <button
                        onClick={() => setSortField('name')}
                        className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                          sortField === 'name'
                            ? 'bg-gray-800 text-white shadow-md scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 active:scale-95'
                        }`}
                      >
                        👤 Vardas
                      </button>
                    </div>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto"
                    >
                      {sortOrder === 'asc' ? (
                        <>
                          <ArrowUp size={16} />
                          <span>Didėjančia</span>
                        </>
                      ) : (
                        <>
                          <ArrowDown size={16} />
                          <span>Mažėjančia</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-md animate-fade-in">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {activeTab === 'reservations' && (
        <>
        {isLoading ? (
          <div className="text-center py-16 sm:py-24">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-gray-800"></div>
            <p className="mt-6 text-gray-600 text-lg font-medium">Kraunama...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <Calendar size={64} className="mx-auto text-gray-300 mb-6" />
              <p className="text-gray-600 text-xl font-semibold mb-2">
                {searchTerm ? 'Rezervacijų nerasta' : 'Rezervacijų nėra'}
              </p>
              <p className="text-gray-500 text-sm">
                {searchTerm ? 'Pabandykite pakeisti paieškos kriterijus' : 'Rezervacijos bus rodomos čia'}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Vardas
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Telefonas
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Rezervacijos data
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Papildoma info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Sukurta
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Veiksmai
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {currentReservations.map((reservation, index) => (
                    <tr key={reservation.id} className="hover:bg-gray-50 transition-all duration-200 group" style={{ animationDelay: `${index * 50}ms` }}>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-xs font-bold text-gray-700 group-hover:bg-gray-800 group-hover:text-white transition-all duration-300">
                          {reservation.id}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                            <User size={18} className="text-gray-600" />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{reservation.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-700 font-medium">{formatPhone(reservation.phone)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg inline-flex">
                          <Calendar size={16} className="text-blue-600" />
                          <span className="text-sm text-blue-900 font-semibold">{formatDate(reservation.reservation_date)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 max-w-xs">
                        <p className="text-sm text-gray-700 truncate">
                          {reservation.additional_info || <span className="text-gray-400 italic">-</span>}
                        </p>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                        {formatCreatedDate(reservation.created_at)}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        {deleteConfirm === reservation.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDelete(reservation.id)}
                              className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                              Patvirtinti
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-300 transition-all duration-300"
                            >
                              Atšaukti
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(reservation.id)}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 ml-auto font-semibold text-sm"
                          >
                            <Trash2 size={16} />
                            Ištrinti
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4 p-4">
              {currentReservations.map((reservation, index) => (
                <div 
                  key={reservation.id} 
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">{reservation.name}</p>
                        <p className="text-gray-300 text-xs">ID: #{reservation.id}</p>
                      </div>
                    </div>
                    {deleteConfirm === reservation.id ? (
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleDelete(reservation.id)}
                          className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all duration-300"
                        >
                          ✓ Patvirtinti
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1.5 bg-white/20 text-white text-xs font-bold rounded-lg hover:bg-white/30 transition-all duration-300"
                        >
                          × Atšaukti
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(reservation.id)}
                        className="p-2.5 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
                      >
                        <Trash2 size={18} className="text-white" />
                      </button>
                    )}
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone size={18} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Telefonas</p>
                        <a 
                          href={`tel:${reservation.phone}`}
                          className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {formatPhone(reservation.phone)}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3 shadow-sm border border-blue-100">
                      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar size={18} className="text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-blue-600 font-medium">Rezervacijos laikas</p>
                        <p className="text-sm font-bold text-blue-900">{formatDate(reservation.reservation_date)}</p>
                      </div>
                    </div>

                    {reservation.additional_info && (
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="text-xs text-gray-500 font-medium mb-2">Papildoma informacija</p>
                        <p className="text-sm text-gray-800 leading-relaxed">{reservation.additional_info}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Sukurta</p>
                      <p className="text-xs font-semibold text-gray-600">{formatCreatedDate(reservation.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-md border border-gray-200">
            <div className="text-sm text-gray-600">
              Rodoma {startIndex + 1}-{Math.min(endIndex, filteredReservations.length)} iš {filteredReservations.length} rezervacijų
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        currentPage === pageNum
                          ? 'bg-gray-800 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Kiek puslapyje:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        )}
        </>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={fetchPhotos}
                disabled={isLoadingPhotos}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md text-sm font-semibold"
              >
                <RefreshCw size={16} className={isLoadingPhotos ? 'animate-spin' : ''} />
                Atnaujinti
              </button>
            </div>

            {isLoadingPhotos ? (
              <div className="text-center py-16 sm:py-24">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-gray-800"></div>
                <p className="mt-6 text-gray-600 text-lg font-medium">Kraunamos nuotraukos...</p>
              </div>
            ) : photoGroups.length === 0 ? (
              <div className="text-center py-16 sm:py-24">
                <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                  <ImageIcon size={64} className="mx-auto text-gray-300 mb-6" />
                  <p className="text-gray-600 text-xl font-semibold mb-2">Nuotraukų nėra</p>
                  <p className="text-gray-500 text-sm mb-4">Įkelkite nuotraukas naudodami mygtuką viršuje</p>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-semibold"
                  >
                    Įkelti nuotraukas
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                {photoGroups.map((group, groupIndex) => (
                  <div
                    key={groupIndex}
                    className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-3 py-2 sm:px-4 sm:py-2.5 text-center">
                      <h3 className="text-white font-bold text-sm sm:text-base">
                        {group.caption}
                      </h3>
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
                                    <Image
                                      src={`${API_BASE_URL}${photo.photo_url}`}
                                      alt={group.caption}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                      fill
                                      sizes="(max-width: 768px) 50vw, 25vw"
                                      unoptimized={!API_BASE_URL || API_BASE_URL.startsWith('http')}
                                    />
                                    {photoDeleteConfirm === photo.id ? (
                                      <div 
                                        className="absolute inset-0 bg-black/80 rounded-lg flex flex-col items-center justify-center gap-2 p-2 z-20"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <button
                                          onClick={() => handleDeletePhoto(photo.id)}
                                          className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700"
                                        >
                                          Ištrinti
                                        </button>
                                        <button
                                          onClick={() => setPhotoDeleteConfirm(null)}
                                          className="px-3 py-1.5 bg-gray-600 text-white text-xs font-bold rounded-lg hover:bg-gray-700"
                                        >
                                          Atšaukti
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPhotoDeleteConfirm(photo.id);
                                        }}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 z-10"
                                        aria-label="Ištrinti nuotrauką"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    )}
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
                                    <Image
                                      src={`${API_BASE_URL}${photo.photo_url}`}
                                      alt={group.caption}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                      fill
                                      sizes="(max-width: 768px) 50vw, 25vw"
                                      unoptimized={!API_BASE_URL || API_BASE_URL.startsWith('http')}
                                    />
                                    {photoDeleteConfirm === photo.id ? (
                                      <div 
                                        className="absolute inset-0 bg-black/80 rounded-lg flex flex-col items-center justify-center gap-2 p-2 z-20"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <button
                                          onClick={() => handleDeletePhoto(photo.id)}
                                          className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700"
                                        >
                                          Ištrinti
                                        </button>
                                        <button
                                          onClick={() => setPhotoDeleteConfirm(null)}
                                          className="px-3 py-1.5 bg-gray-600 text-white text-xs font-bold rounded-lg hover:bg-gray-700"
                                        >
                                          Atšaukti
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPhotoDeleteConfirm(photo.id);
                                        }}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 z-10"
                                        aria-label="Ištrinti nuotrauką"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

        <ReservationModal 
          isOpen={isReservationModalOpen}
          onClose={() => setIsReservationModalOpen(false)}
          onSuccess={handleReservationSuccess} />

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2"
            aria-label="Uždaryti"
          >
            <X size={32} />
          </button>
          <Image
            src={selectedPhoto}
            alt="Padidinta nuotrauka"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40" onClick={() => !uploading && setIsUploadModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-6 my-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Įkelti nuotraukas</h2>
              <button
                onClick={() => !uploading && setIsUploadModalOpen(false)}
                disabled={uploading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                aria-label="Uždaryti"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                  Antraštė (caption)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Trumpas aprašymas..."
                  className="w-full px-4 py-3 text-base sm:text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                  Nuotraukos „Prieš“
                </label>  
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setBeforeFiles(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    id="before-files"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="before-files"
                    className={`flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      beforeFiles
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                    } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {beforeFiles && beforeFiles.length > 0 ? (
                      <div className="text-center px-4">
                        <Upload size={24} className="mx-auto text-emerald-600 mb-2" />
                        <p className="text-sm font-semibold text-emerald-700">
                          Pasirinkta: {beforeFiles.length} {beforeFiles.length === 1 ? 'failas' : 'failai'}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center px-4">
                        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-600">
                          <span className="text-emerald-600 font-semibold">Paspauskite čia</span> arba vilkite failus
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Pasirinkite nuotraukas</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                  Nuotraukos „Po“
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setAfterFiles(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    id="after-files"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="after-files"
                    className={`flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      afterFiles
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                    } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {afterFiles && afterFiles.length > 0 ? (
                      <div className="text-center px-4">
                        <Upload size={24} className="mx-auto text-emerald-600 mb-2" />
                        <p className="text-sm font-semibold text-emerald-700">
                          Pasirinkta: {afterFiles.length} {afterFiles.length === 1 ? 'failas' : 'failai'}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center px-4">
                        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-600">
                          <span className="text-emerald-600 font-semibold">Paspauskite čia</span> arba vilkite failus
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Pasirinkite nuotraukas</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-2 sm:pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={uploading}
                  className="flex-1 sm:flex-none px-6 py-3 sm:px-4 sm:py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base sm:text-sm"
                >
                  Atšaukti
                </button>
                <button
                  onClick={handleSubmitUpload}
                  disabled={uploading || (!beforeFiles && !afterFiles)}
                  className="flex-1 sm:flex-none px-6 py-3 sm:px-4 sm:py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed transition-all text-base sm:text-sm flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>Įkeliama...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      <span>Įkelti</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

