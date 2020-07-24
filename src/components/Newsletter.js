import React, { useState } from "react";
import addToMailchimp from "gatsby-plugin-mailchimp";

import emailLogo from "../img/email.svg";

const Newsletter = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log(name, email, message, isError, isLoading);
  const handleNameChange = (e) => {
    setName(e.target.value);
    console.log(name);
  };
  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);
    try {
      const response = await addToMailchimp(email, { name });
      setName("");
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
              <div className="field">
                <div className="control">
                  <input
                    placeholder="Prénom et nom"
                    className="input"
                    type={"text"}
                    name={"name"}
                    onChange={handleNameChange}
                    id={"name"}
                    value={name}
                    required={true}
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
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
                <button className={`button is-danger is-fullwidth ${isLoading ? "is-loading" : ""}`} type="submit">
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
