import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface MainNavProps {
  user: {
    name: string
  }
  onSignOut?: () => void
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function MainNav({ user, onSignOut }: MainNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = () => {
    setIsOpen(false)
    onSignOut?.()
  }

  return (
    <nav className="container mx-auto flex justify-between items-center py-4">
      {/* Logo */}
      <Link to="/recipes" className="text-2xl font-bold hover:opacity-80 transition-opacity">
        Pomodoro
      </Link>

      <div className="flex items-center gap-4">

      {/* Navigation */}
      <ul className="flex items-center gap-4">
        <li>
          <Link
            to="/recipes"
            className={`text-sm font-medium transition-opacity ${
              location.pathname === '/recipes' ? 'opacity-100' : 'hover:opacity-80'
            }`}
          >
            Recipes
          </Link>
        </li>
        <li className="text-sm font-medium hover:opacity-80 transition-opacity">
          <Link to="/basket">Basket</Link>
        </li>
      </ul>

      {/* User menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors px-2 py-1.5 -mr-2"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
          <div
            className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-gray-200 shrink-0"
            aria-hidden
          >
            {getInitials(user.name)}
          </div>
        </button>

        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg py-1 z-50"
            role="menu"
          >
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              role="menuitem"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
      </div>
    </nav>
  )
}

export default MainNav
