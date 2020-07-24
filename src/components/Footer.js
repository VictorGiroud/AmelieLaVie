import React from "react";
import { Link } from "gatsby";

import Newsletter from "./Newsletter";

import logo from "../img/amelielavie.png";
import facebook from "../img/social/facebook.svg";
import youtube from "../img/social/youtubeblack.svg";

const Footer = class extends React.Component {
  render() {
    return (
      <>
        <Newsletter />
        <footer className="footer has-background-black has-text-white-ter">
          <div className="content has-text-centered">
            <img src={logo} alt="Amélie la Vie" style={{ width: "14em" }} />
          </div>
          <div className="content has-text-centered has-background-black has-text-white-ter">
            <div className="container has-background-black has-text-white-ter">
              <div className="columns">
                <div className="column is-4">
                  <section className="menu">
                    <ul className="menu-list">
                      <li>
                        <Link to="/" className="navbar-item">
                          Accueil
                        </Link>
                      </li>
                      <li>
                        <Link className="navbar-item" to="/actualites">
                          Actualités
                        </Link>
                      </li>
                      <li>
                        <Link className="navbar-item" to="/association">
                          L'association
                        </Link>
                      </li>
                      <li>
                        <Link className="navbar-item" to="/habitat-partage">
                          Habitat Partagé
                        </Link>
                      </li>
                    </ul>
                  </section>
                </div>
                <div className="column is-4">
                  <section>
                    <ul className="menu-list">
                      <li>
                        <Link className="navbar-item" to="/nous-soutenir">
                          Nous soutenir
                        </Link>
                      </li>
                      <li>
                        <Link className="navbar-item" to="/contact">
                          Contact
                        </Link>
                      </li>
                      <li>
                        <Link className="navbar-item" to="/mentions-legales">
                          Mentions légales
                        </Link>
                      </li>
                      <li>
                        <a className="navbar-item" href="/admin" target="_blank" rel="noopener noreferrer">
                          Admin
                        </a>
                      </li>
                    </ul>
                  </section>
                </div>
                <div className="column is-4 social">
                  <a title="facebook" href="https://facebook.com/associationamelielavie" target="_blank" rel="noopener noreferrer">
                    <img src={facebook} alt="Facebook" style={{ width: "1em", height: "1em" }} />
                  </a>
                  <a title="youtube" href="https://www.youtube.com/channel/UCxTbiQ0ffRnZfrjdbNAf10w" target="_blank" rel="noopener noreferrer">
                    <img className="fas fa-lg" src={youtube} alt="Youtube" style={{ width: "1em", height: "1em" }} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </>
    );
  }
};

export default Footer;
