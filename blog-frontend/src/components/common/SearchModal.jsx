import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { toggleSearchModal } from '../../store/slices/uiSlice';
import { blogAPI } from '../../services/api';
import toast from 'react-hot-toast';

const SearchModal = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(toggleSearchModal());
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const response = await blogAPI.getBlogs({ search: searchQuery, page_size: 10 });
      setResults(response.data.results || []);
    } catch (error) {
      toast.error('Failed to search blogs');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleResultClick = () => {
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-96 overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blog posts..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={handleClose}
            className="ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Searching...</span>
            </div>
          ) : hasSearched ? (
            results.length > 0 ? (
              <div className="py-2">
                {results.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    onClick={handleResultClick}
                    className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex items-start space-x-3">
                      {post.featured_image && (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {post.excerpt || post.content?.substring(0, 100) + '...'}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="text-xs text-gray-400">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                          {post.category && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                              {post.category.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                <MagnifyingGlassIcon className="w-12 h-12 mb-2" />
                <p className="text-sm">No results found for "{query}"</p>
                <p className="text-xs mt-1">Try different keywords or check spelling</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
              <MagnifyingGlassIcon className="w-12 h-12 mb-2" />
              <p className="text-sm">Start typing to search blog posts</p>
              <p className="text-xs mt-1">Search by title, content, or category</p>
            </div>
          )}
        </div>

        {/* Search Tips */}
        {!hasSearched && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Press ESC to close</span>
              <span>Enter to search</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;