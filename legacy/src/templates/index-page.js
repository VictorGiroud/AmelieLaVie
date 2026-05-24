import React from "react";
import PropTypes from "prop-types";
import { Link, navigate, graphql } from "gatsby";

import PreviewCompatibleImage from "../components/PreviewCompatibleImage";
import Layout from "../components/Layout";
import Features from "../components/Features";
import BlogRoll from "../components/BlogRoll";
import AgendaEvent from "../components/AgendaEvent";

import famillessolidaires from "../img/famillessolidaires.png";
import ag2r from "../img/ag2r.png";
import grandlyon from "../img/grandlyon.svg";
import geotec from "../img/geotec.png";
import qualitel from "../img/qualitel.png";
import dynacite from "../img/dynacite.png";
import domea from "../img/domea.png";
import cnsa from "../img/cnsa.png";
import caissedepargne from "../img/caissedepargne.png";
import mma from "../img/mma.png";
import fdj from "../img/fdj.png";
import seb from "../img/seb.png";
import sportdimanche from "../img/sportdimanche.png";
import ccah from "../img/ccah.png";
import macif from "../img/macif.png";
import malakoff from "../img/malakoff.png";
import lionsclub from "../img/lionsclub.png";

import colibriLeft from "../img/colibri_bg_left.svg";
import colibriRight from "../img/colibri_bg_right.svg";
import phone from "../img/phone.svg";
import love from "../img/love.svg";

// eslint-disable-next-line
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

// eslint-disable-next-line
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
        <article className="message is-primary is-size-5">
          <div className="message-body">{alerte}</div>
        </article>
      )}
      <div className="content">
        <div className="tile">
          <h2 className="title">{presentation.title}</h2>
        </div>
        <div className="section-container">
          <div className="section-icon is-hidden-mobile">
            <PreviewCompatibleImage
              imageInfo={{
                image: presentation.image,
                alt: `Logo Amélie la vie`,
              }}
            />
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
        <h2 className="title">Actualités</h2>
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
          <h2 className="title">{heading}</h2>
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
          <h2 className="title">Evenements à venir</h2>
          <AgendaEvent />
        </div>
      </div>
    </Section>
    <Section odd>
      <div className="columns">
        <div className="column is-12">
          <h4 className="title">Amélie la Vie est soutenu par :</h4>
          <a className="support" title="AG2R La Mondiale" href="https://www.ag2rlamondiale.fr" target="_blank" rel="noopener noreferrer">
            <img src={ag2r} alt="AG2R La Mondiale" />
          </a>
          <a className="support" title="Malakoff Humanis" href="https://www.malakoffhumanis.com" target="_blank" rel="noopener noreferrer">
            <img src={malakoff} alt="Malakoff Humanis" />
          </a>
          <a className="support" title="CCAH" href="https://www.ccah.fr" target="_blank" rel="noopener noreferrer">
            <img src={ccah} alt="CCAH" />
          </a>
          <a className="support" title="Familles Solidaires" href="https://familles-solidaires.com" target="_blank" rel="noopener noreferrer">
            <img src={famillessolidaires} alt="Familles Solidaires" />
          </a> 
          <a className="support" title="Géotec" href="https://www.geotec.fr" target="_blank" rel="noopener noreferrer">
            <img src={geotec} alt="Géotec" />
          </a> 
          <a className="support" title="Dynacité" href="https://www.dynacite.fr" target="_blank" rel="noopener noreferrer">
            <img src={dynacite} alt="Dynacité" />
          </a> 
          <a className="support" title="Qualitel" href="https://www.qualitel.org" target="_blank" rel="noopener noreferrer">
            <img src={qualitel} alt="Qualitel" />
          </a> 
          <a className="support" title="Domea Conseil" href="http://www.domeaconseil.fr" target="_blank" rel="noopener noreferrer">
            <img src={domea} alt="Domea Conseil" />
          </a> 
          <a className="support" title="CNSA" href="https://www.cnsa.fr" target="_blank" rel="noopener noreferrer">
            <img src={cnsa} alt="CNSA" />
          </a> 
          <a className="support" title="Fondation MMA solidarité" href="https://www.mma.fr/a-propos/fondation-mma.html" target="_blank" rel="noopener noreferrer">
            <img src={mma} alt="Fondation MMA solidarité" />
          </a>
          <a className="support" title="Fondation FDJ" href="https://www.groupefdj.com/fr/fondation.html" target="_blank" rel="noopener noreferrer">
            <img src={fdj} alt="Fondation FDJ" />
          </a>
          <a className="support" title="Fonds Groupe SEB" href="https://www.groupeseb.com/fr/fonds-groupe-seb" target="_blank" rel="noopener noreferrer">
            <img src={seb} alt="Fonds Groupe SEB" />
          </a>
          <a className="support" title="Métropole de Lyon" href="https://www.grandlyon.com" target="_blank" rel="noopener noreferrer">
            <img src={grandlyon} alt="Métropole de Lyon" />
          </a>
          <a className="support" title="Fondation Caisse d'Epargne" href="https://www.caissedepargnerhonealpes.fr/responsable-solidaire/la-fondation/" target="_blank" rel="noopener noreferrer">
            <img src={caissedepargne} alt="Fondation Caisse d'Epargne" />
          </a>
          <a className="support" title="Sport Dimanche" href="https://www.facebook.com/SportDimanche" target="_blank" rel="noopener noreferrer">
            <img src={sportdimanche} alt="Sport Dimanche" />
          </a>
          <a className="support" title="Fondation Macif" href="https://www.fondation-macif.org" target="_blank" rel="noopener noreferrer">
            <img src={macif} alt="Fondation Macif" />
          </a>
          <a className="support" title="Lions Clubs" href="https://www.lions-france.org" target="_blank" rel="noopener noreferrer">
            <img src={lionsclub} alt="Lions Clubs" />
          </a>
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
        heading
        alerte
        presentation {
          title
          description
          image {
            childImageSharp {
              fluid(maxWidth: 80, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
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
