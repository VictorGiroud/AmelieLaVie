import React from "react";
import PropTypes from "prop-types";
import { Link, graphql, StaticQuery } from "gatsby";
import PreviewCompatibleImage from "./PreviewCompatibleImage";

class BlogRoll extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: posts } = data.allMarkdownRemark;

    return (
      <div className="columns is-multiline">
        {posts &&
          posts.map(({ node: post }, index) => {
            return index === 0 ? (
              <div className="is-parent column is-12" key={post.id}>
                <article className={`blog-list-item tile is-child box notification`}>
                  <header>
                    <div className="featured-thumbnail">
                      <PreviewCompatibleImage
                        imageInfo={{
                          image: post.frontmatter.featuredimage,
                          alt: `Illustration de l'article ${post.frontmatter.title}`,
                        }}
                      />
                    </div>
                    <div>
                      <p className="post-meta">
                        <Link className="title has-text-primary is-size-4" to={post.fields.slug}>
                          {post.frontmatter.title}
                        </Link>
                        <span> &bull; </span>
                        <span className="subtitle is-size-5 is-block">{post.frontmatter.date}</span>
                      </p>
                      <p>
                        {post.excerpt}
                        <br />
                        <br />
                        <Link className="button" to={post.fields.slug}>
                          Continuer à lire →
                        </Link>
                      </p>
                    </div>
                  </header>
                </article>
              </div>
            ) : (
              <div className="is-parent column is-6 tile" key={post.id}>
                <article className={`blog-list-item tile is-child box notification`}>
                  <header>
                    <p className="post-meta">
                      <Link className="title has-text-primary is-size-5" to={post.fields.slug}>
                        {post.frontmatter.title}
                      </Link>
                      <span> &bull; </span>
                      <span className="subtitle is-size-6 is-block">{post.frontmatter.date}</span>
                    </p>
                  </header>
                  <p>{post.frontmatter.description}</p>
                </article>
              </div>
            );
          })}
      </div>
    );
  }
}

BlogRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};

export default () => (
  <StaticQuery
    query={graphql`
      query BlogRollQuery {
        allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }, filter: { frontmatter: { templateKey: { eq: "blog-post" } } }) {
          edges {
            node {
              excerpt(pruneLength: 400)
              id
              fields {
                slug
              }
              frontmatter {
                title
                templateKey
                description
                date(formatString: "DD MMMM YYYY", locale: "fr")
                featuredimage {
                  childImageSharp {
                    fluid(maxWidth: 300, quality: 100) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <BlogRoll data={data} count={count} />}
  />
);
