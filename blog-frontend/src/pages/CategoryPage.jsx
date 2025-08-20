import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogsByCategory } from '../store/slices/blogSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { CalendarIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const CategoryPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { blogs, isLoading } = useSelector((state) => state.blog);
  const { categories } = useSelector((state) => state.category);
  
  const currentCategory = categories.find(cat => cat.slug === slug);

  useEffect(() => {
    if (slug) {
      dispatch(fetchBlogsByCategory(slug));
    }
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, slug, categories.length]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-12">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            Home
          </Link>
          <ArrowRightIcon className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">
            {currentCategory?.name || 'Category'}
          </span>
        </nav>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {currentCategory?.name || 'Category'}
        </h1>
        
        {currentCategory?.description && (
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
            {currentCategory.description}
          </p>
        )}
        
        <div className="mt-6">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {blogs.length} {blogs.length === 1 ? 'post' : 'posts'} found
          </span>
        </div>
      </div>

      {/* Blog Posts Grid */}
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article key={blog.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Featured Image */}
              {blog.featured_image ? (
                <div className="h-48 overflow-hidden">
                  <img
                    src={blog.featured_image}
                    alt={blog.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-lg font-medium">
                    {blog.title.charAt(0)}
                  </span>
                </div>
              )}
              
              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  <Link
                    to={`/blog/${blog.id}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {blog.title}
                  </Link>
                </h2>
                
                {blog.excerpt && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {truncateText(blog.excerpt)}
                  </p>
                )}
                
                {/* Meta Information */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <UserIcon className="w-4 h-4" />
                      <span>{blog.author?.first_name} {blog.author?.last_name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(blog.created_at)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <Link
                        key={tag.id}
                        to={`/tag/${tag.slug}`}
                        className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="inline-block text-gray-500 dark:text-gray-400 px-2 py-1 text-xs">
                        +{blog.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                {/* Read More Link */}
                <div className="mt-4">
                  <Link
                    to={`/blog/${blog.id}`}
                    className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-500 font-medium text-sm"
                  >
                    <span>Read more</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              There are no blog posts in this category yet.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <span>Browse All Posts</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;