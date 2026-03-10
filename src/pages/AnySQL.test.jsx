import { render, screen } from '@testing-library/react'
import AnySQL from './AnySQL'

describe('AnySQL page', () => {
  it('renders the product name', () => {
    render(<AnySQL />)
    expect(screen.getByRole('heading', { name: /anysql/i })).toBeInTheDocument()
  })

  it('renders the how it works section', () => {
    render(<AnySQL />)
    expect(screen.getByText(/how it works/i)).toBeInTheDocument()
  })

  it('renders the install snippet', () => {
    render(<AnySQL />)
    expect(screen.getByText(/pip install anysql-sdk/i)).toBeInTheDocument()
  })

  it('renders GitHub CTA link', () => {
    render(<AnySQL />)
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/anySQL')
  })

  it('renders Website CTA link', () => {
    render(<AnySQL />)
    const link = screen.getByRole('link', { name: /website/i })
    expect(link).toHaveAttribute('href', 'https://anysql.org')
  })
})
