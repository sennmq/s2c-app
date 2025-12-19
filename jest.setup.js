import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock convex/react
jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useConvex: jest.fn(),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  CircleQuestionMark: () => <div data-testid="circle-question-mark-icon">?</div>,
  Hash: () => <div data-testid="hash-icon">#</div>,
  LayoutTemplate: () => <div data-testid="layout-template-icon">L</div>,
  User: () => <div data-testid="user-icon">U</div>,
  PlusIcon: () => <div data-testid="plus-icon">+</div>,
  Loader2: () => <div data-testid="loader-icon">...</div>,
}))

// Suppress console errors during tests (optional, remove if you want to see them)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}