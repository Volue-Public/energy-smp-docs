/**
 * This script must be placed in the HEAD above all external stylesheet declarations
 * (link[rel=stylesheet])
 * It contains logic for grouping our second stage font loadings into
 * a single repaint and reflow using CSS Font Loading API
 * @preserve
 */

(function (window) {
  'use strict';

  var fontsDirFromMeta = getMeta('fontsDir');

  function loadFonts(fontsDir) {
    if ('fonts' in document) {
      var fkDisplayRegular = new FontFace(
        'FK Display',
        'url(' +
          fontsDir +
          "/FKDisplay-Regular.woff2) format('woff2'), url(" +
          fontsDir +
          "/FKDisplay-Regular.woff) format('woff')"
      );
      var sourceSansProRegular = new FontFace(
        'Source Sans Pro',
        'url(' +
          fontsDir +
          "/SourceSansPro-Regular.woff2) format('woff2'), url(" +
          fontsDir +
          "/SourceSansPro-Regular.woff) format('woff')"
      );
      var sourceSansProItalic = new FontFace(
        'Source Sans Pro',
        'url(' +
          fontsDir +
          "/SourceSansPro-Italic.woff2) format('woff2'), url(" +
          fontsDir +
          "/SourceSansPro-Italic.woff) format('woff')",
        { style: 'italic' }
      );
      var sourceSansProSemiBold = new FontFace(
        'Source Sans Pro',
        'url(' +
          fontsDir +
          "/SourceSansPro-SemiBold.woff2) format('woff2'), url(" +
          fontsDir +
          "/SourceSansPro-SemiBold.woff) format('woff')",
        { weight: '600' }
      );

      Promise.all([
        fkDisplayRegular.load(),
        sourceSansProRegular.load(),
        sourceSansProItalic.load(),
        sourceSansProSemiBold.load()
      ]).then(function (loadedFonts) {
        // Render loaded fonts at the same time (single repaint)
        loadedFonts.forEach(function (font) {
          document.fonts.add(font);
        });
      });
    }

    // Support for Edge/IE
    if (!('fonts' in document) && 'querySelector' in document) {
      var styleElement = document.createElement('style');
      styleElement.innerHTML =
        "@font-face { font-family: 'FK Display'; src: url(" +
        fontsDir +
        "/FKDisplay-Regular.woff2) format('woff2'), url(" +
        fontsDir +
        "/FKDisplay-Regular.woff) format('woff'); }" +
        "@font-face { font-family: 'Source Sans Pro'; src: url(" +
        fontsDir +
        "/SourceSansPro-Regular.woff2) format('woff2'), url(" +
        fontsDir +
        "/SourceSansPro-Regular.woff) format('woff'); }" +
        "@font-face { font-family: 'Source Sans Pro'; src: url(" +
        fontsDir +
        "/SourceSansPro-Italic.woff2) format('woff2'), url(" +
        fontsDir +
        "/SourceSansPro-Italic.woff) format('woff'); font-style: italic; }" +
        "@font-face { font-family: 'Source Sans Pro'; src: url(" +
        fontsDir +
        "/SourceSansPro-SemiBold.woff2) format('woff2'), url(" +
        fontsDir +
        "/SourceSansPro-SemiBold.woff) format('woff'); font-weight: 600; }";
      document.head.appendChild(styleElement);
    }
  }

  /**
   * Get fonts directory from meta tag if present
   *
   * To define directory use meta tag in the head of the document:
   * <meta name="fontsDir" content="/path/to/fonts">
   */
  function getMeta(metaname) {
    var metas = window.document.getElementsByTagName('meta');
    var meta;

    for (var i = 0; i < metas.length; i++) {
      // eslint-disable-next-line eqeqeq
      if (metas[i].name && metas[i].name == metaname) {
        meta = metas[i];
        break;
      }
    }

    return meta;
  }

  loadFonts(fontsDirFromMeta != null ? fontsDirFromMeta.content : '/fonts');
})(this);
