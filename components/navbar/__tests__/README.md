# Navbar Component Tests

This directory contains comprehensive unit and integration tests for the Navbar component.

## Test Files

### `index.test.tsx`
Main unit test file covering:
- Component rendering and layout
- Tab navigation and highlighting
- Project display logic
- CreateProject button visibility
- Edge cases and error handling
- Pathname detection logic
- URL construction
- Responsive behavior
- Avatar display with image/fallback

### `index.integration.test.tsx`
Integration tests covering:
- Complete user journey scenarios
- Navigation flow between pages
- Profile state changes
- Convex query integration
- Complex UI state combinations

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only Navbar tests
npm test -- navbar

# Run specific test file
npm test -- index.test.tsx
```

## Test Coverage

The tests cover:
- ✅ Happy path scenarios
- ✅ Edge cases (null values, empty strings, special characters)
- ✅ Error conditions
- ✅ State management integration (Redux)
- ✅ External dependencies (Convex queries, Next.js navigation)
- ✅ Conditional rendering logic
- ✅ Responsive design classes
- ✅ User interactions and navigation flows

## Mocking Strategy

The tests mock:
- `next/navigation` - usePathname, useSearchParams, useRouter
- `convex/react` - useQuery for project data
- `lucide-react` - Icon components
- `components/buttons/project` - CreateProject component

## Key Test Scenarios

1. **Rendering Tests**: Verify all UI elements render correctly
2. **Navigation Tests**: Ensure tabs highlight correctly and links are generated properly
3. **Project Display Tests**: Validate project name shows/hides based on current page
4. **Button Visibility Tests**: Check CreateProject button appears on appropriate pages
5. **Edge Case Tests**: Handle null/undefined values gracefully
6. **Integration Tests**: Test complete user workflows
7. **State Change Tests**: Verify component updates when Redux state changes
8. **Query Integration Tests**: Test Convex query integration

## Adding New Tests

When adding new tests:
1. Follow existing naming conventions
2. Use descriptive test names that explain the scenario
3. Group related tests in describe blocks
4. Mock external dependencies appropriately
5. Test both success and failure cases
6. Include edge cases