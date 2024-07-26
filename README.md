# dc-extension-aprimo-content-selector

This extension allows customers to browse and select files from [Aprimo DAM](https://www.aprimo.com/) directly in [Amplience Dynamic Content](https://amplience.com/platform/cms/).

## Usage Detail

- Interface to launch the Aprimo Content Selector in `singlerendition` mode.
- User can select an asset and an rendition.
- Upon selection the JSON data from Aprimo is stored in the - content form for use.
- When no asset is selected, a blank card is displayed with the option to add an asset and JSON content is removed.

When an asset (and rendition) have been succesfully selected the card will update to show:

- A preview of the asset (via the selected rendition `publicuri`)
- The title of the selected asset
- The Aprimo ID of the selected asset
- Action buttons which allow the user to:
  - Deep link to the asset directly in Aprimo DAM
  - Remove the asset selected from the Amplience Content form

## Pre-requisites

- Amplience
  - Amplience Dynamic Content Hub
    - Developer permissions or higher to install extension
    - Ability to host extension
- Aprimo
  - Aprimo DAM
    - User login details with appropriate permissions
    - Tenant URL
    - CDN mode enabled

## 🏁 Quickstart

### Register Extension

This extension needs to be [registered](https://amplience.com/docs/development/registeringextensions.html) against a Hub with in the Dynamic Content application (Developer -> Extensions), for it to load within that Hub.

- Category: Content Field
- Label: Aprimo Content Selector
- Name: aprimo-content-selector (needs to be unique with the Hub)
- URL: <url_to_hosted_extension> (can be `http://localhost:5173` if you are running the extension locally)
- Description: Aprimo image selector (can be left blank, if you wish)
- Initial height: 200

### Extension Permissions

Under the Permissions tab, select the following:

Sandbox Permissions:

- ✅ Allow Pop-ups
- ✅ Allow Pop-ups to escape sandbox

### Extension Installation Parameters

Use the following installation parameters:

```json
{
  "aprimoConfig": {
    "tenantUrl": "<your_aprimo_dam_tenant_url>"
  }
}
```

Example Format: `https://{youraccount}.dam.aprimo.com`

### Snippet (Optional)

You may also wish to create a [Snippet](https://amplience.com/developers/docs/integrations/extensions/register-use/#adding-snippets-for-content-field-extensions) for the extension to make it easier to add to content types. Example below:

Label:

```
Aprimo Content Selector
```

Body:

```json
{
  "name": "Aprimo Selector",
  "description": "Allows selection of assets from Aprimo DAM",
  "type": "object",
  "ui:extension": {
    "name": "aprimo-content-selector"
  }
}
```

## Example Schema

This is an example schema using the extension:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://amplience.com/examples/aprimo-content-selector.json",

  "title": "Aprimo Content Selector",
  "description": "Example Aprimo Content Selector",

  "allOf": [
    {
      "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/content"
    }
  ],
  "type": "object",
  "properties": {
    "aprimo": {
      "name": "Aprima Selector",
      "description": "Allows selection of assets from Aprimo DAM",
      "type": "object",
      "ui:extension": {
        "name": "aprimo-content-selector"
      }
    }
  },
  "propertyOrder": []
}
```

## Integration

When an asset is selected in from Aprimo it is available in the Amplience Content. The JSON stored is exactly as returned from the Aprimo Content Selector when a rendition is selected.

Example:

```json
"aprimo": {
  "id": "{{id_of_asset_in_aprimo}}",
  "title": "{{title_of_asset_in_aprimo}}",
  "rendition": {
    "id": "{{id_of_rendition_in_aprimo}}",
    "publicuri": "{{url_path_to_rendition_on_aprimo_cdn}}"
  }
}
```

You will use the `publicuri` of the asset to use the asset and any additional information available that your application requires.

## Running the extension locally

Setup and install package dependencies

```bash
nvm use
npm install
```

Run the extension

```bash
npm run dev
```

## Building and hosting the extension

Build the project to produce hostable files using:

```bash
npm run build
```

This will produce a `dist` folder in the root of the project. You can use the files to host them statically (e.g. S3) or through your prefered hosting solution (Vercel, Netlify etc.)

## Known Limitations

## Warranty & Support

This is an _open source_ demonstration to show possible patterns and comes with no support or warranty.

At time of publishing this extension allowed users to select content via the [Aprimo Content Selector](https://developers.aprimo.com/digital-asset-management/aprimo-integration-tools/aprimo-content-selector/)

Users are expected to host this extension themselves and use this as a starting point for their integration.

## FAQ

**Q: Nothing happens when I click to add content.**

A: Please check your permissions as the Aprimo Content Selector uses the browser postMessage API.

**Q: I can see assets but cannot select them**

A: Ensure that you have at least one rendition for the asset to select and that CDN mode is enabled in your Aprimo Account.

**Q: I can only see images**

A: This demonstration only allows selection of content which is `ContentType - "Image"` from Aprimo.

**Q: I have selected an image but a thumbnail is not showing in Amplience**

A: The rendition selected is probably not suitable to display as an image in a web browser. An example may be a `.tif` file where the rendition is also a `.tif`
