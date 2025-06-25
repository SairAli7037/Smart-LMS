function InputField({ label, type = "text", name, value, onChange, placeholder, required = false }) {
    return (
      <div className="flex flex-col space-y-1">
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
    );
  }
  
  export default InputField;
  