import { useState, useEffect } from 'react';

function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
  
  // This is just to demonstrate useEffect, though in this case it's not strictly necessary
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  
  return (
    <footer>
      <p>&copy; {year} My Personal Story. All rights reserved.</p>
    </footer>
  );
}

export default Footer;