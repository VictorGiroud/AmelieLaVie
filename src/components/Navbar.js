import React from "react";
import { Link } from "gatsby";
import facebook from "../img/social/bluefacebook.svg";
import colibri from "../img/colibrilogo.svg";
import logo from "../img/amelielavie.png";

const Navbar = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      navBarActiveClass: "",
    };
  }

  toggleHamburger = () => {
    // toggle the active boolean in the state
    this.setState(
      {
        active: !this.state.active,
      },
      // after state has been updated,
      () => {
        // set the class in state for the navbar accordingly
        this.state.active
          ? this.setState({
              navBarActiveClass: "is-active",
            })
          : this.setState({
              navBarActiveClass: "",
            });
      }
    );
  };

  render() {
    return (
      <nav className="navbar is-fixed-top" role="navigation" aria-label="main-navigation">
        <div className="container">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item" title="Amélie La Vie">
              <img src={logo} alt="Amélie La Vie" />
            </Link>
            {/* Hamburger menu */}
            <div className={`navbar-burger burger ${this.state.navBarActiveClass}`} data-target="navMenu" onClick={() => this.toggleHamburger()}>
              <span />
              <span />
              <span />
            </div>
          </div>
          <div id="navMenu" className={`navbar-menu ${this.state.navBarActiveClass}`}>
            <div className="navbar-start has-text-centered">
              <Link className="navbar-item" to="/about">
                L'association
              </Link>
              <Link className="navbar-item" to="/products">
                Habitat partagé
              </Link>
              <Link className="navbar-item" to="/blog">
                Nous soutenir
              </Link>
              <Link className="navbar-item" to="/contact">
                Contact
              </Link>
            </div>
            <div className="navbar-end has-text-centered">
              <a className="navbar-item" href="#" rel="noopener noreferrer">
                <span className="icon">
                  <img src={colibri} alt="Les Colibris" title="Les Colibris" />
                </span>
              </a>
              <a className="navbar-item" href="https://facebook.com/associationamelielavie" target="_blank" rel="noopener noreferrer">
                <span className="icon facebook">
                  <img src={facebook} alt="Facebook" title="Facebook" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    );
  }
};

export default Navbar;
