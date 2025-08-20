import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleSidebar, toggleNewsletterModal } from '../../store/slices/uiSlice';
import { XMarkIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSelector((state) => state.ui);
  const { categories } = useSelector((state) => state.category);
  const { tags } = useSelector((state) => state.category);

  const recentPosts = [
    {
      id: 1,
      title: 'Getting Started with React and Redux',
      slug: 'getting-started-react-redux',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Building Modern Web Applications',
      slug: 'building-modern-web-apps',
      date: '2024-01-10'
    },
    {
      id: 3,
      title: 'Understanding JavaScript Closures',
      slug: 'understanding-javascript-closures',
      date: '2024-01-05'
    }
  ];

  const popularTags = [
    { name: 'React', slug: 'react', count: 15 },
    { name: 'JavaScript', slug: 'javascript', count: 12 },
    { name: 'Web Development', slug: 'web-development', count: 10 },
    { name: 'CSS', slug: 'css', count: 8 },
    { name: 'Node.js', slug: 'nodejs', count: 6 }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 z-50 overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 lg:static lg:shadow-none lg:border-l lg:border-gray-200 lg:dark:border-gray-700`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Menu
          </h2>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Newsletter Signup */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <EnvelopeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Newsletter
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Get the latest posts delivered right to your inbox.
            </p>
            <button
              onClick={() => dispatch(toggleNewsletterModal())}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Subscribe Now
            </button>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Categories
            </h3>
            <div className="space-y-2">
              {categories?.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="flex items-center justify-between text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  <span>{category.name}</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {category.blog_count || 0}
                  </span>
                </Link>
              )) || (
                <div className="space-y-2">
                  <Link
                    to="/category/technology"
                    className="flex items-center justify-between text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <span>Technology</span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">12</span>
                  </Link>
                  <Link
                    to="/category/programming"
                    className="flex items-center justify-between text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <span>Programming</span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">8</span>
                  </Link>
                  <Link
                    to="/category/design"
                    className="flex items-center justify-between text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <span>Design</span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">5</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Recent Posts
            </h3>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="block group"
                >
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Link
                  key={tag.slug}
                  to={`/tag/${tag.slug}`}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  {tag.name}
                  <span className="ml-1 text-gray-500 dark:text-gray-400">
                    ({tag.count})
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Archive */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Archive
            </h3>
            <div className="space-y-2">
              <Link
                to="/archive/2024/01"
                className="flex items-center justify-between text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                <span>January 2024</span>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">5</span>
              </Link>
              <Link
                to="/archive/2023/12"
                className="flex items-center justify-between text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                <span>December 2023</span>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">8</span>
              </Link>
              <Link
                to="/archive/2023/11"
                className="flex items-center justify-between text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                <span>November 2023</span>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">12</span>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;