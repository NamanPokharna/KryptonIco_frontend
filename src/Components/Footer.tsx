import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 px-8 bg-gray-800 text-white text-center ">
      <p>
        Contact:{" "}
        <a href="https://www.linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer" className="text-indigo-400">
          NamanPokharna
        </a>
      </p>
      <p>© 2024 Krypton ICO. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
