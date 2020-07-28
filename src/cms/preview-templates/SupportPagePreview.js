import React from "react";
import PropTypes from "prop-types";
import { SupportPageTemplate } from "../../templates/support-page";

const SupportPagePreview = ({ entry, getAsset }) => {
  return (
    <SupportPageTemplate
      image={getAsset(entry.getIn(["data", "image"]))}
      title={entry.getIn(["data", "title"])}
      subtitle={entry.getIn(["data", "subtitle"])}
      description={entry.getIn(["data", "description"])}
      adhesion={entry.getIn(["data", "adhesion"])}
      tips={entry.getIn(["data", "tips"])}
    />
  );
};

SupportPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  getAsset: PropTypes.func,
};

export default SupportPagePreview;
