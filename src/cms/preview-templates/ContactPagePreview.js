import React from "react";
import PropTypes from "prop-types";
import { ContactPageTemplate } from "../../templates/contact-page";

const ContactPagePreview = ({ entry, getAsset }) => {
  return (
    <ContactPageTemplate
      image={getAsset(entry.getIn(["data", "image"]))}
      title={entry.getIn(["data", "title"])}
      subtitle={entry.getIn(["data", "subtitle"])}
      description={entry.getIn(["data", "description"])}
    />
  );
};

ContactPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  getAsset: PropTypes.func,
};

export default ContactPagePreview;
