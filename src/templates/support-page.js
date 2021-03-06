import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import FullWidthImage from "../components/FullWidthImage";

const iframeAdhesion = `<iframe id="haWidget" allowtransparency="true" src="https://www.helloasso.com/associations/amelie-la-vie/adhesions/adhesion-amelie-la-vie/widget-vignette-horizontale" style="width:100%;height:250px;border:none;"></iframe>`;
const iframeAdhesionTablet = `<iframe id="haWidget" allowtransparency="true" src="https://www.helloasso.com/associations/amelie-la-vie/adhesions/adhesion-amelie-la-vie/widget-vignette" style="width:350px;height:380px;border:none;"></iframe>`;
const iframeAdhesioMobile = `<iframe id="haWidget" allowtransparency="true" src="https://www.helloasso.com/associations/amelie-la-vie/adhesions/adhesion-amelie-la-vie/widget-bouton" style="width:150px;height:70px;border:none;"></iframe>`;

const iframeTip = `<iframe id="haWidget" allowtransparency="true" src="https://www.helloasso.com/associations/amelie-la-vie/formulaires/1/widget-bouton" style="width:200px;height:100px;border:none;"></iframe><div style="width:100%;">`;

function Iframe(props) {
  return <div dangerouslySetInnerHTML={{ __html: props.iframe ? props.iframe : "" }} />;
}

export const SupportPageTemplate = ({ image, content, contentComponent, title, subtitle, description, adhesion, tips, helmet }) => {
  const HtmlContent = contentComponent || Content;

  return (
    <div className="content">
      {helmet || ""}
      {image && <FullWidthImage image={image} title={title} subtitle={subtitle} />}
      <section className="section section--gradient">
        <div className="container">
          <div className="section">
            <div className="columns">
              <div className="column is-10 is-offset-1">
                {!image && <h1>{title}</h1>}
                <HtmlContent content={content} />
                <div className="adhesion">
                  <h3>Adhérer à l'association</h3>
                  <p>{adhesion}</p>
                  <div className="is-hidden iframe-desktop">
                    <Iframe iframe={iframeAdhesion} />
                  </div>
                  <div className="is-hidden iframe-tablet">
                    <Iframe iframe={iframeAdhesionTablet} />
                  </div>
                  <div className="is-hidden iframe-mobile">
                    <Iframe iframe={iframeAdhesioMobile} />
                  </div>
                </div>
                <div>
                  <h3>Faire un don</h3>
                  <p>{tips}</p>
                  <Iframe iframe={iframeTip} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

SupportPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  adhesion: PropTypes.string,
  tips: PropTypes.string,
  helmet: PropTypes.object,
};

const SupportPage = ({ data }) => {
  const { frontmatter, html } = data.markdownRemark;

  return (
    <Layout>
      <SupportPageTemplate
        content={html}
        contentComponent={HTMLContent}
        image={frontmatter.image}
        title={frontmatter.title}
        subtitle={frontmatter.subtitle}
        description={frontmatter.description}
        tips={frontmatter.tips}
        adhesion={frontmatter.adhesion}
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

SupportPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
};

export default SupportPage;

export const SupportPageQuery = graphql`
  query SupportPage($id: String!) {
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
        tips
        adhesion
      }
    }
  }
`;
