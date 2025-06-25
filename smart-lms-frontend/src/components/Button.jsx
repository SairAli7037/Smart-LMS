function Button({ text, onClick, type = "button", className = "" }) {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`w-full py-2 rounded-md text-white ${className} bg-blue-600 hover:bg-blue-700 transition`}
      >
        {text}
      </button>
    );
  }
  
  export default Button;
  