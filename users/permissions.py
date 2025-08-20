from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """Permission class for Admin users - full access to all CRUD operations."""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.is_admin
        )


class IsEditorUser(permissions.BasePermission):
    """Permission class for Editor users - create/edit/delete blogs but not users/comments."""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_admin or request.user.is_editor)
        )


class IsViewerUser(permissions.BasePermission):
    """Permission class for Viewer users - read-only on published blogs."""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_admin or request.user.is_editor or request.user.is_viewer)
        )


class BlogPermission(permissions.BasePermission):
    """Custom permission for blog operations based on user roles."""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            # Allow read access to published blogs for unauthenticated users
            return request.method in permissions.SAFE_METHODS
        
        # Admin has full access
        if request.user.is_admin:
            return True
        
        # Editor can create, read, update, delete blogs
        if request.user.is_editor:
            return True
        
        # Viewer can only read published blogs
        if request.user.is_viewer:
            return request.method in permissions.SAFE_METHODS
        
        return False
    
    def has_object_permission(self, request, view, obj):
        # Admin has full access
        if request.user.is_admin:
            return True
        
        # Editor can edit their own blogs or any blog
        if request.user.is_editor:
            return True
        
        # Viewer can only read published blogs
        if request.user.is_viewer:
            return request.method in permissions.SAFE_METHODS and obj.status == 'published'
        
        return False


class CommentPermission(permissions.BasePermission):
    """Custom permission for comment operations based on user roles."""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return request.method in permissions.SAFE_METHODS
        
        # Admin has full access
        if request.user.is_admin:
            return True
        
        # Editor can read comments but not manage them
        if request.user.is_editor:
            return request.method in permissions.SAFE_METHODS
        
        # Viewer can create and read comments
        if request.user.is_viewer:
            return request.method in permissions.SAFE_METHODS or request.method == 'POST'
        
        return False
    
    def has_object_permission(self, request, view, obj):
        # Admin can approve/reject/delete comments
        if request.user.is_admin:
            return True
        
        # Editor can only read comments
        if request.user.is_editor:
            return request.method in permissions.SAFE_METHODS
        
        # Viewer can read comments and edit their own
        if request.user.is_viewer:
            if request.method in permissions.SAFE_METHODS:
                return True
            return obj.user == request.user
        
        return False


class CategoryTagPermission(permissions.BasePermission):
    """Permission for Categories and Tags - Admin only for CRUD."""
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.is_admin
        )