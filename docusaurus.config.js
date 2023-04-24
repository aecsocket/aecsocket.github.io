// @ts-check

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import("@docusaurus/types").Config} */
const config = {
  title: "aecsocket.github.io",
  favicon: "img/icon.svg",

  url: "https://aecsocket.github.io",
  baseUrl: "/",

  organizationName: "aecsocket",
  projectName: "aecsocket.github.io",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import("@docusaurus/preset-classic").Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          routeBasePath: "/",
          editUrl: "https://github.com/aecsocket/aecsocket.github.io/blob/main/",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import("@docusaurus/preset-classic").ThemeConfig} */
    ({
      navbar: {
        title: "aecsocket.github.io",
        logo: {
          alt: "aecsocket",
          src: "img/icon.svg",
        },
        items: [
          {
            href: "https://github.com/aecsocket/aecsocket.github.io",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} aecsocket. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: [
          "yaml",
          "kotlin",
          "icu-message-format",
        ],
      },
    }),
};

module.exports = config;
