import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import React from 'react';
import { render } from 'src/testSupport/render';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import NavbarResponsive from 'src/components/layout/NavbarResponsive';
import { fireEvent, screen } from '@testing-library/react';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { BoclipsClientProvider } from '../common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from '../common/providers/BoclipsSecurityProvider';

describe('Desktop & Mobile - Navbar', () => {
  it('does renders the search bar by default', async () => {
    render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <NavbarResponsive />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    expect(
      await screen.findByRole('combobox', { name: /search/i }),
    ).toBeVisible();
  });
});

describe('Mobile - Navbar', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWeight', {
      writable: true,
      configurable: true,
      value: 375,
    });
  });

  it('opens menu on hamburger click', async () => {
    const client = new FakeBoclipsClient();

    client.users.insertCurrentUser(
      UserFactory.sample({
        firstName: 'Ricky',
        lastName: 'Julian',
        email: 'sunnyvale@swearnet.com',
      }),
    );

    render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={client}>
          <NavbarResponsive />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    fireEvent.click(await screen.findByTestId('side-menu'));

    expect(screen.getByText('Ricky Julian')).toBeInTheDocument();
    expect(screen.getByText('sunnyvale@swearnet.com')).toBeInTheDocument();
    expect(screen.getByText('Your orders')).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  it('closes the menu on hamburger click', async () => {
    const client = new FakeBoclipsClient();

    client.users.insertCurrentUser(
      UserFactory.sample({
        firstName: 'Ricky',
        lastName: 'Julian',
        email: 'sunnyvale@swearnet.com',
      }),
    );

    render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <BoclipsClientProvider client={client}>
          <NavbarResponsive />
        </BoclipsClientProvider>
      </BoclipsSecurityProvider>,
    );

    fireEvent.click(await screen.findByTestId('side-menu'));

    expect(screen.getByText('Ricky Julian')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('side-menu'));

    expect(screen.queryByText('Ricky Julian')).not.toBeInTheDocument();
  });
});