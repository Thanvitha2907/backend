import { useState } from 'react';

function EducationTable() {
  // Example of using state to add hover effect
  const [hoveredRow, setHoveredRow] = useState(null);
  
  // Education data
  const educationData = [
    {
      degree: "Master of Science in Computer Science",
      institution: "Purdue University",
      location: "Fort Wayne, Indiana"
    },
    {
      degree: "Bachelor of Technology in Computer Science",
      institution: "Sri Venkateswara Engineering College",
      location: "India"
    }
  ];
  
  return (
    <section id="education">
      <h2>My Education</h2>
      <table>
        <thead>
          <tr>
            <th>Degree</th>
            <th>Institution</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {educationData.map((edu, index) => (
            <tr 
              key={index}
              style={{ backgroundColor: hoveredRow === index ? '#f5f5f5' : '' }}
              onMouseOver={() => setHoveredRow(index)}
              onMouseOut={() => setHoveredRow(null)}
            >
              <td>{edu.degree}</td>
              <td>{edu.institution}</td>
              <td>{edu.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default EducationTable;
