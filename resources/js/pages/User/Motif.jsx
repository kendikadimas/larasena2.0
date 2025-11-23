import UserLayout from '@/layouts/User/Layout'; 
import { Search, Heart, Eye, User, Star } from 'lucide-react'; 
import { useState, useEffect, useCallback } from 'react';
import { router, Link } from '@inertiajs/react'; 



export default function Motif({ motifs: motifsProp = {}, filters = {} }) {
  
  const motifsData = motifsProp?.data || [];
  const paginationLinks = motifsProp?.links || [];
  const totalMotifs = motifsProp?.total || 0;


  const [selectedCategory, setSelectedCategory] = useState(filters.category || 'Semua');
  const [searchQuery, setSearchQuery] = useState(filters.search || '');

  const filterCategories = ['Semua', 'Tradisional', 'Modern', 'Kontemporer', 'Nusantara'];

 
  const handleFilterChange = useCallback(() => {
    const params = new URLSearchParams();
   
    if (selectedCategory !== 'Semua') params.append('category', selectedCategory);
    if (searchQuery.trim()) params.append('search', searchQuery.trim());

   
    params.delete('page');

    const url = params.toString() ? `/motif?${params.toString()}` : '/motif';

    router.get(url, {}, {
      preserveState: true, 
      preserveScroll: true, 
      replace: true, 
    });
  }, [selectedCategory, searchQuery]); 

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

 
  useEffect(() => {
    const initialCategory = filters.category || 'Semua';
    if (selectedCategory !== initialCategory) {
       handleFilterChange();
    }
  }, [selectedCategory]);




  useEffect(() => {
    const initialSearch = filters.search || '';
    const timeout = setTimeout(() => {
      if (searchQuery !== initialSearch) {
        handleFilterChange();
      }
    }, 500); 

    return () => clearTimeout(timeout); 

  }, [searchQuery, filters.search]); 


  return (
    <UserLayout title="Motif Batik">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-[#BA682A]">Galeri Motif Batik</h1>
     
          <div className="text-sm text-gray-500">{totalMotifs} motif tersedia</div>
        </div>
        <p className="text-gray-600 text-lg">
          Jelajahi keindahan dan filosofi di balik setiap motif batik nusantara
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
         
          <div className="flex flex-wrap gap-2">
            {filterCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform ${
                  selectedCategory === category
                    ? 'text-white bg-[#BA682A] shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

       
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari motif..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#BA682A] focus:border-transparent transition"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {motifsData.length > 0 ? (
          motifsData.map((motif) => (
            <div
              key={motif.id}
              className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={motif.image_url}
                  alt={motif.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => e.target.src = 'https://placehold.co/600x600/eee/ccc?text=Image+Error'}
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-[#BA682A]/90">
                    {motif.category}
                  </span>
                </div>
                {motif.is_featured && (
                  <div className="absolute top-3 right-3 bg-yellow-400 rounded-full p-1.5 shadow-lg">
                    <Star className="w-4 h-4 text-white fill-current" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {motif.name}
                </h3>
                {motif.description && (
                   <p className="text-sm text-gray-600 line-clamp-2 mb-3">{motif.description}</p>
                )}

                {/* Publisher Info for Community Motifs */}
                {motif.is_published && motif.user && (
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                        {motif.user.profile_photo_url ? (
                          <img
                            src={motif.user.profile_photo_url}
                            alt={motif.user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                      </div>
                      <span className="text-xs text-gray-600 font-medium truncate flex-1">
                        {motif.user.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {motif.likes_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {motif.views_count}
                        </span>
                      </div>
                      <Link
                        href={`/galeri-motif/${motif.slug}`}
                        className="text-amber-600 hover:text-amber-700 font-medium"
                      >
                        Lihat Detail →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
             <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada motif ditemukan.</p>
            <p className="text-gray-400 text-sm">Coba ubah filter atau kata kunci pencarian Anda.</p>
          </div>
        )}
      </div>

      
      {paginationLinks && paginationLinks.length > 3 && (
        <div className="flex justify-center mt-10 flex-wrap gap-2">
          {paginationLinks.map((link, index) =>
            link.url ? (
              <Link
                key={index}
                href={link.url}
                preserveState
                preserveScroll
                className={`px-4 py-2 rounded-lg border text-sm transition ${
                  link.active
                    ? 'bg-[#BA682A] text-white border-[#BA682A] shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ) : (
              <span
                key={index}
                className="px-4 py-2 rounded-lg border text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            )
          )}
        </div>
      )}
    </UserLayout>
  );
}

