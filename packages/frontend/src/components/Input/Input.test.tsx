import React from 'react';
import { render, fireEvent } from '../../utils/tests';
import { Input } from './Input';

describe('Input', () => {
  it('does render', () => {
    render(<Input label="description" />);
  });

  it('Label and input are connected', async () => {
    const { findByLabelText } = render(<Input label="description" />);

    const input = (await findByLabelText('description')) as HTMLInputElement;
    expect(input.type).toBe('text');
    expect(input.tagName).toBe('INPUT');
  });

  it('can type into input', async () => {
    const { getByLabelText } = render(<Input label="description" />);

    const input = getByLabelText(/description/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'This is a test description' } });
    expect(input.value).toBe('This is a test description');
  });
});
