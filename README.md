# Kibo Commerce Shipping Extensibility Template

## What's this for?

Extend the Kibo Commerce platform shipping capabilities by implementing this template to get shipping rates, labels and manifests from the carrier/provider of your choice.

Use this template if you would like to host your shipping extension on an Node Express server or in a Serverless function.

## What's included?

- Typescript definitions for Kibo Commerce Shipping Contracts
- Customizable NodeJS Express server
  Typescript
- Pre-configured routes
- Docker Image
- Unit Test placeholders via Jest

```
.
├── .github/
│   └── worflows
├── .husky
├── __mocks__
├── __tests__                     <-- add/update tests here
├── settings/
│   ├── production.json           <-- environmental configuration here
│   └── sandbox.json
└── src/
    ├── types
    ├── config.ts
    ├── CustomAdapterFactory.ts
    └── CustomShippingAdapter.ts    <--Implement business logic her
```

## How do I start?

1. Configure your shipping extension in the Kibo Commerce Developer Console and use the url this application will be hosted in the "externalUrl" field (link: todo)
   - When running this template locally, use a tool like ngrok to create a public url to your local machine
2. Install your application from the Developer Console into your sandbox or production environment
3. Clone this repository

```bash
    git clone
```

4. Install Dependencies

```bash
    npm install
```

5. Start dev server

```bash
    npm run dev
```

6. Implement the Shipping Extension logic

## Extension Adapter

To create a hosted service, we must provide a `ShippingExtensionFactory` to the express application. The `ShippingExtensionFactory` must return an instance of your custom `ShippingExtensionAdapter`

An example of this is included, `src/CustomAdapterFactory` and does not require any modifications.

## Implement Shipping Extension Adapter

Implement the methods required for your extension in the `src/CustomShippingAdapter.ts` file

Slightly opinionated EasyPost example implementation can be found here.

##### Access to Credentials

The constructor of the ShippingExtensionAdapter will receive a ShippingExtensionContext from the Kibo Commerce Platform. Any credentials configured here will be available for use.

```typescript
class CustomShippingAdapter implements ShippingExtensionAdapter {
  constructor(context: ShippingExtensionContext, logger: Logger, settings?: CustomAdapterSettings) {
    this.context = context
    this.logger = logger
    this.settings = settings
    this.apiKey = context.credentials?.find((credential) => credential.key === 'apiKey')?.value
  }
}
```

##### ShippingExtensionAdapter Interface

```typescript
interface ShippingExtensionAdapter {
  getRates(request: any): Promise<any>
  getLabels(request: any): Promise<any>
  getManifest(request: any): Promise<any>
  getManifestUrl(request: any): Promise<any>
  cancelLabels(request: any): Promise<any>
}
```

### Serverless Hosting

This template can be deployed to serverless environments using any module that can wrap an NodeJS Express application for serverless use, such as [Serverless Http](https://github.com/vendia/serverless-express) or [Serverless Express](https://github.com/vendia/serverless-express)

You will need to pass your adapter factory to the `createHost` function that will return an Express application.

```js
import { createHost } from '@kibocommerce/kibo-paymentgateway-hosting'
import { CustomAdapterFactory } from './CustomAdapterFactory'
// create your paymentgateway adapter factory
const factory = new CustomAdapterFactory()
// create express app instance with factory
const app = createHost(factory)
```

Once you have the app instance, follow the steps to whichever serverless express module you are using

```js
// lambda.js
import serverless from 'serverless-http'
import { createHost } from '@kibocommerce/kibo-paymentgateway-hosting'
import { CustomAdapterFactory } from './CustomAdapterFactory'
// create your paymentgateway adapter factory
const factory = new CustomAdapterFactory()
// create express app instance with factory
const app = createHost(factory)
// wrap app in serverless-http handler
const serverlessHandler = serverless(app)

export const handler = serverlessHandler
```

## Support Docs

- [Shipping Extensiblity Configuration](tbd)
- [EasyPost Shipping Example Implementation](tbd)
