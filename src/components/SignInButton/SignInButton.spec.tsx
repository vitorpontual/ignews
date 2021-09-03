import { render } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useSession } from 'next-auth/client'
import { SignInButton } from '.'


jest.mock('next-auth/client')

describe('SignInButton Component', () => {
  it('renders correctly when user is not authenticated', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])
    const { getByText } = render(
      <SignInButton />
    )

    expect(getByText('Sign in with Github')).toBeInTheDocument()

  })
  it('renders correctly when user is authenticated', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([
      { user: { name: 'John Doe', email: 'john.doe@example.com' }, expires: 'fake-expire' },
      false
    ])
    const { getByText } = render(
      <SignInButton />
    )

    expect(getByText('John Doe')).toBeInTheDocument()

  })
})