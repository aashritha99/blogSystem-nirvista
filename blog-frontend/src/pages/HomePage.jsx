import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getBlogs } from '../store/slices/blogSlice';
import { getCategories } from '../store/slices/categorySlice';
import { CalendarIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  const dispatch = useDispatch();
  const { blogs, isLoading } = useSelector((state) => state.blog);
  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getBlogs({ page: 1, page_size: 6 }));
    dispatch(getCategories());
  }, [dispatch]);

  const featuredPost = blogs?.[0];
  const recentPosts = blogs?.slice(1, 5) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to <span className="text-blue-600">BlogSystem</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
          Discover amazing stories, insights, and knowledge from our community of writers.
          Join us on a journey of learning and inspiration.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Start Writing
          </Link>
          <Link
            to="#featured"
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Explore Posts
          </Link>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section id="featured" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Featured Post
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              {featuredPost.featured_image && (
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.featured_image}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
              )}
              <div className={`p-8 ${featuredPost.featured_image ? 'md:w-1/2' : 'w-full'}`}>
                <div className="flex items-center space-x-4 mb-4">
                  {featuredPost.category && (
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                      {featuredPost.category.name}
                    </span>
                  )}
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {new Date(featuredPost.created_at).toLocaleDateString()}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  <Link
                    to={`/blog/${featuredPost.id}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {featuredPost.title}
                  </Link>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                  {featuredPost.excerpt || featuredPost.content?.substring(0, 200) + '...'}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {featuredPost.author?.username || 'Anonymous'}
                    </span>
                  </div>
                  <Link
                    to={`/blog/${featuredPost.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Recent Posts
        </h2>
        {recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {recentPosts.map((post) => (
              <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                {post.featured_image && (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-3">
                    {post.category && (
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-medium">
                        {post.category.name}
                      </span>
                    )}
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    <Link
                      to={`/blog/${post.id}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt || post.content?.substring(0, 150) + '...'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {post.author?.username || 'Anonymous'}
                      </span>
                    </div>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No posts available yet. Be the first to write one!
            </p>
            <Link
              to="/register"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Get Started
            </Link>
          </div>
        )}
      </section>

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
              >
                <TagIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.blog_count || 0} posts
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;