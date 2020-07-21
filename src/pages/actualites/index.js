import React from "react";

import Layout from "../../components/Layout";
import BlogRoll from "../../components/BlogRoll";
import FullWidthImage from "../../components/FullWidthImage";

export default class BlogIndexPage extends React.Component {
  render() {
    return (
      <Layout>
        <FullWidthImage image={"/img/actualites.jpg"} title={"Actualités"} />
        <section className="section section--gradient">
          <div className="container">
            <div className="columns">
              <div className="column is-10 is-offset-1">
                <div className="section">
                  <h2 className="title">Derniers articles</h2>
                  <BlogRoll limit={21} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}
