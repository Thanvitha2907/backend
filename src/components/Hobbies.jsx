function Hobbies() {
    const hobbies = ["Watching Series", "Playing Badminton", "Cooking"];
    
    return (
      <section id="hobbies">
        <h2>My Hobbies</h2>
        <ul>
          {hobbies.map((hobby, index) => (
            <li key={index}>{hobby}</li>
          ))}
        </ul>
      </section>
    );
  }
  
  export default Hobbies;