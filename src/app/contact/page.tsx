import ContactForm from './_components/ContactForm';

const ContactPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* Dummy Map Section */}
      <div className="w-1/2 bg-gray-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-green-200 opacity-50"></div>
        <div className="relative z-10 text-center">
          <div className="w-64 h-64 bg-white rounded-lg shadow-lg flex items-center justify-center border-2 border-gray-300">
            <div className="text-gray-500 text-lg font-semibold">
              🗺️ Interactive Map
              <br />
              <span className="text-sm">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="w-1/2 bg-white flex items-center justify-center p-8">
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactPage;
