type TextInputProps = {
    label?: string
    placeholder?: string
    type?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  }
  
  export default function TextInput({
    label,
    placeholder,
    type = "text",
    value,
    onChange,
  }: TextInputProps) {
    return (
      <div className="field">
        {label && <label className="field-label">{label}</label>}
  
        <div className="field-wrap">
          <input
            className="field-input"
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        </div>
      </div>
    )
  }