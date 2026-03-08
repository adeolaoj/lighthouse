import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@convex-dev/auth/react', () => ({
  useAuthActions: vi.fn(),
}))

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

import { useAuthActions } from '@convex-dev/auth/react'
import LoginCard from '@/components/signup/loginCard'

const mockSignIn = vi.fn()
const mockUseAuthActions = vi.mocked(useAuthActions)

async function fillLoginForm({
  email = 'jane@jhu.edu',
  password = 'Password1!',
} = {}) {
  const user = userEvent.setup()
  if (email) await user.type(screen.getByPlaceholderText('you@email.edu'), email)
  if (password) await user.type(screen.getByPlaceholderText('Enter password'), password)
  return user
}

describe('LoginCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuthActions.mockReturnValue({ signIn: mockSignIn } as ReturnType<typeof useAuthActions>)
  })

  it('renders all sign in fields and actions', () => {
    render(<LoginCard />)

    expect(screen.getByPlaceholderText('you@email.edu')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument()
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()
  })

  it('submits the correct payload and redirects on success', async () => {
    mockSignIn.mockResolvedValueOnce({})

    render(<LoginCard />)

    const user = await fillLoginForm()
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledTimes(1)
      expect(mockSignIn).toHaveBeenCalledWith('password', {
        email: 'jane@jhu.edu',
        password: 'Password1!',
        flow: 'signIn',
      })
      expect(mockPush).toHaveBeenCalledWith('/results')
    })
  })

  it('shows an error and does not redirect when sign in fails', async () => {
    mockSignIn.mockRejectedValueOnce(new Error('invalid credentials'))

    render(<LoginCard />)

    const user = await fillLoginForm()
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(
        screen.getByText('Sign in failed. Please check your email and password.')
      ).toBeInTheDocument()
    })

    expect(mockSignIn).toHaveBeenCalledTimes(1)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('does not submit when email is empty', async () => {
    render(<LoginCard />)

    const user = await fillLoginForm({ email: '' })
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(mockSignIn).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  it('does not submit when password is empty', async () => {
    render(<LoginCard />)

    const user = await fillLoginForm({ password: '' })
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(mockSignIn).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  it('does not submit twice when the user clicks sign in rapidly', async () => {
    let resolveSignIn!: () => void

    mockSignIn.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSignIn = () => resolve({})
        })
    )

    render(<LoginCard />)

    const user = await fillLoginForm()
    const button = screen.getByRole('button', { name: 'Sign in' })

    await user.click(button)
    await user.click(button)

    expect(mockSignIn).toHaveBeenCalledTimes(1)

    resolveSignIn()

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/results')
    })
  })

  it('clears the error after the user retries successfully', async () => {
    mockSignIn
      .mockRejectedValueOnce(new Error('invalid credentials'))
      .mockResolvedValueOnce({})

    render(<LoginCard />)

    const user = await fillLoginForm()

    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(
        screen.getByText('Sign in failed. Please check your email and password.')
      ).toBeInTheDocument()
    })

    await user.clear(screen.getByPlaceholderText('Enter password'))
    await user.type(screen.getByPlaceholderText('Enter password'), 'Password1!')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/results')
    })

    expect(
      screen.queryByText('Sign in failed. Please check your email and password.')
    ).not.toBeInTheDocument()
  })

  it('trims surrounding whitespace from email before submitting', async () => {
    mockSignIn.mockResolvedValueOnce({})

    render(<LoginCard />)

    const user = await fillLoginForm({
      email: '  jane@jhu.edu  ',
      password: 'Password1!',
    })

    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('password', {
        email: 'jane@jhu.edu',
        password: 'Password1!',
        flow: 'signIn',
      })
    })
  })
})
