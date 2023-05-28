// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Discover Nexa Gaming',
  tagline: 'Fairplay Is Guaranteed!',
  url: 'https://docs.nexa.games',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Start Here',
        logo: {
          alt: 'Fairplay Is Guaranteed!',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'play/welcome',
            position: 'left',
            label: 'For Players',
          },
          {
            type: 'doc',
            docId: 'maker/welcome',
            position: 'left',
            label: 'For Gamemakers',
          },
          {
            type: 'doc',
            docId: 'bank/welcome',
            position: 'left',
            label: 'For Bankers',
          },
          {
            type: 'doc',
            docId: 'promo/welcome',
            position: 'left',
            label: 'For Promoters',
          },
          {
            href: 'https://nexa.games/gallery',
            label: 'Browse the Games',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Welcome',
                to: '/welcome',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/NEXAdotgames',
              },
              {
                label: 'Reddit',
                href: 'https://www.reddit.com/r/NexaGames/',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Games Gallery',
                to: 'https://nexa.games/gallery',
              },
              {
                label: 'GitHub',
                href: 'https://repo.hos.im/nyusternie/nexa-games',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Nexa Games DAO.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
