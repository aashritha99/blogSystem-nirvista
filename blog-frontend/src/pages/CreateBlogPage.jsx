import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import RichTextEditor from '../components/common/RichTextEditor';
import ImageUpload from '../components/common/ImageUpload';
import { createBlog, updateBlog, getBlog } from '../store/slices/blogSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { fetchTags } from '../store/slices/categorySlice';

const CreateBlogPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { blog, isLoading } = useSelector((state) => state.blog);
  const { categories, tags } = useSelector((state) => state.category);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    featured_image: null,
    is_published: false
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    dispatch(fetchCategories());
    dispatch(fetchTags());
    
    if (isEditing && id) {
      dispatch(getBlog(id));
    }
  }, [dispatch, user, navigate, isEditing, id]);

  useEffect(() => {
    if (isEditing && blog && blog.id === parseInt(id)) {
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        excerpt: blog.excerpt || '',
        category: blog.category?.id || '',
        tags: blog.tags?.map(tag => tag.id) || [],
        featured_image: null,
        is_published: blog.is_published || false
      });
      setImagePreview(blog.featured_image || null);
      setSelectedTags(blog.tags?.map(tag => tag.id) || []);
    }
  }, [blog, isEditing, id]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: '' }));
    }
  };

  const handleImageSelect = (file, preview) => {
    setFormData(prev => ({ ...prev, featured_image: file }));
    setImagePreview(preview);
  };

  const handleTagToggle = (tagId) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    setSelectedTags(newSelectedTags);
    setFormData(prev => ({ ...prev, tags: newSelectedTags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('content', formData.content);
    submitData.append('excerpt', formData.excerpt);
    submitData.append('category', formData.category);
    submitData.append('is_published', formData.is_published);
    
    // Add tags
    formData.tags.forEach(tagId => {
      submitData.append('tags', tagId);
    });
    
    // Add image if selected
    if (formData.featured_image) {
      submitData.append('featured_image', formData.featured_image);
    }

    try {
      if (isEditing) {
        await dispatch(updateBlog({ id: parseInt(id), blogData: submitData })).unwrap();
        toast.success('Blog updated successfully!');
      } else {
        await dispatch(createBlog(submitData)).unwrap();
        toast.success('Blog created successfully!');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  const handleSaveDraft = async () => {
    const draftData = { ...formData, is_published: false };
    setFormData(draftData);
    handleSubmit({ preventDefault: () => {} });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Enter blog title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={handleInputChange}
                className={`input-field ${errors.excerpt ? 'border-red-500' : ''}`}
                placeholder="Brief description of your blog post"
              />
              {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`input-field ${errors.category ? 'border-red-500' : ''}`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedTags.includes(tag.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Featured Image
              </label>
              <ImageUpload
                onImageSelect={handleImageSelect}
                currentImage={imagePreview}
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Write your blog content here..."
                className={errors.content ? 'border-red-500' : ''}
              />
              {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
            </div>

            {/* Publish Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={formData.is_published}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Publish immediately
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
              >
                Cancel
              </button>
              
              <div className="flex space-x-3">
                {!formData.is_published && (
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isLoading}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Draft'}
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {isLoading 
                    ? (isEditing ? 'Updating...' : 'Creating...') 
                    : (isEditing ? 'Update Blog' : 'Create Blog')
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPage;