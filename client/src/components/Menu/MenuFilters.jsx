import { useApp } from '../../context/AppContext'

const regionOptions = [
  { value: 'northern', th: 'ภาคเหนือ', en: 'Northern' },
  { value: 'northeastern', th: 'ภาคอีสาน', en: 'Northeastern' },
  { value: 'central', th: 'ภาคกลาง', en: 'Central' },
  { value: 'southern', th: 'ภาคใต้', en: 'Southern' },
]

const healthOptions = [
  { value: 'diabetes', th: 'คุมเบาหวาน', en: 'Diabetes' },
  { value: 'low_sodium', th: 'โรคไต (โซเดียมต่ำ)', en: 'Low Sodium' },
  { value: 'allergy_free', th: 'แพ้อาหาร', en: 'Allergy Friendly' },
]

export default function MenuFilters({ filters, setFilters }) {
  const { language } = useApp() || { language: 'th' };

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }))
  }

  const toggleFilter = (type, value) => {
    setFilters(prev => {
      const isSelected = prev[type].includes(value);
      return {
        ...prev,
        [type]: isSelected 
          ? prev[type].filter(item => item !== value)
          : [...prev[type], value]
      }
    })
  }

  const chipClass = (active) =>
    `rounded-full border px-3 py-1.5 text-sm transition cursor-pointer ${
      active
        ? 'border-[#8b5e34] bg-[#8b5e34] text-white'
        : 'border-[#d4c5b0] hover:border-[#8b5e34] hover:bg-[#8b5e34]/10'
    }`

  return (
    <aside className="bg-[#faf7f2] dark:bg-[#3b2a1a] h-fit rounded-2xl p-5 border border-[#d4c5b0] dark:border-[#523a24] lg:sticky lg:top-24">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#523a24] dark:text-[#f0e6d8]">
          {language === 'th' ? 'ค้นหาและตัวกรอง' : 'Search & Filters'}
        </h2>
        <button 
          onClick={() => setFilters({ search: '', region: [], health: [], element: '' })} 
          className="text-xs underline opacity-60 hover:opacity-100 text-[#8b5e34]"
        >
          {language === 'th' ? 'ล้างทั้งหมด' : 'Clear All'}
        </button>
      </div>

      <div className="mb-6">
        <input 
          type="text" 
          value={filters.search}
          onChange={handleSearchChange}
          placeholder={language === 'th' ? "ค้นหาชื่อเมนู..." : "Search menu..."}
          className="w-full p-2.5 rounded-lg border border-[#d4c5b0] bg-white dark:bg-[#523a24] dark:border-[#755535] focus:outline-none focus:ring-2 focus:ring-[#8b5e34]"
        />
      </div>

      <div className="mb-6">
        <p className="mb-2 text-sm font-medium">{language === 'th' ? 'ภูมิภาค' : 'Region'}</p>
        <div className="flex flex-wrap gap-2">
          {regionOptions.map((item) => (
            <button 
              key={item.value} 
              onClick={() => toggleFilter('region', item.value)} 
              className={chipClass(filters.region.includes(item.value))}
            >
              {item[language]}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-sm font-medium">{language === 'th' ? 'สุขภาพ' : 'Health'}</p>
        <div className="space-y-2 flex flex-col">
          {healthOptions.map((item) => (
            <label key={item.value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input 
                type="checkbox" 
                checked={filters.health.includes(item.value)} 
                onChange={() => toggleFilter('health', item.value)} 
                className="accent-[#8b5e34] w-4 h-4" 
              />
              {item[language]}
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}