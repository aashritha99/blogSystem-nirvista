import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogById } from '../store/slices/blogSlice';
import { fetchCommentsByBlog, createComment } from '../store/slices/commentSlice';
import { CalendarIcon, UserIcon, TagIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const BlogDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBlog, isLoading } = useSelector((state) => state.blog);
  const { comments, isLoading: commentsLoading } = useSelector((state) => state.comment);
  const { user } = useSelector((state) => state.auth);
  
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
      dispatch(fetchCommentsByBlog(id));
    }
  }, [dispatch, id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    
    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setIsSubmittingComment(true);
    try {
      await dispatch(createComment({
        blog: id,
        content: commentText.trim()
      })).unwrap();
      
      setCommentText('');
      toast.success('Comment added successfully!');
      // Refresh comments
      dispatch(fetchCommentsByBlog(id));
    } catch (error) {
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Blog post not found
        </h1>
        <Link
          to="/"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-500"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Blog Header */}
      <article className="mb-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {currentBlog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center space-x-2">
              <UserIcon className="w-4 h-4" />
              <span>By {currentBlog.author?.first_name} {currentBlog.author?.last_name}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(currentBlog.created_at)}</span>
            </div>
            
            {currentBlog.category && (
              <Link
                to={`/category/${currentBlog.category.slug}`}
                className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-500"
              >
                <TagIcon className="w-4 h-4" />
                <span>{currentBlog.category.name}</span>
              </Link>
            )}
          </div>
          
          {currentBlog.excerpt && (
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {currentBlog.excerpt}
            </p>
          )}
        </header>
        
        {/* Featured Image */}
        {currentBlog.featured_image && (
          <div className="mb-8">
            <img
              src={currentBlog.featured_image}
              alt={currentBlog.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        )}
        
        {/* Blog Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: currentBlog.content }}
        />
        
        {/* Tags */}
        {currentBlog.tags && currentBlog.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Tags:
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentBlog.tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/tag/${tag.slug}`}
                  className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
      
      {/* Comments Section */}
      <section className="border-t border-gray-200 dark:border-gray-700 pt-12">
        <div className="flex items-center space-x-2 mb-8">
          <ChatBubbleLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Comments ({comments?.length || 0})
          </h2>
        </div>
        
        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add a comment
              </label>
              <textarea
                id="comment"
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Share your thoughts..."
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingComment || !commentText.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmittingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              Please{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 font-medium">
                login
              </Link>
              {' '}to leave a comment.
            </p>
          </div>
        )}
        
        {/* Comments List */}
        {commentsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.author?.first_name} {comment.author?.last_name}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </section>
    </div>
  );
};

export default BlogDetailsPage;