import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../../store/slices/authSlice';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import NewsletterModal from '../common/NewsletterModal';
import SearchModal from '../common/SearchModal';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const { isSidebarOpen, isNewsletterModalOpen, isSearchModalOpen } = useSelector(
    (state) => state.ui
  );

  useEffect(() => {
    // Load user from localStorage on app start
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      dispatch(loadUser({ token, user: JSON.parse(user) }));
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'lg:mr-80' : ''
        }`}>
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
        
        {/* Sidebar */}
        <Sidebar />
      </div>
      
      <Footer />
      
      {/* Modals */}
      {isNewsletterModalOpen && <NewsletterModal />}
      {isSearchModalOpen && <SearchModal />}
    </div>
  );
};

export default Layout;