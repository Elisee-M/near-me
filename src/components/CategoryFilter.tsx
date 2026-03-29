const CATEGORIES = [
  'All',
  'Restaurant',
  'Hotel',
  'Clothing Shop',
  'Papeterie',
  'Lounge',
  'Other',
];

type Props = {
  selected: string;
  onChange: (cat: string) => void;
};

const CategoryFilter = ({ selected, onChange }: Props) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selected === cat
              ? 'gradient-primary text-primary-foreground shadow-md'
              : 'glass-card text-muted-foreground hover:text-foreground'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
