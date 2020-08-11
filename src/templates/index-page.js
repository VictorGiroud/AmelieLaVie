import React from "react";
import PropTypes from "prop-types";
import { Link, navigate, graphql } from "gatsby";

import Layout from "../components/Layout";
import Features from "../components/Features";
import BlogRoll from "../components/BlogRoll";
import AgendaEvent from "../components/AgendaEvent";

import logo from "../img/logo.jpg";
import colibriLeft from "../img/colibri_bg_left.svg";
import colibriRight from "../img/colibri_bg_right.svg";
import phone from "../img/phone.svg";
import love from "../img/love.svg";

export const Section = ({ children, odd }) => (
  <section
    className="section"
    style={{
      backgroundPosition: odd ? `bottom 1em right 1em` : `bottom 1em left 1em`,
      backgroundImage: `url(${odd ? colibriRight : colibriLeft})`,
      backgroundRepeat: `no-repeat`,
      backgroundSize: `4em`,
    }}
  >
    <div className="container">
      <div className="section">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <div className="content">{children}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const IndexPageTemplate = ({ title, heading, alerte, presentation, description, intro }) => (
  <div className="index">
    <div className="full-width full-width-padding">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1
          className="is-size-4-mobile is-size-3-tablet is-size-2-widescreen quote"
          style={{
            lineHeight: "1",
            padding: "0.25em",
          }}
        >
          {title}
        </h1>
      </div>
    </div>
    <Section odd>
      {alerte && (
        <article className="message is-primary">
          <div className="message-body">{alerte}</div>
        </article>
      )}
      <div className="content">
        <div className="tile">
          <h1 className="title">{presentation.title}</h1>
        </div>
        <div className="section-container">
          <div className="section-icon is-hidden-mobile">
            <img src={logo} alt="Histoire" style={{ width: "100%" }} />
          </div>
          <div className="section-content">
            <p className="subtitle">{presentation.description}</p>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column is-12 has-text-centered">
          <Link className="btn" to="/association">
            En savoir plus sur l'association
          </Link>
        </div>
      </div>
    </Section>
    <Section>
      <div className="column is-12">
        <h1 className="title">Actualités</h1>
        <BlogRoll limit={5} />
        <div className="column is-12 has-text-centered">
          <Link className="btn" to="/actualites">
            Plus d'articles
          </Link>
        </div>
      </div>
    </Section>
    <Section odd>
      <div className="columns">
        <div className="column is-12">
          <h1 className="title">{heading}</h1>
          <p>{intro.heading}</p>
        </div>
      </div>
      <Features gridItems={intro.blurbs} />
      <div className="columns">
        <div className="column is-12">
          <p>{intro.description}</p>
        </div>
      </div>
      <div className="columns">
        <div className="column is-12 has-text-centered">
          <Link className="btn" to="/habitat-partage">
            En savoir plus sur notre projet d'habitat partagé
          </Link>
        </div>
      </div>
    </Section>
    <Section>
      <div className="columns">
        <div className="column is-12">
          <h1 className="title">Evenements à venir</h1>
          <AgendaEvent />
        </div>
      </div>
    </Section>
    <div className="help-us">
      <div className="container">
        <div className="section">
          <div className="columns">
            <div className="column is-5 is-offset-1">
              <div
                className="content help-us-tile"
                onClick={() => navigate("nous-soutenir")}
                onKeyPress={() => navigate("nous-soutenir")}
                tabIndex="0"
                role="link"
              >
                <div className="help-us-tile-image">
                  <img src={love} alt="Nous soutenir" style={{ width: "100%" }} />
                </div>
                <div className="help-us-tile-text">Nous soutenir, adhérer, faire un don</div>
              </div>
            </div>
            <div className="column is-5">
              <div className="content help-us-tile" onClick={() => navigate("contact")} onKeyPress={() => navigate("contact")} tabIndex="0" role="link">
                <div className="help-us-tile-image">
                  <img src={phone} alt="Nous contacter" style={{ width: "100%" }} />
                </div>
                <div className="help-us-tile-text">Nous contacter</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

IndexPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  heading: PropTypes.string,
  alerte: PropTypes.string,
  presentation: PropTypes.object,
  description: PropTypes.string,
  intro: PropTypes.shape({
    blurbs: PropTypes.array,
  }),
};

const IndexPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark;

  return (
    <Layout>
      <IndexPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
        heading={frontmatter.heading}
        alerte={frontmatter.alerte}
        presentation={frontmatter.presentation}
        description={frontmatter.description}
        intro={frontmatter.intro}
      />
    </Layout>
  );
};

IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
};

export default IndexPage;

export const pageQuery = graphql`
  query IndexPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter {
        title
        image {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        heading
        alerte
        presentation {
          title
          description
        }
        description
        intro {
          blurbs {
            image {
              childImageSharp {
                fluid(maxWidth: 320, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            text
          }
          heading
          description
        }
      }
    }
  }
`;
