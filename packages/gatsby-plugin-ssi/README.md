# gatsby-plugin-ssi

Provides ability to add SSI elements to head of your gatsby site.

## Install

`npm install --save @bodiless/gatsby-plugin-ssi`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `@bodiless/gatsby-plugin-ssi`,
    options: {
      // path to your json file that contains SSI configs.
      // default value is ssi/ssi_conf.json relative to your gatsby site.
      ssiConfPath: `/path/to/your/ssi_conf`,
    },
  },
]
```

## SSI config format

SSI configuration file should be in json format.

```
{
  key1: {
    pragma: "<!--# ssi data should go here -->",
    ...
  }
  ...
  keyN: {
    pragma: "<!--# ssi data should go here -->",
    ...
  }
}
```

The plugin will take elements defined in pragma field and will inject them to generated site leveraging GATSBY API.