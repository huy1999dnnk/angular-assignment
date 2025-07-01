describe('DummyShop E2E Tests', () => {
  beforeEach(() => {
    // Clear local storage before each test
    cy.clearLocalStorage()
  })

  it('should display login page and login successfully', () => {
    cy.visit('/login')
    
    // Check if login form is present
    cy.get('mat-card-title').should('contain', 'DummyShop Login')
    cy.get('input[formControlName="username"]').should('be.visible')
    cy.get('input[formControlName="password"]').should('be.visible')
    
    // Check demo credentials are displayed
    cy.get('.demo-credentials').should('contain', 'emilys')
    cy.get('.demo-credentials').should('contain', 'emilyspass')
    
    // Login with demo credentials
    cy.get('input[formControlName="username"]').type('emilys')
    cy.get('input[formControlName="password"]').type('emilyspass')
    cy.get('button[type="submit"]').click()
    
    // Should redirect to products page after successful login
    cy.url().should('include', '/products')
    cy.get('mat-toolbar').should('contain', 'DummyShop')
  })

  it('should load and display products after login', () => {
    // Login manually
    cy.visit('/login')
    cy.get('input[formControlName="username"]').type('emilys')
    cy.get('input[formControlName="password"]').type('emilyspass')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/products')
    
    // Check if products page loads
    cy.get('h1').should('contain', 'Products')
    
    // Wait for products to load
    cy.get('.product-card', { timeout: 10000 }).should('have.length.greaterThan', 0)
    
    // Check product card structure
    cy.get('.product-card').first().within(() => {
      cy.get('.product-image').should('be.visible')
      cy.get('mat-card-title').should('not.be.empty')
      cy.get('mat-card-subtitle').should('contain', '$')
      cy.get('.product-description').should('not.be.empty')
      cy.get('button').contains('Add to Favorites').should('be.visible')
    })
  })

  it('should handle favorites functionality', () => {
    // Login manually
    cy.visit('/login')
    cy.get('input[formControlName="username"]').type('emilys')
    cy.get('input[formControlName="password"]').type('emilyspass')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/products')
    
    // Wait for products to load
    cy.get('.product-card', { timeout: 10000 }).should('have.length.greaterThan', 0)
    
    // Add first product to favorites
    cy.get('.product-card').first().within(() => {
      cy.get('button').contains('Add to Favorites').click()
    })
    
    // Check favorites badge updated
    cy.get('button').contains('My Favorites').should('be.visible')
    
    // Navigate to favorites page
    cy.get('button').contains('My Favorites').click()
    cy.url().should('include', '/favorites')
    
    // Check favorites page
    cy.get('h1').should('contain', 'My Favorite Products')
    cy.get('.product-card').should('have.length', 1)
    
    // Remove from favorites
    cy.get('.product-card').first().within(() => {
      cy.get('button').contains('Remove from Favorites').click()
    })
    
    // Go back to products page
    cy.get('button').contains('Back to Products').click()
    cy.url().should('include', '/products')
    
    // Product should no longer be favorite (check by trying to add it again)
    cy.get('.product-card').first().within(() => {
      cy.get('button').contains('Add to Favorites').should('be.visible')
    })
  })

  it('should handle logout functionality', () => {
    // Login manually
    cy.visit('/login')
    cy.get('input[formControlName="username"]').type('emilys')
    cy.get('input[formControlName="password"]').type('emilyspass')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/products')
    
    // Click logout button
    cy.get('button').contains('Sign Out').click()
    
    // Should redirect to login page
    cy.url().should('include', '/login')
    cy.get('mat-card-title').should('contain', 'DummyShop Login')
  })

  it('should redirect unauthorized users to login', () => {
    // Try to access products page without login
    cy.visit('/products')
    cy.url().should('include', '/login')
    
    // Try to access favorites page without login
    cy.visit('/favorites')
    cy.url().should('include', '/login')
  })

  it('should handle invalid routes', () => {
    // Login manually
    cy.visit('/login')
    cy.get('input[formControlName="username"]').type('emilys')
    cy.get('input[formControlName="password"]').type('emilyspass')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/products')
    
    // Visit invalid route
    cy.visit('/invalid-route')
    
    // Should redirect to products page
    cy.url().should('include', '/products')
    cy.get('h1').should('contain', 'Products')
  })

  it('should display error for invalid login credentials', () => {
    cy.visit('/login')
    
    // Try login with invalid credentials
    cy.get('input[formControlName="username"]').type('invalid')
    cy.get('input[formControlName="password"]').type('invalid')
    cy.get('button[type="submit"]').click()
    
    // Should show error message
    cy.get('simple-snack-bar').should('be.visible')
    
    // Should stay on login page
    cy.url().should('include', '/login')
  })
})
