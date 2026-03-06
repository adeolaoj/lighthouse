type ButtonProps = {
    children: React.ReactNode
    onClick?: () => void
    type?: 'button' | 'submit'
    className?: string
  }
  
  export default function Button({
    children,
    onClick,
    type = 'button',
    className = '',
  }: ButtonProps) {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`custom-btn ${className}`}
      >
        {children}
      </button>
    )
  }

  