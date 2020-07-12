import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";

export const AgendaEventTemplate = ({ content, contentComponent, date, description, resume, address, title, helmet }) => {
  const EventContent = contentComponent || Content;

  return (
    <section className="section">
      {helmet || ""}
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">{title}</h1>
            <p>
              {date}
              {address && (
                <>
                  {" - "}
                  <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${address}`}>
                    {address}
                  </a>
                </>
              )}
            </p>
            <p className="has-text-weight-light is-size-5">{resume}</p>
            <EventContent content={description} />
          </div>
        </div>
      </div>
    </section>
  );
};

const AgendaEvent = ({ data }) => {
  console.log(data);
  const { markdownRemark: event } = data;

  return (
    <Layout>
      <AgendaEventTemplate
        content={event.html}
        contentComponent={HTMLContent}
        resume={event.frontmatter.resume}
        description={event.frontmatter.description}
        address={event.frontmatter.address}
        date={event.frontmatter.date}
        helmet={
          <Helmet titleTemplate="%s | Blog">
            <title>{`${event.frontmatter.title}`}</title>
            <meta name="description" content={`${event.frontmatter.resume}`} />
          </Helmet>
        }
        title={event.frontmatter.title}
      />
    </Layout>
  );
};

export default AgendaEvent;

export const pageQuery = graphql`
  query AgendaEventByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "DD MMMM YYYY", locale: "fr")
        title
        resume
        description
        address
      }
    }
  }
`;
