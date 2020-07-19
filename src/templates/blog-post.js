import React from "react";
import PropTypes from "prop-types";
import {
  TwitterIcon,
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import { kebabCase } from "lodash";
import { Helmet } from "react-helmet";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import useSiteMetadata from "../hooks/useSiteMetadata";

import clockIcon from "../img/icons/clock.svg";

export const BlogPostTemplate = ({ url, content, contentComponent, description, date, tags, title, readingTime, helmet }) => {
  const PostContent = contentComponent || Content;
  const { siteURL } = useSiteMetadata();

  return (
    <section className="section">
      {helmet || ""}
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h1 className="title is-size-2 is-bold-light">{title}</h1>
            <p>
              <img src={clockIcon} alt="Temps de lecture" style={{ height: "0.8em" }} />
              <span> {date}</span>
              <span> &bull; </span>
              <span>
                Temps de lecture : {Math.round(readingTime)} minute{Math.round(readingTime) > 1 ? "s" : null}
              </span>
            </p>
            <p>{description}</p>
            <hr />
            <PostContent content={content} />

            {tags && tags.length ? (
              <>
                <hr style={{ marginTop: `2rem` }} />
                <div className="share is-size-5 is-flex">
                  Partager cet article :
                  <EmailShareButton url={url} subject={title} body={description}>
                    <EmailIcon size={32} round />
                  </EmailShareButton>
                  <FacebookShareButton url={url} quote={title}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={url} title={title}>
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <LinkedinShareButton url={url}>
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                  <WhatsappShareButton url={url} title={`${title} - ${description}`} separator=" ">
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                </div>
                <div style={{ marginTop: `2rem` }}>
                  <h4>Tags</h4>
                  <ul className="taglist">
                    {tags.map((tag) => (
                      <li key={tag + `tag`}>
                        <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

BlogPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
};

const BlogPost = ({ data, location }) => {
  const { markdownRemark: post } = data;
  const { siteURL } = useSiteMetadata();
  const url = `${siteURL}${location.pathname}`;

  return (
    <Layout>
      <BlogPostTemplate
        content={post.html}
        contentComponent={HTMLContent}
        description={post.frontmatter.description}
        date={post.frontmatter.date}
        helmet={
          <Helmet titleTemplate="%s | Actualités">
            <title>{`${post.frontmatter.title}`}</title>
            <meta name="description" content={`${post.frontmatter.description}`} />
            <meta property="og:type" content="article" />
            <meta property="og:title" content={`${post.frontmatter.title}`} />
            {post.frontmatter.featuredimage && <meta property="og:image" content={`${siteURL}${post.frontmatter.featuredimage.childImageSharp.fluid.src}`} />}
          </Helmet>
        }
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
        readingTime={post.fields.readingTime.minutes}
        url={url}
      />
    </Layout>
  );
};

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
};

export default BlogPost;

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "DD MMMM YYYY", locale: "fr")
        title
        description
        tags
        featuredimage {
          childImageSharp {
            fluid(maxWidth: 500, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
      fields {
        readingTime {
          minutes
        }
      }
    }
  }
`;
