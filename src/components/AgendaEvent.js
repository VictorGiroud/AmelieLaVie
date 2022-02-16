import React from "react";
import { Link, graphql, StaticQuery } from "gatsby";
import agendaIcon from "../img/agenda.svg";
import locationIcon from "../img/icons/location.svg";

class AgendaEvent extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: events } = data.allMarkdownRemark;
    const years = [...new Set(events.map((event) => event.node.frontmatter.year))];

    return (
      <>
        {years.map((year) => (
          <div key={year}>
            <div className="is-size-4 has-text-weight-bold">{year}</div>
            <div className="columns is-multiline agenda">
              {events
                .filter((event) => event.node.frontmatter.year === year)
                .map(({ node: event }) => (
                  <EventItem event={event} key={event.id} />
                ))}
            </div>
          </div>
        ))}
        {events.length === 0 && <div>Aucun évenement n'est planifié pour le moment.</div>}
      </>
    );
  }
}

class EventItem extends React.Component {
  render() {
    const { event } = this.props;
    return (
      <div className="is-parent column is-6 agenda-event-item-container" key={event.id}>
        <div className="agenda-event-item">
          <div className="agenda-event-item-calendar">
            <img src={agendaIcon} alt="Agenda" style={{ width: "100%" }} />
            <div className="agenda-event-item-calendar-month has-text-weight-bold is-uppercase">{event.frontmatter.month}</div>
            <div className="agenda-event-item-calendar-day has-text-weight-bold is-size-4">{event.frontmatter.day}</div>
          </div>
          <div className="agenda-event-item-text">
            <div className="agenda-event-item-text-title is-size-4">{event.frontmatter.title}</div>
            <div className="is-size-6">{event.frontmatter.resume}</div>
            {event.frontmatter.address && (
              <div className="is-size-6 text-right">
                <img src={locationIcon} alt="Agenda" style={{ height: "0.75em" }} />
                <a
                  className="agenda-event-item-location"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.google.com/maps/search/?api=1&query=${event.frontmatter.address}`}
                >
                  {event.frontmatter.address}
                </a>
              </div>
            )}

            <div className="agenda-event-item-text-more is-size-6">
              <Link className="agenda-event-item-text-more" to={event.fields.slug}>
                Plus d'informations...
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const AgendaEventComponent = () => (
  <StaticQuery
    query={graphql`
      query AgendaEventQuery {
        allMarkdownRemark(
          limit: 4
          sort: { order: ASC, fields: [frontmatter___date] }
          filter: { isFuture: { eq: true }, frontmatter: { templateKey: { eq: "agenda-event" }, display: { eq: true } } }
        ) {
          edges {
            node {
              id
              fields {
                slug
              }
              frontmatter {
                title
                resume
                description
                address
                day: date(formatString: "DD", locale: "fr")
                month: date(formatString: "MMM", locale: "fr")
                year: date(formatString: "YYYY", locale: "fr")
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <AgendaEvent data={data} count={count} />}
  />
);

export default AgendaEventComponent;
