import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import UserLayout from '@/layouts/User/Layout';
import SEO from '@/components/SEO';
import { Phone, MapPin, Star, StarOff, CheckCircle, MessageSquare, Trash2, Edit2, ShoppingBag, Image as ImageIcon } from 'lucide-react';

export default function KonveksiDetail({ konveksi, userReview, auth }) {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        rating: userReview?.rating || 5,
        comment: userReview?.comment || '',
    });

    const handleSubmitReview = (e) => {
        e.preventDefault();
        post(route('konveksi.review.store', konveksi.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowReviewForm(false);
                setEditMode(false);
                reset();
            },
        });
    };

    const handleDeleteReview = () => {
        if (confirm('Yakin ingin menghapus review Anda?')) {
            router.delete(route('konveksi.review.delete', konveksi.id), {
                preserveScroll: true,
            });
        }
    };

    const renderStars = (rating, interactive = false, onRate = null) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type={interactive ? "button" : undefined}
                        onClick={interactive ? () => onRate(star) : undefined}
                        disabled={!interactive}
                        className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}
                    >
                        <Star
                            className={`w-5 h-5 ${
                                star <= rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                            }`}
                        />
                    </button>
                ))}
            </div>
        );
    };
    
    const gallery = konveksi.documentation_url || [];

    return (
        <UserLayout title={konveksi.name}>
            <Head title={konveksi.name} />
            <SEO 
                title={konveksi.name}
                description={konveksi.description || `${konveksi.name} - Konveksi batik terpercaya di ${konveksi.location}. Rating ${konveksi.rating}/5 dari ${konveksi.reviews?.length || 0} review.`}
                keywords={`${konveksi.name}, konveksi batik, ${konveksi.location}, produksi batik, ${konveksi.is_verified ? 'terverifikasi' : ''}`}
                image={konveksi.thumbnail_url || konveksi.icon_url}
            />

            <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        {/* Icon */}
                        <img 
                            src={konveksi.icon_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(konveksi.name)}&size=128&background=BA682A&color=fff`} 
                            alt={konveksi.name}
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full shadow-lg border-4 border-gray-100 object-cover"
                        />
                        
                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-start gap-3 mb-3">
                                <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">{konveksi.name}</h1>
                                {konveksi.is_verified && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs sm:text-sm font-semibold">
                                        <CheckCircle className="w-4 h-4" />
                                        Bermitra
                                    </div>
                                )}
                            </div>
                            
                            {/* Rating Display */}
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                    {renderStars(Math.round(konveksi.average_rating))}
                                    <span className="text-lg font-bold text-gray-800">
                                        {konveksi.average_rating ? konveksi.average_rating.toFixed(1) : '0.0'}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        ({konveksi.reviews_count} review{konveksi.reviews_count !== 1 ? 's' : ''})
                                    </span>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600">
                                {konveksi.location && (
                                    <span className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#BA682A]"/> 
                                        {konveksi.location}
                                    </span>
                                )}
                                {konveksi.no_telp && (
                                    <a 
                                        href={`tel:${konveksi.no_telp}`}
                                        className="flex items-center gap-2 hover:text-[#BA682A] transition-colors"
                                    >
                                        <Phone className="w-4 h-4"/> 
                                        {konveksi.no_telp}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deskripsi dan Galeri */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Deskripsi */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-[#BA682A] mb-4 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Tentang Kami
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                {konveksi.description || 'Informasi detail tentang konveksi ini belum tersedia.'}
                            </p>
                        </div>

                        <Link 
                            href={route('production.create', { konveksi_id: konveksi.id })}
                            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-[#BA682A] to-[#A0522D] text-white font-bold rounded-xl hover:shadow-lg transition-all"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Pesan Produksi Sekarang
                        </Link>
                    </div>

                    {/* Galeri Foto */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-[#BA682A] mb-4 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5" />
                            Galeri Portfolio
                        </h2>
                        {gallery.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                {gallery.map((image, index) => (
                                    <div key={index} className="aspect-square rounded-xl overflow-hidden shadow-md group">
                                        <img 
                                            src={image}
                                            alt={`Galeri ${konveksi.name} ${index + 1}`} 
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="aspect-video bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                                <div className="text-center">
                                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>Belum ada galeri portfolio</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Review Section */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                            Review & Rating
                        </h2>
                        
                        {auth.user && !userReview && !showReviewForm && (
                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#BA682A] text-white font-semibold rounded-xl hover:bg-[#A0522D] transition-colors text-sm sm:text-base"
                            >
                                <Edit2 className="w-4 h-4" />
                                Tulis Review
                            </button>
                        )}
                    </div>

                    {/* User's Review (if exists) */}
                    {userReview && !editMode && (
                        <div className="mb-6 p-4 sm:p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="font-semibold text-gray-800 mb-2">Review Anda</p>
                                    {renderStars(userReview.rating)}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditMode(true);
                                            setData({
                                                rating: userReview.rating,
                                                comment: userReview.comment,
                                            });
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                        title="Edit Review"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleDeleteReview}
                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                        title="Hapus Review"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            {userReview.comment && (
                                <p className="text-gray-700 text-sm sm:text-base">{userReview.comment}</p>
                            )}
                        </div>
                    )}

                    {/* Review Form */}
                    {(showReviewForm || editMode) && auth.user && (
                        <form onSubmit={handleSubmitReview} className="mb-6 p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Rating Anda
                                    </label>
                                    {renderStars(data.rating, true, (rating) => setData('rating', rating))}
                                    {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Komentar (opsional)
                                    </label>
                                    <textarea
                                        value={data.comment}
                                        onChange={(e) => setData('comment', e.target.value)}
                                        rows="4"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent text-sm"
                                        placeholder="Ceritakan pengalaman Anda dengan konveksi ini..."
                                    />
                                    {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment}</p>}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 px-6 py-3 bg-[#BA682A] text-white font-semibold rounded-xl hover:bg-[#A0522D] disabled:opacity-50 transition-colors"
                                    >
                                        {processing ? 'Menyimpan...' : (editMode ? 'Update Review' : 'Kirim Review')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowReviewForm(false);
                                            setEditMode(false);
                                            reset();
                                        }}
                                        className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {konveksi.reviews && konveksi.reviews.length > 0 ? (
                            konveksi.reviews.map((review) => (
                                <div key={review.id} className="p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-semibold text-gray-800 mb-1">{review.user.name}</p>
                                            <div className="flex items-center gap-2">
                                                {renderStars(review.rating)}
                                                <span className="text-xs text-gray-500">{review.created_at}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {review.comment && (
                                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{review.comment}</p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <StarOff className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Belum ada review. Jadilah yang pertama memberikan review!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}