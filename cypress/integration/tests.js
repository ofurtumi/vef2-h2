const name = 'admin';
const pass = 1234567890;

describe('Changing sites', function(){
    it('Goes from home to menu',function(){
        cy.visit('http://localhost:3000/')
        cy.contains('a').click()
        cy.url()
            .should('include', '/menu')
    })
})
describe('Button test', function(){
    it('Tests all the buttons on menu page', function(){
        cy.get('button').click({multiple:true})
    })
})
describe('Adding to cart', function(){
    it('Adds few items to cart', function(){
        cy.get(':nth-child(4) > .main_cellButtons__xAoeo > :nth-child(3)').click()
        cy.get(':nth-child(7) > .main_cellButtons__xAoeo > :nth-child(3)').click()
        cy.get(':nth-child(20) > .main_cellButtons__xAoeo > :nth-child(3)').click()
    })
})
describe('Paying for cart', function(){
    it('Finishes the order',function(){
        cy.visit('http://localhost:3000/cart')
        cy.get('input').type('Þröstur')
        cy.get('button').click()
        
    })
})
describe('Logging in', function(){
    it('Logging in as admin',function(){
        
        cy.visit('http://localhost:3000/admin/login')
        cy.get('[type="text"]').type(name)
        cy.get('[type="password"]').type(pass)
        cy.get('button').click()
    })
})

