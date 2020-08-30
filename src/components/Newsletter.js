import React, { useState } from "react";
import addToMailchimp from "gatsby-plugin-mailchimp";

import emailLogo from "../img/email.svg";

const Newsletter = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);
    try {
      const response = await addToMailchimp(email, { firstname, lastname });
      setFirstName("");
      setLastName("");
      setEmail("");
      setIsLoading(false);
      setIsError(response.result === "error");
      if (response.msg) {
        setMessage(response.msg);
      }
    } catch (e) {
      setIsLoading(false);
      setIsError(true);
      setMessage("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <div className="newsletter">
      <div className="container">
        <div className="newsletter-columns columns">
          <div className="newsletter-column column is-3 is-hidden-mobile has-text-right">
            <img src={emailLogo} alt="Newsletter" style={{ width: "50%" }} />
          </div>
          <div className="newsletter-column column is-5">
            <h3 className="is-size-3">Newsletter</h3>
            <p>Pour être informé de nos prochaines manifestations et suivre notre actualité, nous vous encourageons à vous inscrire à notre newsletter !</p>
          </div>
          <div className="newsletter-column column is-4">
            <form onSubmit={handleSubmit}>
              <div className="columns mb-0">
                <div className="column is-6">
                  <div className="control">
                    <label htmlFor={"firstname"} className="is-sr-only">
                      Prénom
                    </label>
                    <input
                      placeholder="Prénom"
                      className="input"
                      type={"text"}
                      name={"firstname"}
                      onChange={handleFirstNameChange}
                      id={"firstname"}
                      value={firstname}
                      required={true}
                    />
                  </div>
                </div>
                <div className="column is-6">
                  <div className="control">
                    <label htmlFor={"lastname"} className="is-sr-only">
                      Nom
                    </label>
                    <input
                      placeholder="Nom"
                      className="input"
                      type={"text"}
                      name={"lastname"}
                      onChange={handleLastNameChange}
                      id={"lastname"}
                      value={lastname}
                      required={true}
                    />
                  </div>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <label htmlFor={"Adresse email"} className="is-sr-only">
                    Adresse email
                  </label>
                  <input
                    placeholder="Adresse email"
                    className="input"
                    type={"email"}
                    name={"email"}
                    onChange={handleEmailChange}
                    id={"email"}
                    value={email}
                    required={true}
                  />
                </div>
              </div>
              <div className="field">
                <button className={`button is-warning is-fullwidth ${isLoading ? "is-loading" : ""}`} type="submit">
                  S'inscrire
                </button>
              </div>
              <div className="is-size-7">
                {message && <span className={isError ? "has-text-danger" : "has-text-success"} dangerouslySetInnerHTML={{ __html: message }} />}
              </div>

              <div className="has-text-danger has-text-success is-loading"></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Newsletter;
