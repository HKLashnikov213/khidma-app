import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Fzf } from 'fzf';
import { ChevronDown, XCircle, Search } from 'lucide-react';

const AdvancedFilterSystem = ({ categories, filters, onFilterChange }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);

  // Moteur de recherche flou (FZF) pour 1000+ catégories
  const fzf = useMemo(() => new Fzf(Object.keys(categories), {
    selector: item => categories[item].name,
    tiebreakers: [(a, b, selector) => selector(a).length - selector(b).length]
  }), [categories]);

  // Système de suggestions IA
  const aiSuggestions = useMemo(() => {
    if (!searchQuery) return [];
    return fzf.find(searchQuery).slice(0, 5).map(item => ({
      path: item,
      ...categories[item]
    }));
  }, [searchQuery, fzf]);

  // Gestion intelligente des catégories
  const categoryTree = useMemo(() => {
    const buildTree = (paths, level = 0) => {
      const tree = {};
      paths.forEach(path => {
        const segments = path.split('.');
        const current = segments.slice(0, level + 1).join('.');
        if (!tree[current]) {
          tree[current] = {
            ...categories[path],
            children: {},
            fullPath: path
          };
        }
        if (segments.length > level + 1) {
          tree[current].children = buildTree(
            paths.filter(p => p.startsWith(current + '.')),
            level + 1
          );
        }
      });
      return tree;
    };
    return buildTree(Object.keys(categories));
  }, [categories]);

  // Simulation d'IA (à remplacer par un vrai endpoint)
  const handleAIAssist = async () => {
    setIsAIThinking(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Logique IA réelle ici
    setIsAIThinking(false);
  };

  return (
    <div className="ai-filter-system">
      <div className="search-bar-container">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder={t('search_placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyUp={handleAIAssist}
        />
        <button 
          className="ai-assist-button"
          onClick={handleAIAssist}
          disabled={isAIThinking}
        >
          {isAIThinking ? t('thinking') : t('ai_assist')}
        </button>
      </div>

      <div className="filter-sections">
        {/* Filtre Hiérarchique des Catégories */}
        <div className="category-tree-filter">
          {Object.values(categoryTree).map(category => (
            <CategoryTreeNode 
              key={category.fullPath}
              category={category}
              selected={filters.category}
              onSelect={(path) => onFilterChange({ ...filters, category: path })}
              depth={0}
            />
          ))}
        </div>

        {/* Filtres Avancés */}
        <div className="range-filters">
          <div className="filter-group">
            <label>{t('minimum_rating')}</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.rating}
              onChange={(e) => onFilterChange({ ...filters, rating: e.target.value })}
            />
            <div className="rating-display">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} filled={i < filters.rating} />
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>{t('price_range')}</label>
            <MultiRangeSlider
              min={0}
              max={10000}
              onChange={([min, max]) => onFilterChange({ ...filters, priceRange: [min, max] })}
            />
          </div>
        </div>
      </div>

      {/* Suggestions IA */}
      {aiSuggestions.length > 0 && (
        <div className="ai-suggestions">
          {aiSuggestions.map(suggestion => (
            <div
              key={suggestion.fullPath}
              className="suggestion-item"
              onClick={() => onFilterChange({ ...filters, category: suggestion.fullPath })}
            >
              {suggestion.name}
              <span className="service-count">{suggestion.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant récursif pour l'arbre des catégories
const CategoryTreeNode = ({ category, selected, onSelect, depth }) => (
  <div 
    className={`category-node ${selected === category.fullPath ? 'selected' : ''}`}
    style={{ paddingLeft: `${depth * 1.5}rem` }}
  >
    <div className="node-content" onClick={() => onSelect(category.fullPath)}>
      <ChevronDown className="caret-icon" />
      <span>{category.name}</span>
      <span className="service-count">{category.count}</span>
    </div>
    {Object.values(category.children).map(child => (
      <CategoryTreeNode
        key={child.fullPath}
        category={child}
        selected={selected}
        onSelect={onSelect}
        depth={depth + 1}
      />
    ))}
  </div>
);

export default AdvancedFilterSystem;