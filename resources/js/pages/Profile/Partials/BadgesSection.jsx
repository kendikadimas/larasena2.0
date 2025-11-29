import { Award, Trophy, Star, Heart, Zap, Target, Crown, Medal } from 'lucide-react';

// Badge icon mapping
const badgeIcons = {
    'award': Award,
    'trophy': Trophy,
    'star': Star,
    'heart': Heart,
    'zap': Zap,
    'target': Target,
    'crown': Crown,
    'medal': Medal,
};

// Badge color schemes
const badgeColors = {
    'first_design': 'from-blue-500 to-blue-600',
    'first_publish': 'from-purple-500 to-purple-600',
    'popular_creator': 'from-pink-500 to-pink-600',
    'design_master': 'from-amber-500 to-amber-600',
    'community_favorite': 'from-red-500 to-red-600',
    'rising_star': 'from-cyan-500 to-cyan-600',
    'early_adopter': 'from-green-500 to-green-600',
    'innovator': 'from-indigo-500 to-indigo-600',
    'default': 'from-gray-500 to-gray-600',
};

export default function BadgesSection({ badges = [], className = '' }) {
    const getBadgeColor = (badgeKey) => {
        return badgeColors[badgeKey] || badgeColors['default'];
    };

    const getBadgeIcon = (iconName) => {
        const IconComponent = badgeIcons[iconName?.toLowerCase()] || Award;
        return IconComponent;
    };

    return (
        <section className={className}>
            <header className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-[#BA682A]" />
                    Badge & Pencapaian
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Koleksi badge yang telah Anda raih
                </p>
            </header>

            {badges.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium mb-2">
                        Belum Ada Badge
                    </p>
                    <p className="text-gray-400 text-sm">
                        Mulai berkarya untuk mendapatkan badge pertama Anda!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {badges.map((badge) => {
                        const IconComponent = getBadgeIcon(badge.badge_icon);
                        const colorClass = getBadgeColor(badge.badge_key);

                        return (
                            <div
                                key={badge.id}
                                className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Badge Icon */}
                                <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                    <IconComponent className="w-8 h-8 text-white" />
                                </div>

                                {/* Badge Name */}
                                <h3 className="text-center font-bold text-gray-800 text-sm mb-1 line-clamp-2">
                                    {badge.badge_name}
                                </h3>

                                {/* Awarded Date */}
                                <p className="text-center text-xs text-gray-500">
                                    {badge.awarded_at}
                                </p>

                                {/* Meta Information Tooltip */}
                                {badge.meta && Object.keys(badge.meta).length > 0 && (
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl whitespace-nowrap">
                                            {Object.entries(badge.meta).map(([key, value]) => (
                                                <div key={key}>
                                                    <span className="font-semibold capitalize">{key}:</span> {value}
                                                </div>
                                            ))}
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                                <div className="border-4 border-transparent border-t-gray-900"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Shine Effect */}
                                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Badge Stats */}
            {badges.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-6 text-center">
                        <div>
                            <p className="text-3xl font-bold text-[#BA682A]">{badges.length}</p>
                            <p className="text-sm text-gray-600">Total Badge</p>
                        </div>
                        <div className="w-px h-12 bg-gray-200"></div>
                        <div>
                            <p className="text-3xl font-bold text-purple-600">
                                {new Set(badges.map(b => b.badge_key.split('_')[0])).size}
                            </p>
                            <p className="text-sm text-gray-600">Kategori</p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
