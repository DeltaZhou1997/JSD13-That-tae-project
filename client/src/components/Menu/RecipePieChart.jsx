const INGREDIENT_COLORS = [
  '#8b5e34',
  '#c58a55',
  '#d6b37a',
  '#6f8b6b',
  '#9b7b66',
  '#b98b83',
  '#7d8f9b',
];

const ELEMENT_COLORS = {
  ดิน: '#b58145',
  น้ำ: '#4b8daa',
  ลม: '#5d9c76',
  ไฟ: '#c65f52',
};

const ELEMENT_ORDER = ['ดิน', 'น้ำ', 'ลม', 'ไฟ'];

const getQuantity = (item) => {
  const value = Number(item?.quantity);
  return Number.isFinite(value) && value > 0 ? value : 0;
};

const toPercent = (value, total) => (total > 0 ? (value / total) * 100 : 0);

const buildIngredientSlices = (recipe) => {
  const items = recipe
    .map((item) => ({
      name: item.nameTh || item.ingredientId || 'วัตถุดิบ',
      value: getQuantity(item),
      unit: item.unit || '',
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = items.reduce((sum, item) => sum + item.value, 0);
  const maxVisibleSlices = 6;
  const visible = items.slice(0, maxVisibleSlices);
  const remaining = items.slice(maxVisibleSlices);

  if (remaining.length > 0) {
    visible.push({
      name: `อื่น ๆ (${remaining.length} รายการ)`,
      value: remaining.reduce((sum, item) => sum + item.value, 0),
      unit: '',
    });
  }

  return visible.map((item, index) => ({
    ...item,
    percentage: toPercent(item.value, total),
    color: INGREDIENT_COLORS[index % INGREDIENT_COLORS.length],
  }));
};

const buildElementSlices = (recipe) => {
  const scores = Object.fromEntries(ELEMENT_ORDER.map((element) => [element, 0]));

  recipe.forEach((item) => {
    const quantity = getQuantity(item);
    if (!quantity) return;

    const elements = Array.isArray(item.elements)
      ? item.elements.filter((element) => ELEMENT_ORDER.includes(element))
      : [];

    if (elements.length === 0) return;

    // Split an ingredient's quantity evenly when the mock data maps it to
    // multiple elements, preventing that ingredient from being double-counted.
    const share = quantity / elements.length;
    elements.forEach((element) => {
      scores[element] += share;
    });
  });

  const total = Object.values(scores).reduce((sum, value) => sum + value, 0);

  return ELEMENT_ORDER
    .map((element) => ({
      name: `ธาตุ${element}`,
      value: scores[element],
      percentage: toPercent(scores[element], total),
      color: ELEMENT_COLORS[element],
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
};

function DonutChart({ title, subtitle, slices, centerLabel, centerCaption, showQuantity = false }) {
  let offset = 0;

  return (
    <article className="rounded-2xl border border-stone-200/80 bg-[#faf8f5] p-5 sm:p-6">
      <div className="mb-5">
        <h3 className="text-base font-extrabold text-stone-900">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-stone-500">{subtitle}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-[180px_1fr] sm:items-center">
        <div className="mx-auto w-full max-w-[180px]">
          <svg
            viewBox="0 0 120 120"
            className="h-auto w-full"
            role="img"
            aria-label={title}
          >
            <circle cx="60" cy="60" r="44" fill="none" stroke="#ece7e1" strokeWidth="18" />
            {slices.map((slice) => {
              const currentOffset = offset;
              offset += slice.percentage;
              return (
                <circle
                  key={slice.name}
                  cx="60"
                  cy="60"
                  r="44"
                  fill="none"
                  stroke={slice.color}
                  strokeWidth="18"
                  pathLength="100"
                  strokeDasharray={`${slice.percentage} ${100 - slice.percentage}`}
                  strokeDashoffset={-currentOffset}
                  strokeLinecap="butt"
                  transform="rotate(-90 60 60)"
                />
              );
            })}
            <circle cx="60" cy="60" r="31" fill="#ffffff" />
            <text
              x="60"
              y="58"
              textAnchor="middle"
              className="fill-stone-900 text-[12px] font-extrabold"
            >
              {centerLabel}
            </text>
            <text
              x="60"
              y="70"
              textAnchor="middle"
              className="fill-stone-500 text-[6px] font-medium"
            >
              {centerCaption}
            </text>
          </svg>
        </div>

        <div className="space-y-2.5">
          {slices.map((slice) => (
            <div key={slice.name} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="truncate font-semibold text-stone-700" title={slice.name}>
                  {slice.name}
                </span>
              </div>
              <div className="shrink-0 text-right">
                <span className="font-extrabold text-stone-900">{slice.percentage.toFixed(1)}%</span>
                {showQuantity && slice.unit && (
                  <span className="ml-1.5 text-[10px] font-medium text-stone-400">
                    {slice.value.toLocaleString('th-TH')} {slice.unit}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function RecipePieCharts({ recipe }) {
  const safeRecipe = Array.isArray(recipe) ? recipe : [];
  const ingredientSlices = buildIngredientSlices(safeRecipe);
  const elementSlices = buildElementSlices(safeRecipe);

  if (ingredientSlices.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#8b5e34]" />
        <h3 className="text-sm font-bold text-stone-800">สัดส่วนทางโภชนาการ</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DonutChart
          title="สัดส่วนวัตถุดิบ"
          subtitle="คำนวณจากปริมาณวัตถุดิบ 1 หน่วยบริโภค ( 2 เสิร์ฟ )"
          slices={ingredientSlices}
          centerLabel="วัตถุดิบ"
          showQuantity
        />
        <DonutChart
          title="สัดส่วนธาตุเจ้าเรือน"
          subtitle="ร้อยละของธาตุเจ้าเรือนในอาหารเมนูนี้ตามสัดส่วนวัตถุดิบ"
          slices={elementSlices}
          centerLabel={elementSlices[0].name}
          centerCaption="ธาตุหลักของเมนู"
        />
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-stone-400">
        * กราฟนี้ใช้ค่าปริมาณจาก recipe ตามที่ระบุไว้ (g/ml) เพื่อแสดงสัดส่วนในแต่ละด้านของสูตรอาหาร
      </p>
    </div>
  );
}