import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { BoInputText } from 'src/components/common/input/BoInputText';
import SearchIcon from 'resources/icons/search-icon.svg';

describe('boInput', () => {
  it('does not show error message when error is false', () => {
    const wrapper = render(
      <BoInputText
        id="Input"
        error={false}
        errorMessage={"Shouldn't see me"}
        inputType="text"
        onChange={jest.fn()}
      />,
    );

    expect(wrapper.queryByText("Shouldn't see me")).toBeNull();
  });

  it('does shows error message when error is true', () => {
    const wrapper = render(
      <BoInputText
        id="Input"
        error
        errorMessage="Should see me"
        inputType="text"
        onChange={jest.fn()}
      />,
    );

    expect(wrapper.queryByText('Should see me')).toBeVisible();
  });

  it('search icon is displayed on text input if specified', () => {
    const wrapper = render(
      <BoInputText
        icon={<SearchIcon />}
        inputType="text"
        placeholder="Search..."
        id="Input"
        onChange={jest.fn()}
      />,
    );

    expect(wrapper.getByTestId('search-icon')).toBeVisible();
  });

  it('Hides label text if specified', () => {
    const wrapper = render(
      <BoInputText
        icon={<SearchIcon />}
        inputType="text"
        placeholder="Search..."
        id="Input"
        labelText="search"
        showLabelText={false}
        onChange={jest.fn()}
      />,
    );

    expect(
      wrapper.queryByLabelText('search (Optional)'),
    ).not.toBeInTheDocument();
  });

  it('Calls onChange event when input value is changed', () => {
    const onChange = jest.fn();

    const wrapper = render(
      <BoInputText
        icon={<SearchIcon />}
        inputType="text"
        placeholder="Search..."
        id="Input"
        labelText="search"
        showLabelText={false}
        onChange={onChange}
      />,
    );

    fireEvent.change(wrapper.getByPlaceholderText('Search...'), {
      target: { value: 'new search' },
    });

    expect(onChange).toBeCalled();
    expect(onChange).toBeCalledWith('new search');
  });

  it('Clears input when clear button is clicked', async () => {
    const wrapper = render(
      <BoInputText
        icon={<SearchIcon />}
        inputType="text"
        placeholder="Search..."
        id="Input"
        labelText="search"
        showLabelText={false}
        defaultValue="text"
        allowClear
        onChange={jest.fn()}
      />,
    );

    fireEvent.click(await wrapper.findByTestId('clear-icon'));

    const input = await wrapper.findByPlaceholderText('Search...');
    expect(input.getAttribute('value')).toBe('');
  });
});
