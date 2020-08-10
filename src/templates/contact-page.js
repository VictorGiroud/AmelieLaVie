import React, { useState, createRef } from "react";
import { navigate } from "gatsby-link";
import Recaptcha from "react-google-recaptcha";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import FullWidthImage from "../components/FullWidthImage";

const RECAPTCHA_KEY = process.env.SITE_RECAPTCHA_KEY;

function encode(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

export const ContactPageTemplate = ({ image, content, contentComponent, title, subtitle, description, helmet }) => {
  const [formData, setFormData] = useState({ isValidated: false });
  const recaptchaRef = createRef();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const recaptchaValue = recaptchaRef.current.getValue();

    fetch("/?no-cache=1", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": form.getAttribute("name"),
        "g-recaptcha-response": recaptchaValue,
        ...formData,
      }),
    })
      .then((response) => {
        if (response.status === 200 && !response.redirected) {
          //netlify doesnt give an error on recaptcha fail (only 303 redirect...)
          console.log(response);
          console.log(JSON.stringify(response));
          navigate(form.getAttribute("action"));
        }
      })

      .catch((error) => alert(error));
  };

  const HtmlContent = contentComponent || Content;

  return (
    <div className="content">
      {helmet || ""}
      {image && <FullWidthImage image={image} title={title} subtitle={subtitle} />}
      <section className="section section--gradient">
        <div className="container">
          <div className="section">
            <div className="columns">
              <div className="column 10 is-offset-1">
                {!image && <h1>{title}</h1>}
                <HtmlContent content={content} />
              </div>
            </div>
            <div className="columns">
              <div className="column is-10 is-offset-1">
                <form name="contact" method="post" action="/contact/merci" data-netlify="true" data-netlify-recaptcha="true" onSubmit={handleSubmit}>
                  {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
                  <h2>Formulaire de contact</h2>
                  <input type="hidden" name="form-name" value="contact" />
                  <div hidden>
                    <label>
                      Ne pas remplir : <input name="bot-field" onChange={handleChange} />
                    </label>
                  </div>
                  <div className="field">
                    <label className="label" htmlFor={"name"}>
                      Nom
                    </label>
                    <div className="control">
                      <input className="input" type={"text"} name={"name"} onChange={handleChange} id={"name"} required={true} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label" htmlFor={"email"}>
                      Email
                    </label>
                    <div className="control">
                      <input className="input" type={"email"} name={"email"} onChange={handleChange} id={"email"} required={true} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label" htmlFor={"message"}>
                      Message
                    </label>
                    <div className="control">
                      <textarea className="textarea" name={"message"} onChange={handleChange} id={"message"} required={true} />
                    </div>
                  </div>
                  <div className="field">
                    <Recaptcha ref={recaptchaRef} sitekey={RECAPTCHA_KEY} />
                  </div>
                  <div className="field">
                    <button className="button is-link" type="submit">
                      Envoyer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

ContactPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  helmet: PropTypes.object,
};

const ContactPage = ({ data }) => {
  const { frontmatter, html } = data.markdownRemark;

  return (
    <Layout>
      <ContactPageTemplate
        content={html}
        contentComponent={HTMLContent}
        image={frontmatter.image}
        title={frontmatter.title}
        subtitle={frontmatter.subtitle}
        description={frontmatter.description}
        helmet={
          <Helmet titleTemplate={`${frontmatter.title} | Amélie la vie`}>
            <title>{`${frontmatter.title}`}</title>
            <meta name="description" content={`${frontmatter.description}`} />
            <meta property="og:type" content="website " />
            <meta property="og:title" content={`${frontmatter.title}`} />
          </Helmet>
        }
      />
    </Layout>
  );
};

ContactPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
};

export default ContactPage;

export const ContactPageQuery = graphql`
  query ContactPagePage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        subtitle
        image {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        description
      }
    }
  }
`;
