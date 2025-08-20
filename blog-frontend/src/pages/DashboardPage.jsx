import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBlogs } from '../store/slices/blogSlice';
import { fetchCategories, fetchTags } from '../store/slices/categorySlice';
import { fetchPendingComments } from '../store/slices/commentSlice';
import {
  DocumentTextIcon,
  TagIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { blogs, isLoading: blogsLoading } = useSelector((state) => state.blog);
  const { categories, tags, isLoading: categoriesLoading } = useSelector((state) => state.category);
  const { pendingComments, isLoading: commentsLoading } = useSelector((state) => state.comment);
  const { user } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(fetchBlogs());
    dispatch(fetchCategories());
    dispatch(fetchTags());
    dispatch(fetchPendingComments());
  }, [dispatch]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const stats = [
    {
      name: 'Total Posts',
      value: blogs?.length || 0,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      href: '#posts'
    },
    {
      name: 'Categories',
      value: categories?.length || 0,
      icon: TagIcon,
      color: 'bg-green-500',
      href: '#categories'
    },
    {
      name: 'Pending Comments',
      value: pendingComments?.length || 0,
      icon: ChatBubbleLeftIcon,
      color: 'bg-yellow-500',
      href: '#comments'
    },
    {
      name: 'Tags',
      value: tags?.length || 0,
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      href: '#tags'
    },
  ];

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'posts', name: 'Posts' },
    { id: 'categories', name: 'Categories' },
    { id: 'comments', name: 'Comments' },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Posts
            </h3>
            <Link
              to="/dashboard/posts/new"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 text-sm font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {blogs?.slice(0, 5).map((blog) => (
              <div key={blog.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {blog.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(blog.created_at)}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  blog.status === 'published'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {blog.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Comments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Pending Comments
            </h3>
            <Link
              to="/dashboard/comments"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 text-sm font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {pendingComments?.slice(0, 5).map((comment) => (
              <div key={comment.id} className="border-l-4 border-yellow-400 pl-3">
                <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                  {comment.content}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  By {comment.author?.first_name} {comment.author?.last_name} on {formatDate(comment.created_at)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPosts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Blog Posts
        </h2>
        <Link
          to="/dashboard/posts/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>New Post</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {blogs?.map((blog) => (
                <tr key={blog.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {blog.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      blog.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {blog.category?.name || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(blog.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/blog/${blog.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-500"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/dashboard/posts/${blog.id}/edit`}
                        className="text-green-600 dark:text-green-400 hover:text-green-500"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                      <button className="text-red-600 dark:text-red-400 hover:text-red-500">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'posts':
        return renderPosts();
      case 'categories':
        return (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Categories management coming soon...</p>
          </div>
        );
      case 'comments':
        return (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Comments management coming soon...</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {user?.first_name}! Here's what's happening with your blog.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default DashboardPage;