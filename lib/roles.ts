// Role definitions and permissions
export type UserRole = 'admin' | 'staff' | 'user'

export interface RolePermissions {
  admin: {
    permissions: string[]
    pages: string[]
    features: string[]
  }
  staff: {
    permissions: string[]
    pages: string[]
    features: string[]
  }
  user: {
    permissions: string[]
    pages: string[]
    features: string[]
  }
}

export const rolePermissions: RolePermissions = {
  admin: {
    // Admin can manage account and system
    permissions: [
      'manage_accounts',
      'manage_system',
      'view_reports',
      'system_settings',
      'admin_panel',
    ],
    pages: [
      '/dashboard',
      '/admin',
      '/settings',
      '/account',
      '/profile',
      '/reports',
    ],
    features: [
      'view_dashboard',
      'manage_staff',
      'system_configuration',
      'view_all_statistics',
    ],
  },
  staff: {
    // Staff can do CRUD operations - manage library materials and borrowings
    permissions: [
      'create_materials',
      'read_materials',
      'update_materials',
      'delete_materials',
      'manage_borrowings',
      'manage_members',
      'view_dashboard',
      'view_archive',
    ],
    pages: [
      '/dashboard',
      '/books',
      '/borrowing',
      '/members',
      '/archive',
      '/iksp-cl',
      '/profile',
      '/account',
    ],
    features: [
      'create_book',
      'edit_book',
      'delete_book',
      'borrow_return',
      'member_management',
      'archive_access',
    ],
  },
  user: {
    // User can only borrow and read
    permissions: ['read_materials', 'borrow_materials'],
    pages: [
      '/dashboard',
      '/books',
      '/borrowing',
      '/archive',
      '/profile',
      '/account',
    ],
    features: [
      'browse_books',
      'borrow_book',
      'read_only',
      'view_my_borrowings',
      'view_profile',
    ],
  },
}

export function hasPermission(role: UserRole, permission: string): boolean {
  return rolePermissions[role].permissions.includes(permission)
}

export function hasAccess(role: UserRole, page: string): boolean {
  return rolePermissions[role].pages.includes(page)
}

export function hasFeature(role: UserRole, feature: string): boolean {
  return rolePermissions[role].features.includes(feature)
}

export function getUserRole(): UserRole {
  if (typeof window === 'undefined') return 'user'
  const role = localStorage.getItem('userRole') as UserRole
  return role || 'user'
}
