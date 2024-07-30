# dc-extension-aprimo-content-selector

This extension allows customers to browse and select files from [Aprimo DAM](https://www.aprimo.com/) directly in [Amplience Dynamic Content](https://amplience.com/platform/cms/).

It also allows configuration to automatically upload selected image file renditions to the Amplience Content Hub for use with Amplience Dynamic Media.

## Table Of Contents

- [Usage Detail](#usage-detail)
  - [Aprimo Only (Standalone)](#aprimo-only--standalone-)
  - [Usage with Amplience Images](#usage-with-amplience-images)
- [Pre-requisites](#pre-requisites)
- [🏁 Quickstart](#---quickstart)
  - [Register Extension](#register-extension)
  - [Extension Permissions](#extension-permissions)
  - [Extension Installation Parameters](#extension-installation-parameters)
    - [Aprimo Only (Standalone)](#aprimo-only--standalone--1)
    - [Amplience Images](#amplience-images)
  - [Snippet (Optional)](#snippet--optional-)
    - [Aprimo Only (Standalone)](#aprimo-only--standalone--2)
    - [Amplience Images](#amplience-images-1)
- [Example Schema](#example-schema)
- [Integration](#integration)
  - [Standalone (Aprimo)](#standalone--aprimo-)
  - [Amplience Image (Automated upload of selection)](#amplience-image--automated-upload-of-selection-)
- [Running the extension locally](#running-the-extension-locally)
- [Building and hosting the extension](#building-and-hosting-the-extension)
- [Known Limitations](#known-limitations)
- [Warranty & Support](#warranty---support)
- [FAQ](#faq)

## Usage Detail

### Aprimo Only (Standalone)

- Interface to launch the Aprimo Content Selector in `singlerendition` mode.
- User can select an asset and a rendition.
- Upon selection the JSON data from Aprimo is stored in the content form for use.
- When no asset is selected, a blank card is displayed with the option to add an asset and JSON content is removed.

When an asset (and rendition) have been succesfully selected the card will update to show:

- A preview of the asset (via the selected rendition `publicuri`)
- The title of the selected asset
- The Aprimo ID of the selected asset
- Action buttons which allow the user to:
  - Deep link to the asset directly in Aprimo DAM
  - Remove the asset selected from the Amplience Content form

### Usage with Amplience Images

Process is as per the Aprimo Only (Standalone) usage with the following additions:

- Upon selection, the rendition is automatically uploaded to the Amplience Content Hub and the Amplience Image property is populated.
- The name of the asset uploaded is the in the format `{title}-{rendition.id}` from the aprimo.
- Uses configuration for the following options:
  - Upload to specific Bucket
  - Upload to specific Folder
  - Overwrite assets or rename unique
- Removal of the asset will remove all data (Aprimo and Amplience) from the Amplience Content Form

## Pre-requisites

- Amplience

  - Amplience Dynamic Content Hub
    - Mandatory:
      - Developer permissions or higher to install extension
      - Ability to host extension
    - Optional (for Amplience images):
      - Access to the [Assets Tab](https://amplience.com/developers/docs/user-guides/basics/dynamic-content/assets-tab/) in your Dynamic Content Hub and ability to upload assets vie the Assets Tab
      - Amplience configuration details
        - Media endpoint
        - Default host (only if you have a custom CNAME)
        - Bucket ID to upload assets
        - Folder ID to upload assets

- Aprimo
  - Aprimo DAM
    - Mandatory:
      - User login details with appropriate permissions
      - Tenant URL
      - CDN mode enabled
    - Optional:
      - Aprimo Content Selector configuration

## 🏁 Quickstart

### Register Extension

This extension needs to be [registered](https://amplience.com/docs/development/registeringextensions.html) against a Hub in the Dynamic Content application (Developer -> Extensions), for it to load within that Hub.

- Category: Content Field
- Label: Aprimo Content Selector
- Name: aprimo-content-selector (needs to be unique with the Hub)
- URL: <url_to_hosted_extension> (can be `http://localhost:5173` if you are running the extension locally)
- Description: Aprimo image selector (can be left blank, if you wish)
- Initial height: 200

### Extension Permissions

Under the Permissions tab, select the following:

API Permissions:

> Note: API permissions only required if using Amplience Images

- ✅ Read access
- ✅ Modify access

Sandbox Permissions:

- ✅ Allow Pop-ups
- ✅ Allow Pop-ups to escape sandbox

### Extension Installation Parameters

See below for installation params of the for Aprimo Only and using Amplience Images.

> Note: Params can be part of the extension or in the schema using the extension.

#### Aprimo Only (Standalone)

If only using Aprimo data, use the following installation parameters:

```json
{
  "aprimoConfig": {
    "tenantUrl": "<your_aprimo_dam_tenant_url>",
    "options": {} // Optional (Your Aprimo Content Selector options in JSON format)
  }
}
```

Example `tenantUrl` Format: `https://{youraccount}.dam.aprimo.com`

See [Aprimo documentation](https://developers.aprimo.com/digital-asset-management/aprimo-integration-tools/aprimo-content-selector/) for options.

If no options attribute is listed, then default options JSON will be used which is:

```json
{
  "select": "singlerendition",
  "limitingSearchExpression": "ContentType = \"Image\""
}
```

#### Amplience Images

If only using Amplience Images, use the following installation parameters:

```json
{
  "aprimoConfig": {
    "tenantUrl": "<your_aprimo_dam_tenant_url>",,
    "options": {} // Optional (Your Aprimo Content Selector options in JSON format)
  },
  "amplienceConfig": {
    // optional (only required for Amplience Images)
    "endpoint": "<your_amplience_dam_endpoint>",
    "defaultHost": "<your_amplience_default_host>", // optional (default = `cdn.media.amplience.net`)
    "bucketId": "<your_amplience_dam_bucket_id>", // optional
    "folderId": "<your_amplience_dam_folder_id>", // optional
    "uploadMode": "<your_amplience_upload mode>" // optional - `overwrite` or `renameUnique` (defaults = `overwrite`)
  }
}
```

### Snippet (Optional)

You may also wish to create a [Snippet](https://amplience.com/developers/docs/integrations/extensions/register-use/#adding-snippets-for-content-field-extensions) or mutiple snippets for the extension to make it easier to add to content types. Example below:

#### Aprimo Only (Standalone)

Label:

```
Aprimo Content Selector (Standalone)
```

Body:

```json
{
  "title": "Aprimo Selector",
  "description": "Allows selection of assets from Aprimo DAM",
  "type": "object",
  "ui:extension": {
    "name": "aprimo-content-selector"
  },
  "properties": {
    "aprimoData": {
      "title": "Aprimo Image Data",
      "type": "object"
    }
  }
}
```

#### Amplience Images

Label:

```
Aprimo Content Selector (With Amplience Image)
```

Body:

```json
{
  "title": "Aprimo Selector",
  "description": "Allows selection of assets from Aprimo DAM",
  "type": "object",
  "ui:extension": {
    "name": "aprimo-content-selector"
  },
  "properties": {
    "amplienceImage": {
      "title": "Amplience Image",
      "allOf": [
        {
          "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link"
        }
      ]
    },
    "aprimoData": {
      "title": "Aprimo Image Data",
      "type": "object"
    }
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
      "title": "Aprimo Selector",
      "description": "Allows selection of assets from Aprimo DAM",
      "type": "object",
      "ui:extension": {
        "name": "aprimo-content-selector",
        "params": {}
      },
      "properties": {
        "amplienceImage": {
          "title": "Amplience Image",
          "allOf": [
            {
              "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link"
            }
          ]
        },
        "aprimoData": {
          "title": "Aprimo Image Data",
          "type": "object"
        }
      }
    }
  },
  "propertyOrder": []
}
```

> Note: If you are using the Aprimo Data only (Standalone), then you can remove the `amplienceImage` attribute.

## Integration

### Standalone (Aprimo)

When an asset is selected from Aprimo it is available in the Amplience Content Item JSON payload. The JSON stored is exactly as returned from the Aprimo Content Selector when a rendition is selected.

Example:

```json
"aprimo": {
  "aprimoData":{
    "id": "{{id_of_asset_in_aprimo}}",
    "title": "{{title_of_asset_in_aprimo}}",
    "rendition": {
      "id": "{{id_of_rendition_in_aprimo}}",
      "publicuri": "{{url_path_to_rendition_on_aprimo_cdn}}"
    }
  }
}
```

You will use the `publicuri` of the asset to use the asset and any additional information available that your application requires.

### Amplience Image (Automated upload of selection)

If you have configured your extension with parameters for an `amplienceConfig` and have an Amplience Image attribute in your Schema then selecting an item will return both the Aprimo data for the image as well as a native image object.

Example:

```json
"aprimo": {
  "aprimoData":{
    "id": "{{id_of_asset_in_aprimo}}",
    "title": "{{title_of_asset_in_aprimo}}",
    "rendition": {
      "id": "{{id_of_rendition_in_aprimo}}",
      "publicuri": "{{url_path_to_rendition_on_aprimo_cdn}}"
    }
  },
  "amplienceImage":{
    "_meta": {
      "schema": "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link"
    },
    "id": "{{id_of_asset_in_amplience}}",
    "name": "{{name_of_asset_in_amplience}}",
    "endpoint": "{{amplience_media_endpoint}}",
    "defaultHost": "{{amplience_default_host}}"
  }
}
```

With this response you can use either the `amplienceImage` or the `publicuri` from Aprimo.

The Amplience image has the advantage of load balanced multi-CDN delivery, virtual staging, publishing with content and advanced asset tranformations from the [Amplience Dynamic Media](https://amplience.com/developers/docs/apis/media-delivery/) service, optional [Accelerated Media](https://amplience.com/developers/docs/release-notes/2023/accelerated-media/) tranformations as well as Generative AI capabilities.

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

1. This extension is configured to work with Image assets from Aprimo.

2. This extension is limited to the response data from Aprimo Content Selector for integration.

3. This extension will only work in singleRendition mode for the Aprimo Content Selector as this is the only mode which returns as public URI to the selected asset.

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

A: By default this demonstration only allows selection of content which is `ContentType - "Image"` from Aprimo.

**Q: I have selected an image but a thumbnail is not showing in Amplience**

A: The rendition selected is probably not suitable to display as an image in a web browser. An example may be a `.tif` file where the rendition is also a `.tif`

**Q: Options data for Aprimo looks different**

A: This is because the JSON has propery names without strings in Aprimo (pre-stringified)
