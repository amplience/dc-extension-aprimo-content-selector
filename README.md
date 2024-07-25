# dc-extension-aprimo-content-selector

This extension allows customers to browse and select files from Aprimo DAM directly in Amplience Dynamic Content.

## 🏁 Quickstart

### Register Extension

This extension needs to be [registered](https://amplience.com/docs/development/registeringextensions.html) against a Hub with in the Dynamic Content application (Developer -> Extensions), for it to load within that Hub.

- Category: Content Field
- Label: Aprimo
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

This will produce a `dist` folder in the root of the project. You can use the files to host them statically (e.g. S3) or through your prefered hosting solution (Vercel, Netlify)
