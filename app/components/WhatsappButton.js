const WhatsAppButton = () => {
    const phoneNumber = "919319747717"; // Replace with your WhatsApp number
    const message = "Hello, I am interested in your products!";
  
    return (
        <div className="flex justify-center mt-6">
      <a
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
        target="_blank" // Opens in a new tab
        rel="noopener noreferrer" // For security
        className="inline-block px-6 py-3 bg-green-500 text-white rounded-lg text-lg font-semibold hover:bg-green-600 transition-all"
      >
        Click Here to Buy on WhatsApp
      </a>
      </div>
    );
  };
  
  export default WhatsAppButton;
  