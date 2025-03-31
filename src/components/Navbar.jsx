import {Link} from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/contact">Contact Me</Link>
      <a href="https://www.pfw.edu/" target="_blank" rel="noopener noreferrer">My University</a>
    </nav>
  );
}

export default Navbar;