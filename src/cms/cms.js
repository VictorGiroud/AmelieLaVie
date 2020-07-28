import CMS from "netlify-cms-app";
import uploadcare from "netlify-cms-media-library-uploadcare";
import cloudinary from "netlify-cms-media-library-cloudinary";

import AboutPagePreview from "./preview-templates/AboutPagePreview";
import BlogPostPreview from "./preview-templates/BlogPostPreview";
import DefaultPagePreview from "./preview-templates/DefaultPagePreview";
import SupportPagePreview from "./preview-templates/SupportPagePreview";
import IndexPagePreview from "./preview-templates/IndexPagePreview";
import ContactPagePreview from "./preview-templates/ContactPagePreview";

CMS.registerMediaLibrary(uploadcare);
CMS.registerMediaLibrary(cloudinary);

CMS.registerPreviewTemplate("index", IndexPagePreview);
CMS.registerPreviewTemplate("about", AboutPagePreview);
CMS.registerPreviewTemplate("default-page", DefaultPagePreview);
CMS.registerPreviewTemplate("support-page", SupportPagePreview);
CMS.registerPreviewTemplate("blog", BlogPostPreview);
CMS.registerPreviewTemplate("contact-page", ContactPagePreview);
