
import Profile from '../components/Profile';
import EducationTable from '../components/EducationTable'
import Hobbies from '../components/Hobbies';

function HomePage() {
  return (
    <div className="home-container">
      <header>
        <h1>Welcome to My Personal Story</h1>
      </header>
      <Profile />
      <EducationTable />
      <Hobbies />
    </div>
  );
}

export default HomePage;