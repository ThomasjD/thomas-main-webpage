import React from "react";
//in jsx- can use {} js exp
export default () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4 text-center">
      Copyright &copy; {new Date().getFullYear()} ThomasJD
    </footer>
  );
};
