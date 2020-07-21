import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import FullWidthImage from "../components/FullWidthImage";

export const DefaultPageTemplate = ({ image, content, contentComponent, title, subtitle, description, helmet }) => {
  const HtmlContent = contentComponent || Content;

  return (
    <div className="content">
      {helmet || ""}
      <FullWidthImage image={image} title={title} subtitle={subtitle} />
      <section className="section section--gradient">
        <div className="container">
          <div className="section">
            <div className="columns">
              <div className="column is-7 is-offset-1">
                <HtmlContent content={content} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

DefaultPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  helmet: PropTypes.object,
};

const DefaultPage = ({ data }) => {
  const { frontmatter, html } = data.markdownRemark;

  return (
    <Layout>
      <DefaultPageTemplate
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

DefaultPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
};

export default DefaultPage;

export const DefaultPageQuery = graphql`
  query DefaultPagePage($id: String!) {
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
