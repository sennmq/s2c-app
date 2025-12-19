import React from 'react'
import { render, screen, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { useQuery } from 'convex/react'
import { usePathname, useSearchParams } from 'next/navigation'
import Navbar from '../index'
import profile from '@/redux/slice/profile'
import { Profile } from '@/types/user'

// Mock modules
jest.mock('convex/react')
jest.mock('next/navigation')
jest.mock('../../buttons/project', () => {
  return function MockCreateProject() {
    return <div data-testid="create-project-button">Create Project</div>
  }
})

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>

// Helper function to create a mock store with preloaded state
const createMockStore = (preloadedState?: { profile: { user: Profile | null } }) => {
  return configureStore({
    reducer: {
      profile,
    },
    preloadedState,
  })
}

// Helper function to create mock profile
const createMockProfile = (overrides?: Partial<Profile>): Profile => ({
  id: 'user-123',
  createdAtMs: 1640000000000,
  email: 'test@example.com',
  name: 'testuser',
  image: 'https://example.com/avatar.jpg',
  ...overrides,
})

// Helper function to create mock URLSearchParams
const createMockSearchParams = (params: Record<string, string>) => {
  const searchParams = new URLSearchParams(params)
  return searchParams
}

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering and Layout', () => {
    it('should render the navbar with all main sections', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-123' }))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      // Check for main container with proper classes
      const navbar = screen.getByRole('generic')
      expect(navbar).toHaveClass('grid', 'grid-cols-2', 'lg:grid-cols-3', 'p-6')
    })

    it('should render the home link with correct href', () => {
      const mockProfile = createMockProfile({ name: 'johndoe' })
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/johndoe/canvas')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-123' }))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      const homeLink = screen.getByRole('link', { name: /^$/ })
      expect(homeLink).toHaveAttribute('href', '/dashboard/johndoe')
    })

    it('should render avatar with user image', () => {
      const mockProfile = createMockProfile({
        image: 'https://example.com/user-avatar.png',
      })
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({}))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      const avatarImage = screen.getByRole('img')
      expect(avatarImage).toHaveAttribute('src', 'https://example.com/user-avatar.png')
    })

    it('should render avatar fallback when no image provided', () => {
      const mockProfile = createMockProfile({ image: undefined })
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({}))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      const userIcon = screen.getByTestId('user-icon')
      expect(userIcon).toBeInTheDocument()
    })

    it('should display credits information', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({}))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      expect(screen.getByText('12 credits')).toBeInTheDocument()
    })

    it('should render help button with question mark icon', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({}))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      const helpButton = screen.getByRole('button')
      const icon = within(helpButton).getByTestId('circle-question-mark-icon')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Tab Navigation', () => {
    it('should render Canvas and Style Guide tabs with correct hrefs', () => {
      const mockProfile = createMockProfile({ name: 'testuser' })
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser/canvas')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-456' }))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      const canvasLink = screen.getByRole('link', { name: /Canvas/i })
      const styleGuideLink = screen.getByRole('link', { name: /Style Guide/i })

      expect(canvasLink).toHaveAttribute('href', '/dashboard/testuser/canvas?project=proj-456')
      expect(styleGuideLink).toHaveAttribute('href', '/dashboard/testuser/style-guide?project=proj-456')
    })

    it('should highlight active Canvas tab', () => {
      const mockProfile = createMockProfile({ name: 'testuser' })
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser/canvas')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-789' }))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      const canvasLink = screen.getByRole('link', { name: /Canvas/i })
      expect(canvasLink).toHaveClass('bg-white/[0.12]', 'text-white')
    })

    it('should highlight active Style Guide tab', () => {
      const mockProfile = createMockProfile({ name: 'testuser' })
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser/style-guide')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-789' }))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      const styleGuideLink = screen.getByRole('link', { name: /Style Guide/i })
      expect(styleGuideLink).toHaveClass('bg-white/[0.12]', 'text-white')
    })

    it('should render tab icons correctly', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-123' }))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      expect(screen.getByTestId('hash-icon')).toBeInTheDocument()
      expect(screen.getByTestId('layout-template-icon')).toBeInTheDocument()
    })

    it('should apply inactive styles to non-active tabs', () => {
      const mockProfile = createMockProfile({ name: 'testuser' })
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser/canvas')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-789' }))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      const styleGuideLink = screen.getByRole('link', { name: /Style Guide/i })
      expect(styleGuideLink).toHaveClass('text-zinc-400')
    })
  })

  describe('Project Display', () => {
    it('should display project name when project data is loaded and not on canvas/style-guide', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-123' }))
      mockUseQuery.mockReturnValue({ name: 'My Awesome Project', _id: 'proj-123' })

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      expect(screen.getByText(/Project \/ My Awesome Project/i)).toBeInTheDocument()
    })

    it('should not display project name when on canvas page', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser/canvas')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-123' }))
      mockUseQuery.mockReturnValue({ name: 'My Awesome Project', _id: 'proj-123' })

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      expect(screen.queryByText(/Project \/ My Awesome Project/i)).not.toBeInTheDocument()
    })

    it('should not display project name when on style-guide page', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser/style-guide')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-123' }))
      mockUseQuery.mockReturnValue({ name: 'Design System', _id: 'proj-123' })

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      expect(screen.queryByText(/Project \/ Design System/i)).not.toBeInTheDocument()
    })

    it('should handle null project data gracefully', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-123' }))
      mockUseQuery.mockReturnValue(null)

      const { container } = render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      // Should render without crashing
      expect(container).toBeInTheDocument()
    })

    it('should handle undefined project data gracefully', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-123' }))
      mockUseQuery.mockReturnValue(undefined)

      const { container } = render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      expect(container).toBeInTheDocument()
    })
  })

  describe('CreateProject Button Visibility', () => {
    it('should show CreateProject button when not on canvas or style-guide', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({}))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      expect(screen.getByTestId('create-project-button')).toBeInTheDocument()
    })

    it('should not show CreateProject button on canvas page', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser/canvas')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-123' }))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      expect(screen.queryByTestId('create-project-button')).not.toBeInTheDocument()
    })

    it('should not show CreateProject button on style-guide page', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser/style-guide')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-123' }))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      expect(screen.queryByTestId('create-project-button')).not.toBeInTheDocument()
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing projectId in search params', () => {
      const mockProfile = createMockProfile({ name: 'testuser' })
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({}))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      const canvasLink = screen.getByRole('link', { name: /Canvas/i })
      expect(canvasLink).toHaveAttribute('href', '/dashboard/testuser/canvas?project=null')
    })

    it('should handle null profile name', () => {
      const mockProfile = createMockProfile({ name: undefined })
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/undefined')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({}))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      const homeLink = screen.getByRole('link', { name: /^$/ })
      expect(homeLink).toHaveAttribute('href', '/dashboard/undefined')
    })

    it('should handle empty profile image', () => {
      const mockProfile = createMockProfile({ image: '' })
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({}))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      // Should render fallback icon
      expect(screen.getByTestId('user-icon')).toBeInTheDocument()
    })

    it('should handle special characters in project ID', () => {
      const mockProfile = createMockProfile({ name: 'testuser' })
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-123!@#$%' }))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      const canvasLink = screen.getByRole('link', { name: /Canvas/i })
      expect(canvasLink).toHaveAttribute('href', '/dashboard/testuser/canvas?project=proj-123!@#$%')
    })

    it('should handle very long project names', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      const longProjectName = 'A'.repeat(200)
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-123' }))
      mockUseQuery.mockReturnValue({ name: longProjectName, _id: 'proj-123' })

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      expect(screen.getByText(new RegExp(`Project / ${longProjectName}`))).toBeInTheDocument()
    })

    it('should handle null user profile', () => {
      const store = createMockStore({ profile: { user: null } })
      
      mockUsePathname.mockReturnValue('/dashboard')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({}))
      mockUseQuery.mockReturnValue(null)

      const { container } = render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      // Should render without crashing even with null profile
      expect(container).toBeInTheDocument()
    })
  })

  describe('Pathname Detection Logic', () => {
    it('should correctly detect canvas in pathname', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser/canvas/edit')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-123' }))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      expect(screen.queryByTestId('create-project-button')).not.toBeInTheDocument()
    })

    it('should correctly detect style-guide in pathname', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser/style-guide/colors')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-123' }))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      expect(screen.queryByTestId('create-project-button')).not.toBeInTheDocument()
    })

    it('should not match partial canvas string in pathname', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      
      // "canvass" with double 's' should not match "canvas"
      mockUsePathname.mockReturnValue('/dashboard/testuser/canvass')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({}))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      // CreateProject should be visible since it's not actually canvas
      expect(screen.getByTestId('create-project-button')).toBeInTheDocument()
    })
  })

  describe('Multiple Projects', () => {
    it('should handle switching between different project IDs', () => {
      const mockProfile = createMockProfile({ name: 'testuser' })
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-first' }))
      mockUseQuery.mockReturnValue({ name: 'First Project', _id: 'proj-first' })

      const { rerender } = render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      expect(screen.getByText(/Project \/ First Project/i)).toBeInTheDocument()

      // Simulate navigation to different project
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-second' }))
      mockUseQuery.mockReturnValue({ name: 'Second Project', _id: 'proj-second' })

      rerender(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      expect(screen.getByText(/Project \/ Second Project/i)).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior Classes', () => {
    it('should have responsive grid classes', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({}))
      mockUseQuery.mockReturnValue(null)

      const { container } = render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      const navbar = container.firstChild as HTMLElement
      expect(navbar).toHaveClass('grid-cols-2', 'lg:grid-cols-3')
    })

    it('should have hidden class on project display for mobile', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-123' }))
      mockUseQuery.mockReturnValue({ name: 'Test Project', _id: 'proj-123' })

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      const projectDisplay = screen.getByText(/Project \/ Test Project/i)
      expect(projectDisplay).toHaveClass('lg:inline-block', 'hidden')
    })

    it('should have hidden class on tabs container for mobile', () => {
      const mockProfile = createMockProfile()
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-123' }))
      mockUseQuery.mockReturnValue(null)

      const { container } = render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      // Find the tabs container (middle section)
      const tabsContainer = container.querySelector('.lg\\:flex.hidden')
      expect(tabsContainer).toBeInTheDocument()
    })
  })

  describe('Tab URL Construction', () => {
    it('should construct correct URLs with username and project ID', () => {
      const mockProfile = createMockProfile({ name: 'alice' })
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/alice')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: 'proj-xyz' }))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      const canvasLink = screen.getByRole('link', { name: /Canvas/i })
      const styleGuideLink = screen.getByRole('link', { name: /Style Guide/i })

      expect(canvasLink).toHaveAttribute('href', '/dashboard/alice/canvas?project=proj-xyz')
      expect(styleGuideLink).toHaveAttribute('href', '/dashboard/alice/style-guide?project=proj-xyz')
    })

    it('should handle empty string project ID', () => {
      const mockProfile = createMockProfile({ name: 'testuser' })
      const store = createMockStore({ profile: { user: mockProfile } })
      
      mockUsePathname.mockReturnValue('/dashboard/testuser')
      mockUseSearchParams.mockReturnValue(createMockSearchParams({ project: '' }))
      mockUseQuery.mockReturnValue(null)

      render(
        <Provider store={store}>
          <Navbar />
        </Provider>
      )

      const canvasLink = screen.getByRole('link', { name: /Canvas/i })
      expect(canvasLink).toHaveAttribute('href', '/dashboard/testuser/canvas?project=')
    })
  })
})