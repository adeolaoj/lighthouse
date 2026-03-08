import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock @convex-dev/auth/react
vi.mock('@convex-dev/auth/react', () => ({
  useAuthActions: vi.fn(),
}))

// Mock convex/react
vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
}))

// Mock generated Convex API
vi.mock('@convex/_generated/api', () => ({
  api: {
    users: {
      emailExists: 'users:emailExists',
    },
  },
}))

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

import { useAuthActions } from '@convex-dev/auth/react'
import { useQuery } from 'convex/react'
import SignupCard from '@/components/login/signupCard'

const mockSignIn = vi.fn()
const mockUseAuthActions = vi.mocked(useAuthActions)
const mockUseQuery = vi.mocked(useQuery)

async function fillSignupForm({
  firstName = 'Jane',
  lastName = 'Smith',
  email = 'jane@jhu.edu',
  password = 'Password1!',
  confirmPassword = 'Password1!',
} = {}) {
  const user = userEvent.setup()

  if (firstName) await user.type(screen.getByPlaceholderText('Jane'), firstName)
  if (lastName) await user.type(screen.getByPlaceholderText('Smith'), lastName)
  if (email) await user.type(screen.getByPlaceholderText('you@email.edu'), email)
  if (password) await user.type(screen.getByPlaceholderText('Min. 8 characters'), password)
  if (confirmPassword) await user.type(screen.getByPlaceholderText('Repeat your password'), confirmPassword)

  return user
}

describe('SignupCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuthActions.mockReturnValue({ signIn: mockSignIn } as ReturnType<typeof useAuthActions>)
    mockUseQuery.mockReturnValue(false)
  })

  it('renders all signup fields and actions', () => {
    render(<SignupCard />)

    expect(screen.getByPlaceholderText('Jane')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Smith')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@email.edu')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Min. 8 characters')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Repeat your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^sign up$/i })).toBeInTheDocument()
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument()
  })

  it('shows an error and blocks signup when passwords do not match', async () => {
    render(<SignupCard />)

    const user = await fillSignupForm({
      password: 'Password1!',
      confirmPassword: 'DifferentPassword1!',
    })

    await user.click(screen.getByRole('button', { name: /^sign up$/i }))

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })

    expect(mockSignIn).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('shows an error and blocks signup when the email already exists', async () => {
    mockUseQuery.mockReturnValue(true)

    render(<SignupCard />)

    const user = await fillSignupForm({
      email: 'existing@jhu.edu',
    })

    await user.click(screen.getByRole('button', { name: /^sign up$/i }))

    await waitFor(() => {
      expect(
        screen.getByText('An account with this email already exists. Please sign in instead.')
      ).toBeInTheDocument()
    })

    expect(mockSignIn).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('submits the correct signup payload and redirects on success', async () => {
    mockSignIn.mockResolvedValueOnce({})

    render(<SignupCard />)

    const user = await fillSignupForm()

    await user.click(screen.getByRole('button', { name: /^sign up$/i }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledTimes(1)
      expect(mockSignIn).toHaveBeenCalledWith('password', {
        email: 'jane@jhu.edu',
        password: 'Password1!',
        name: 'Jane Smith',
        flow: 'signUp',
      })
      expect(mockPush).toHaveBeenCalledWith('/results')
    })
  })

  it('shows a generic error and does not redirect when signup fails', async () => {
    mockSignIn.mockRejectedValueOnce(new Error('provider error'))

    render(<SignupCard />)

    const user = await fillSignupForm()

    await user.click(screen.getByRole('button', { name: /^sign up$/i }))

    await waitFor(() => {
      expect(screen.getByText('Sign up failed. Please try again.')).toBeInTheDocument()
    })

    expect(mockSignIn).toHaveBeenCalledTimes(1)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('clears a password mismatch error after the user fixes the input and resubmits', async () => {
    mockSignIn.mockResolvedValueOnce({})

    render(<SignupCard />)

    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('Jane'), 'Jane')
    await user.type(screen.getByPlaceholderText('Smith'), 'Smith')
    await user.type(screen.getByPlaceholderText('you@email.edu'), 'jane@jhu.edu')
    await user.type(screen.getByPlaceholderText('Min. 8 characters'), 'Password1!')
    await user.type(screen.getByPlaceholderText('Repeat your password'), 'WrongPassword1!')

    await user.click(screen.getByRole('button', { name: /^sign up$/i }))

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })

    await user.clear(screen.getByPlaceholderText('Repeat your password'))
    await user.type(screen.getByPlaceholderText('Repeat your password'), 'Password1!')
    await user.click(screen.getByRole('button', { name: /^sign up$/i }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith('/results')
    })

    expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument()
  })

  it('does not submit when first name is empty', async () => {
    render(<SignupCard />)

    const user = await fillSignupForm({
      firstName: '',
    })

    await user.click(screen.getByRole('button', { name: /^sign up$/i }))

    await waitFor(() => {
      expect(mockSignIn).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  it('does not submit when last name is empty', async () => {
    render(<SignupCard />)

    const user = await fillSignupForm({
      lastName: '',
    })

    await user.click(screen.getByRole('button', { name: /^sign up$/i }))

    await waitFor(() => {
      expect(mockSignIn).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  it('does not submit when email is empty', async () => {
    render(<SignupCard />)

    const user = await fillSignupForm({
      email: '',
    })

    await user.click(screen.getByRole('button', { name: /^sign up$/i }))

    await waitFor(() => {
      expect(mockSignIn).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  it('does not submit when password is empty', async () => {
    render(<SignupCard />)

    const user = await fillSignupForm({
      password: '',
      confirmPassword: '',
    })

    await user.click(screen.getByRole('button', { name: /^sign up$/i }))

    await waitFor(() => {
      expect(mockSignIn).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  it('does not submit when confirm password is empty', async () => {
    render(<SignupCard />)

    const user = await fillSignupForm({
      confirmPassword: '',
    })

    await user.click(screen.getByRole('button', { name: /^sign up$/i }))

    await waitFor(() => {
      expect(mockSignIn).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  it('blocks signup while duplicate-email check is still loading', async () => {
    mockUseQuery.mockReturnValue(undefined)

    render(<SignupCard />)

    const user = await fillSignupForm()

    await user.click(screen.getByRole('button', { name: /^sign up$/i }))

    await waitFor(() => {
      expect(mockSignIn).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  it('does not submit twice when the user clicks sign up rapidly', async () => {
    let resolveSignIn!: () => void

    mockSignIn.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSignIn = () => resolve({})
        })
    )

    render(<SignupCard />)

    const user = await fillSignupForm()
    const button = screen.getByRole('button', { name: /^sign up$/i })

    await user.click(button)
    await user.click(button)

    expect(mockSignIn).toHaveBeenCalledTimes(1)

    resolveSignIn()

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/results')
    })
  })

  it('trims surrounding whitespace from name and email before submitting', async () => {
    mockSignIn.mockResolvedValueOnce({})

    render(<SignupCard />)

    const user = await fillSignupForm({
      firstName: '  Jane  ',
      lastName: '  Smith  ',
      email: '  jane@jhu.edu  ',
      password: 'Password1!',
      confirmPassword: 'Password1!',
    })

    await user.click(screen.getByRole('button', { name: /^sign up$/i }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('password', {
        email: 'jane@jhu.edu',
        password: 'Password1!',
        name: 'Jane Smith',
        flow: 'signUp',
      })
    })
  })
})
