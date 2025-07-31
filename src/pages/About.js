import React from 'react';
import '../styles/About.css'

function About() {
  return (
    <section id="about" className="about" data-snap-target>
      <div className="container about-card">
        <h2 className="header">About Me</h2>
        <p className="description">
        I'm a creative and detail-oriented developer who finds joy and fulfillment in the complexities of code. 
        Whether I'm fine-tuning UI layouts down to the pixel, or scaffolding the framework of a website through its backend system development, I thrive on solving problems with clean, efficient code-based solutions.
        <br></br><br></br>
        Before my career in tech, I toured globally as a lead guitarist and stage manager and engineer in death metal bands. 
        It was an experience that taught me the value of teamwork, humility, and self-sufficiency. 
        Mostly, I learned the strength of adaptability, and the ways in which remaining positive (and leaning on humor) would help me navigate difficult situations.
        These are qualities I now bring to every project I'm involved in.
        <br></br><br></br>
        Today, I channel that same drive into software, blending frontend polish and backend logic into scalable tools to support a team with complicated projects and to improve program efficacy in all I do.
        </p>
      </div>
    </section>
  );
}

export default About;
