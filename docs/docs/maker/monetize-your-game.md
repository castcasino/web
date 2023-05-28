---
sidebar_position: 2
---

# Monetize Your Game

Let's learn how you can quickly integrate monetization strategies into your existing game.

## Upgrade Your Existing Project

Use the Nexa Builder Studio to upgrade your project folder:

```bash
npm create nexa upgrade
```

Or you can manage the upgrade changes manually.

## Add a Configuration file

Your application must provide specific settings in order to properly communicate with the __Provable Fairplay Gaming (PFG)__ Engine.

Customize your own `fairplay.yml` file:

```yaml title="fairplay.yml"
themeConfig
  navbar
    items
      // highlight-start
      - localeDropdown
      // highlight-end
      - anotherDropdown
```

:::caution

Specifications are still __IN ACTIVE DEVELOPMENT__ and are subject to change.

:::

Or build your site to include all the locales at once:

```bash
npm run build
```
