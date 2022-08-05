import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>Project Made By Shaswata Raha</h4>
        <a
          href="https://drive.google.com/file/d/1AeyGk3nJuMCB5q2ZAKiEaMi2_1CNFPgx/view?usp=sharing"
          rel="noreferrer"
          target="_blank"
        >
          My Resume
        </a>
      </div>

      <div className="midFooter">
        <h1>Shopify</h1>
        <p>High Quality And Speedy Delivery are our first priorities</p>

        <p>Copyrights 2021 &copy; Shaswata Raha</p>
      </div>

      <div className="rightFooter">
        <h4>Connect With Me</h4>
        <a
          href="https://github.com/shaswata1029"
          rel="noreferrer"
          target="_blank"
        >
          Github
        </a>
        <a
          href="https://www.linkedin.com/in/shaswata-raha-b65882191/"
          rel="noreferrer"
          target="_blank"
        >
          LinkedIn
        </a>
        <a
          href="mailto:shaswata1029@gmail.com 	"
          rel="noreferrer"
          target="_blank"
        >
          Mail
        </a>
      </div>
    </footer>
  );
};

export default Footer;
