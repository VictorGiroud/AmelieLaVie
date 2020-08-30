"use strict";

var _netlifyCmsApp = _interopRequireDefault(require("netlify-cms-app"));

var _netlifyCmsMediaLibraryUploadcare = _interopRequireDefault(require("netlify-cms-media-library-uploadcare"));

var _netlifyCmsMediaLibraryCloudinary = _interopRequireDefault(require("netlify-cms-media-library-cloudinary"));

var _BlogPostPreview = _interopRequireDefault(require("./preview-templates/BlogPostPreview"));

var _DefaultPagePreview = _interopRequireDefault(require("./preview-templates/DefaultPagePreview"));

var _SupportPagePreview = _interopRequireDefault(require("./preview-templates/SupportPagePreview"));

var _IndexPagePreview = _interopRequireDefault(require("./preview-templates/IndexPagePreview"));

var _ContactPagePreview = _interopRequireDefault(require("./preview-templates/ContactPagePreview"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_netlifyCmsApp["default"].registerMediaLibrary(_netlifyCmsMediaLibraryUploadcare["default"]);

_netlifyCmsApp["default"].registerMediaLibrary(_netlifyCmsMediaLibraryCloudinary["default"]);

_netlifyCmsApp["default"].registerPreviewTemplate("index", _IndexPagePreview["default"]);

_netlifyCmsApp["default"].registerPreviewTemplate("default-page", _DefaultPagePreview["default"]);

_netlifyCmsApp["default"].registerPreviewTemplate("support-page", _SupportPagePreview["default"]);

_netlifyCmsApp["default"].registerPreviewTemplate("blog", _BlogPostPreview["default"]);

_netlifyCmsApp["default"].registerPreviewTemplate("contact-page", _ContactPagePreview["default"]);