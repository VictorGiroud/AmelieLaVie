import React from "react";
import PropTypes from "prop-types";
import { Link, graphql, StaticQuery } from "gatsby";

class AgendaEvent extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: events } = data.allMarkdownRemark;

    return <div>{events && events.map(({ node: event }) => <div key={event.id}>{event.id}</div>)}</div>;
  }
}

export default () => (
  <StaticQuery
    query={graphql`
      query AgendaEventQuery {
        allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }, filter: { frontmatter: { templateKey: { eq: "agenda-event" } } }) {
          edges {
            node {
              id
              frontmatter {
                title
                templateKey
                date(formatString: "MMMM DD, YYYY")
                featuredpost
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <AgendaEvent data={data} count={count} />}
  />
);
