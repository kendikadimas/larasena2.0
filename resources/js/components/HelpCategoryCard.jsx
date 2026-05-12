export default function HelpCategoryCard({ cat, onClick }) {
  return (
    <button
      onClick={() => onClick && onClick(cat.name)}
      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-200 border border-[#E8E5DC] hover:border-[#D9D5CC] flex flex-col items-center text-center"
    >
      <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-4 ${cat.bg} ${cat.color}`}>
        {cat.icon}
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${cat.color}`}>{cat.name}</h3>
      <p className="text-[#4E8070] text-sm line-clamp-2">{cat.desc}</p>
    </button>
  );
}
