import React from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";

import Layout from "../components/Layout";
import Features from "../components/Features";
import BlogRoll from "../components/BlogRoll";
import AgendaEvent from "../components/AgendaEvent";

import story from "../img/story.svg";
import colibriLeft from "../img/colibri_bg_left.svg";
import colibriRight from "../img/colibri_bg_right.svg";

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

export const IndexPageTemplate = ({ title, heading, subheading, mainpitch, description, intro }) => (
  <div className="index">
    <div
      className="full-width margin-top-0 section-secondary"
      style={{
        backgroundPosition: `top left`,
        backgroundAttachment: `fixed`,
      }}
    >
      <div
        style={{
          display: "flex",
          lineHeight: "1",
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1
          className="has-text-weight-bold is-size-3-mobile is-size-2-tablet is-size-1-widescreen"
          style={{
            color: "#ffaf40",
            lineHeight: "1",
            padding: "0.25em",
          }}
        >
          {title}
        </h1>
        <h3
          className="has-text-weight-bold is-size-5-mobile is-size-5-tablet is-size-4-widescreen"
          style={{
            color: "#ffaf40",
            lineHeight: "1",
            padding: "0.25em",
          }}
        >
          {subheading}
        </h3>
      </div>
    </div>
    <Section odd>
      <div className="content">
        <div className="tile">
          <h1 className="title">{mainpitch.title}</h1>
        </div>
        <div className="section-container">
          <div className="section-icon is-hidden-mobile">
            <img src={story} alt="Histoire" style={{ width: "100%" }} />
          </div>
          <div className="section-content">
            <p className="subtitle">{mainpitch.description}</p>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column is-12 has-text-centered">
          <Link className="btn" to="/products">
            En savoir plus sur l'association
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
    <Section odd>
      <div className="columns">
        <div className="column is-12">
          <h1 className="title">{heading}</h1>
          <p>{description}</p>
        </div>
      </div>
      <Features gridItems={intro.blurbs} />
      <div className="columns">
        <div className="column is-12 has-text-centered">
          <Link className="btn" to="/products">
            En savoir plus sur notre projet d'habitat partagé
          </Link>
        </div>
      </div>
    </Section>
    <Section>
      <div className="column is-12">
        <h3 className="has-text-weight-semibold is-size-2">Actualités</h3>
        <BlogRoll />
        <div className="column is-12 has-text-centered">
          <Link className="btn" to="/blog">
            Plus d'articles
          </Link>
        </div>
      </div>
    </Section>
  </div>
);

IndexPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  heading: PropTypes.string,
  subheading: PropTypes.string,
  mainpitch: PropTypes.object,
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
        subheading={frontmatter.subheading}
        mainpitch={frontmatter.mainpitch}
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
        subheading
        mainpitch {
          title
          description
        }
        description
        intro {
          blurbs {
            image {
              childImageSharp {
                fluid(maxWidth: 240, quality: 64) {
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
