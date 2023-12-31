context('Sparks', () => {
  it('Sparks user journey', () => {
    cy.visit('/');
    cy.bo((bo) => bo.create.fixtureSet.themes());

    cy.findByRole('button', { name: 'Sparks' }).should('be.visible');
    cy.findByRole('button', { name: 'Sparks' }).click();

    cy.findByRole('button', { name: 'Provider OpenStax' }).should('be.visible');
    cy.findByRole('button', { name: 'Provider NGSS' }).should('be.visible');
    cy.findByRole('button', { name: 'Provider Common Core Math' }).should(
      'be.visible',
    );

    cy.findByRole('button', { name: 'Provider OpenStax' }).click();
    cy.findByRole('button', { name: 'theme Maths book' }).should('be.visible');
    cy.findByRole('button', { name: 'type Physics' }).click();
    cy.findByRole('button', { name: 'theme Physics book' }).should(
      'be.visible',
    );
    cy.findByRole('button', { name: 'type Maths' }).click();

    cy.percySnapshot('OpenStax explore page');

    cy.findByRole('button', { name: 'theme Maths book' }).click();

    cy.findAllByRole('heading', { name: 'Chapter 1: chapter-one' }).should(
      'have.length',
      2,
    );

    cy.findByRole('heading', { name: '1.2 section we want to view' }).click();

    cy.findByRole('link', { name: 'our target video grid card' }).should(
      'be.visible',
    );

    cy.percySnapshot('OpenStax theme page');
  });
});
